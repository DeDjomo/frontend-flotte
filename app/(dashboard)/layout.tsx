// src/app/(dashboard)/layout.tsx
'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const userName = user?.userName || 'Utilisateur';

  return (
    <ProtectedRoute>
      <AppLayout userName={userName}>{children}</AppLayout>
    </ProtectedRoute>
  );
}