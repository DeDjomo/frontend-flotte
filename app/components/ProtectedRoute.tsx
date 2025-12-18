'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Attendre que l'AuthContext ait fini de charger
    if (!loading && !isAuthenticated) {
      console.log('🚫 Utilisateur non connecté, redirection vers /login');
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1e293b 50%, #0f172a 100%)',
      }}>
        <div style={{
          textAlign: 'center',
          color: '#f8fafc',
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255, 255, 255, 0.1)',
            borderTopColor: '#06b6d4',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Vérification...</p>
        </div>
      </div>
    );
  }

  // Si pas authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated) {
    return null;
  }

  // Si authentifié, afficher le contenu protégé
  return <>{children}</>;
}