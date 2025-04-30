'use server';

import { z } from 'zod';
import type { CoverLetterFormValues } from '@/components/cover-letter-form';

// Define the schema for the expected Hugging Face API response
const HuggingFaceResponseSchema = z.array(z.object({
  generated_text: z.string(),
}));

// Define the output schema for the action
const GenerateCoverLetterOutputSchema = z.object({
  success: z.boolean(),
  coverLetter: z.string().optional(),
  error: z.string().optional(),
});
type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;


export async function generateCoverLetterAction(
  input: CoverLetterFormValues // Accept the full form values object
): Promise<GenerateCoverLetterOutput> {
  const huggingFaceToken = process.env.HUGGING_FACE_API_TOKEN;

  if (!huggingFaceToken || huggingFaceToken === "YOUR_HUGGING_FACE_API_TOKEN_HERE") {
    console.error("Hugging Face API token is missing or not configured in .env file.");
    return {
      success: false,
      error: "Server configuration error: Hugging Face API token is missing. Please contact the administrator.",
    };
  }

  // Construct the API URL dynamically based on the selected model
  const API_URL = `https://api-inference.huggingface.co/models/${input.modelId}`;

  // --- Prompt - Keep it generic, suitable for various instruction-following models ---
  // Note: Some models might perform better with slightly different prompt structures.
  // This generic prompt aims for broad compatibility.
  const prompt = `
Generate a professional cover letter based on this information:
Position: ${input.jobTitle}
Company: ${input.companyName}
Key Skills: ${input.skills}
Relevant Experience: ${input.experience}

Instructions:
- Address the hiring manager (use "Dear Hiring Manager," if name unknown).
- State the position and company clearly.
- Highlight relevant skills and experience concisely.
- Express enthusiasm for the role and company.
- Maintain a professional tone.
- Output only the cover letter body, starting with the salutation and ending before the final signature line. Do not include placeholders like "[Your Name]".

Cover Letter:
`;
  // --- End Prompt ---


  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingFaceToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          // Common parameters, might need adjustment per model
          max_new_tokens: 250, // Limit the length
          temperature: 0.7,    // Balance creativity and focus
          top_p: 0.9,          // Nucleus sampling
          do_sample: true,     // Enable sampling for more varied output
          // return_full_text: false, // Often needed to avoid prompt repetition
        },
        // options: { // Some models might need options like this
        //    wait_for_model: true // Useful if models might be loading
        // }
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Hugging Face API error (${input.modelId}): ${response.status} ${response.statusText}`, errorBody);
      // Provide more specific error messages based on status code if possible
      let errorMessage = `Failed to generate cover letter using ${input.modelId}. API returned status ${response.status}.`;
       if (response.status === 401) {
         errorMessage = "Authentication failed. Please check your Hugging Face API token.";
       } else if (response.status === 422) {
           errorMessage = `Invalid input for model ${input.modelId}. Please check the details provided.`;
       } else if (response.status === 503) {
          errorMessage = `The model ${input.modelId} is currently loading or unavailable. Please try again shortly or select a different model.`;
       }
       else {
         errorMessage = `API Error for ${input.modelId} (${response.status}): ${errorBody || response.statusText}`;
       }
      return { success: false, error: errorMessage };
    }

    const result = await response.json();

    // Validate the response structure
    const parsedResult = HuggingFaceResponseSchema.safeParse(result);

    if (!parsedResult.success || !parsedResult.data || parsedResult.data.length === 0 || !parsedResult.data[0].generated_text) {
      console.error("Invalid response structure from Hugging Face API:", result);
      // Try to find text in other common response formats as a fallback
      const generatedTextFallback = result?.generated_text || (Array.isArray(result) && result[0]?.summary_text); // Example for summarization models
      if (generatedTextFallback && typeof generatedTextFallback === 'string') {
          return { success: true, coverLetter: generatedTextFallback.trim() };
      }
      return { success: false, error: "Received an unexpected or empty response format from the generation service." };
    }

    let generatedText = parsedResult.data[0].generated_text.trim();

    // Basic cleaning: Attempt to remove the prompt if the model included it.
    // This is highly dependent on the model's behavior.
    const promptLines = prompt.split('\n');
    const lastPromptLine = promptLines[promptLines.length - 2]?.trim(); // "Cover Letter:"
     if (lastPromptLine && generatedText.startsWith(lastPromptLine)) {
         generatedText = generatedText.substring(lastPromptLine.length).trim();
     } else if (generatedText.toLowerCase().includes("cover letter:")) {
        // More aggressive fallback cleanup
        const lines = generatedText.split('\n');
        const firstMeaningfulLineIndex = lines.findIndex(line => line.trim().toLowerCase().startsWith("dear") || line.trim().length > 10);
        if (firstMeaningfulLineIndex !== -1) {
             generatedText = lines.slice(firstMeaningfulLineIndex).join('\n').trim();
         }
    }


    return {
      success: true,
      coverLetter: generatedText,
    };

  } catch (error) {
    console.error(`Error calling Hugging Face API (${input.modelId}):`, error);
     let errorMessage = `An unexpected error occurred while generating the cover letter with ${input.modelId}.`;
     if (error instanceof Error) {
        // Avoid leaking potentially sensitive details from the error message
        errorMessage = `An error occurred: ${error.name || 'Unknown Error'}. Check server logs for details.`;
     }
    return {
      success: false,
      error: errorMessage,
    };
  }
}
