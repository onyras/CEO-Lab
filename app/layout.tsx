import type { Metadata } from 'next';
import { Inter, Space_Mono } from 'next/font/google';
import './globals.css';
import { FeedbackWidget } from '@/components/shared/FeedbackWidget';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'CEO Lab - Leadership Assessment & Development',
  description: 'Measure and track your leadership development across Leading Yourself, Teams, and Organizations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <body className={`${inter.className} antialiased`}>
        {children}
        <FeedbackWidget />
      </body>
    </html>
  );
}
