import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';

const FeedbackWidget = dynamic(
  () => import('@/components/shared/FeedbackWidget').then(mod => mod.FeedbackWidget),
  { ssr: false }
);

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
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
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
        <FeedbackWidget />
      </body>
    </html>
  );
}
