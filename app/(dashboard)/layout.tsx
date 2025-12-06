// src/app/(dashboard)/layout.tsx
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Récupérer le userName depuis la session/auth plus tard
  const userName = 'Kant Meukam'; // Vous pouvez changer ce nom

  return <AppLayout userName={userName}>{children}</AppLayout>;
}