import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster as SonnerToaster } from 'react-hot-toast'; // Using react-hot-toast
// Removed incorrect import: import { Toaster } from "@/components/ui/toaster";
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CoverEase - AI Cover Letter Generator',
  description: 'Generate personalized cover letters easily with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        {/* Removed unused ShadCN Toaster component as react-hot-toast is used */}
        <SonnerToaster position="bottom-right" /> {/* React Hot Toast */}
      </body>
    </html>
  );
}
