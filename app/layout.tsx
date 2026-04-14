import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VVS Chatflow MVP',
  description: 'Chatbaseret VVS lead- og estimatprototype'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  );
}
