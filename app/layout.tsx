// src/app/layout.tsx (Root Layout)
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

import { ModalProvider } from '@/app/contexts/ModalContext';

export const metadata: Metadata = {
  title: 'FleetMan - Gestion de Flotte',
  description: 'Système de gestion de flotte de véhicules',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ModalProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}