import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
