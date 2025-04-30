'use client';

import * as React from 'react';
import { useCoverLetter } from '@/context/cover-letter-context';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function CoverLetterDisplay() {
  const { coverLetter, isLoading } = useCoverLetter();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!coverLetter || isLoading) return;
    navigator.clipboard.writeText(coverLetter)
      .then(() => {
        setCopied(true);
        toast.success('Copied to clipboard!', { id: 'copy-success' });
        setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast.error('Failed to copy text.', { id: 'copy-error' });
      });
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
       <h2 className="text-xl font-semibold text-center md:text-left">Generated Cover Letter</h2>
      <div className="relative flex-grow">
        <ScrollArea className="h-[400px] md:h-full w-full rounded-md border p-4 bg-secondary/30">
          {isLoading ? (
             <div className="space-y-2">
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[70%]" />
              <Skeleton className="h-4 w-[85%]" />
              <Skeleton className="h-4 w-[95%]" />
               <Skeleton className="h-4 w-[75%]" />
              <Skeleton className="h-4 w-[88%]" />
             </div>
          ) : coverLetter ? (
            <pre className="whitespace-pre-wrap text-sm font-sans">{coverLetter}</pre>
          ) : (
            <p className="text-muted-foreground italic text-center pt-10">
              Your generated cover letter will appear here.
            </p>
          )}
        </ScrollArea>
        {/* {!isLoading && coverLetter && (
           <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            onClick={handleCopy}
            aria-label="Copy cover letter"
          >
            {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
          </Button>
        )} */}
      </div>
       {!isLoading && coverLetter && (
         <Button
          variant="outline"
          className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={handleCopy}
        >
          {copied ? <><Check className="mr-2 h-4 w-4"/> Copied!</> : <><Copy className="mr-2 h-4 w-4" /> Copy to Clipboard</>}
        </Button>
       )}
    </div>
  );
}
