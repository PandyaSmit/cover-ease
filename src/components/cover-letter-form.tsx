// @ts-nocheck
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCoverLetter } from '@/context/cover-letter-context';
import { generateCoverLetterAction } from '@/app/actions/cover-letter-actions';
import { toast } from 'react-hot-toast';
import { Loader2, Briefcase, Building, Wrench, PenTool, BrainCircuit } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


// List of available models
const availableModels = [
  { id: 'google/flan-t5-base', name: 'Flan-T5 Base' },
  { id: 'tiiuae/falcon-rw-1b', name: 'Falcon RW 1B' },
  { id: 'microsoft/phi-1_5', name: 'Phi 1.5' },
] as const; // Use 'as const' for stricter typing

const formSchema = z.object({
  jobTitle: z.string().min(2, { message: 'Job title must be at least 2 characters.' }),
  companyName: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  skills: z.string().min(5, { message: 'Please list some relevant skills.' }),
  experience: z.string().min(10, { message: 'Please describe your relevant experience (at least 10 characters).' }),
  modelId: z.enum(availableModels.map(m => m.id) as [string, ...string[]], { // Ensure modelId is one of the allowed values
      errorMap: () => ({ message: "Please select a valid AI model." })
    }),
});


export type CoverLetterFormValues = z.infer<typeof formSchema>;

export function CoverLetterForm() {
  const { setCoverLetter, setIsLoading, isLoading } = useCoverLetter();
  const form = useForm<CoverLetterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: '',
      companyName: '',
      skills: '',
      experience: '',
      modelId: availableModels[0].id, // Default to the first model in the list
    },
    mode: 'onChange', // Validate on change for better UX
  });

  const onSubmit = async (values: CoverLetterFormValues) => {
    setIsLoading(true);
    setCoverLetter(''); // Clear previous letter
    const toastId = toast.loading('Generating cover letter...'); // Show loading toast

    const result = await generateCoverLetterAction(values); // Pass all form values, including modelId

    toast.dismiss(toastId); // Dismiss loading toast

    if (result.success && result.coverLetter) {
      setCoverLetter(result.coverLetter);
      toast.success('Cover letter generated successfully!', { id: 'generate-success'});
    } else {
      console.error('Generation failed:', result.error);
      // Ensure a user-friendly error message is always shown
      const errorMessage = result.error || 'Failed to generate cover letter. An unknown error occurred.';
      toast.error(errorMessage, { id: 'generate-error'});
      setCoverLetter(`Error generating cover letter. Please check your input and try again. Some models might be unavailable or require specific prompt structures.`);
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
            control={form.control}
            name="modelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><BrainCircuit /> AI Model</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an AI model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><Briefcase /> Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><Building /> Company Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Tech Innovations Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><Wrench /> Key Skills</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List skills relevant to the job (e.g., React, Node.js, Project Management, Communication)"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><PenTool /> Relevant Experience</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Briefly describe your experience related to this job..."
                  className="resize-none"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Cover Letter'
          )}
        </Button>
      </form>
    </Form>
  );
}
