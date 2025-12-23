import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RelancePro',
  description: 'Relances automatiques et suivi des factures en toute simplicité.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
