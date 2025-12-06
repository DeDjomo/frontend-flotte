// src/app/(dashboard)/profile/page.tsx
import React from 'react';
import styles from './profile.module.css';

export default function ProfilePage() {
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