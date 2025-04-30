'use client';

import * as React from 'react';

type CoverLetterContextType = {
  coverLetter: string;
  setCoverLetter: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const CoverLetterContext = React.createContext<CoverLetterContextType | undefined>(undefined);

export function CoverLetterProvider({ children }: { children: React.ReactNode }) {
  const [coverLetter, setCoverLetter] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  return (
    <CoverLetterContext.Provider value={{ coverLetter, setCoverLetter, isLoading, setIsLoading }}>
      {children}
    </CoverLetterContext.Provider>
  );
}

export function useCoverLetter() {
  const context = React.useContext(CoverLetterContext);
  if (context === undefined) {
    throw new Error('useCoverLetter must be used within a CoverLetterProvider');
  }
  return context;
}
