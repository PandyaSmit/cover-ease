import { CoverLetterForm } from '@/components/cover-letter-form';
import { CoverLetterDisplay } from '@/components/cover-letter-display';
import { CoverLetterProvider } from '@/context/cover-letter-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <CoverLetterProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-4xl shadow-lg">
          <CardHeader className="text-center border-b pb-4">
            <CardTitle className="text-3xl font-bold text-primary">CoverEase</CardTitle>
            <CardDescription className="text-muted-foreground">
              Generate your personalized cover letter using AI
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <CoverLetterForm />
            <CoverLetterDisplay />
          </CardContent>
        </Card>
        <footer className="mt-8 text-center text-muted-foreground text-sm">
          Powered by Hugging Face & Next.js
        </footer>
      </div>
    </CoverLetterProvider>
  );
}
