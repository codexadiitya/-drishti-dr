import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'Drishti-DR | AI-Powered Retinal Screening Platform',
  description:
    'National Tele-Ophthalmology and AI-Powered Diabetic Retinopathy Screening Clinical Platform for Primary Health Centers.',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans flex flex-col">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
