'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import styles from './login.module.css';
import { FiMail, FiLock, FiTruck, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ⚠️ PAS DE useEffect POUR LA REDIRECTION AUTO
  // On laisse l'utilisateur se connecter manuellement

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Tentative de connexion...');
      await login(email, password);
      
      console.log('✅ Connexion réussie, redirection...');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('❌ Erreur de connexion:', err);
      
      // Messages d'erreur personnalisés
      if (err.message?.includes('non trouvé')) {
        setError('Aucun compte trouvé avec cet email');
      } else if (err.message?.includes('incorrect')) {
        setError('Mot de passe incorrect');
      } else if (err.message?.includes('réseau') || err.message?.includes('network')) {
        setError('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
      } else {
        setError('Erreur de connexion. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Validation en temps réel
  const isEmailValid = email.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = email.length > 0 && password.length > 0 && isEmailValid;

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        {/* Logo et titre */}
        <div className={styles.header}>
          <div className={styles.logo}>
            <FiTruck className={styles.logoIcon} />
          </div>
          <h1 className={styles.title}>FleetMan</h1>
          <p className={styles.subtitle}>Gestion intelligente de flotte</p>
        </div>

        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error} role="alert">
              <FiAlertCircle aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              <FiMail aria-hidden="true" />
              <span>Email</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="votre.email@example.com"
              required
              autoFocus
              autoComplete="email"
              aria-invalid={!isEmailValid}
              aria-describedby={!isEmailValid ? "email-error" : undefined}
            />
            {!isEmailValid && email.length > 0 && (
              <small id="email-error" style={{ color: 'var(--error-text)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                Format d'email invalide
              </small>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              <FiLock aria-hidden="true" />
              <span>Mot de passe</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || !isFormValid}
            aria-busy={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>

          {/* Informations supplémentaires */}
          <div style={{ 
            marginTop: '1.5rem', 
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            <p style={{ margin: 0 }}>
              Première connexion ? Contactez votre administrateur.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            FleetMan © 2025 - Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  );
}