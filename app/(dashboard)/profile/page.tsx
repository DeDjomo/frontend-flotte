// src/app/(dashboard)/profile/page.tsx
'use client';

import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './profile.module.css';

export default function ProfilePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Mon Profil</h1>
          <p className={styles.subtitle}>Gérez vos informations personnelles</p>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Informations Personnelles</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Nom complet :</span>
                <span className={styles.value}>Kant Meukam</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email :</span>
                <span className={styles.value}>kant.meukam@fleetman.cm</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Téléphone :</span>
                <span className={styles.value}>+237 6XX XXX XXX</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Rôle :</span>
                <span className={styles.value}>Administrateur</span>
              </div>
            </div>
          </div>

          {/* Section Préférences avec le sélecteur de thème */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Préférences</h2>
            <div className={styles.preferenceItem}>
              <div className={styles.preferenceInfo}>
                <span className={styles.preferenceLabel}>Thème de l'interface</span>
                <span className={styles.preferenceDescription}>
                  Choisissez entre le mode clair ou sombre
                </span>
              </div>
              <button
                className={styles.themeToggle}
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre'}
              >
                <span className={styles.themeIcon}>
                  {theme === 'dark' ? <FiMoon /> : <FiSun />}
                </span>
                <span className={styles.themeLabel}>
                  {theme === 'dark' ? 'Mode sombre' : 'Mode clair'}
                </span>
                <span className={styles.themeSwitchTrack}>
                  <span className={`${styles.themeSwitchThumb} ${theme === 'light' ? styles.themeSwitchThumbActive : ''}`}></span>
                </span>
              </button>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Paramètres du Compte</h2>
            <div className={styles.buttonGroup}>
              <button className={styles.button}>Modifier le Profil</button>
              <button className={styles.buttonSecondary}>Changer le Mot de Passe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}