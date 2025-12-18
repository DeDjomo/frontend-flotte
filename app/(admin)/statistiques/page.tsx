// src/app/(admin)/statistiques/page.tsx
'use client';

import React from 'react';
import { FiTrendingUp, FiActivity, FiBarChart, FiPieChart } from 'react-icons/fi';
import styles from '../overview/dashboard.module.css';

export default function StatistiquesPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Statistiques Avancées</h1>
                <p className={styles.subtitle}>Analyses et rapports détaillés de l'application</p>
            </div>

            {/* Statistiques */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                        <FiTrendingUp />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Croissance Utilisateurs</p>
                        <p className={styles.statValue}>+12%</p>
                        <p className={styles.statSubtext}>Ce mois</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <FiActivity />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Taux d'Activité</p>
                        <p className={styles.statValue}>87%</p>
                        <p className={styles.statSubtext}>Utilisateurs actifs</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                        <FiBarChart />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Distance Parcourue</p>
                        <p className={styles.statValue}>45,230 km</p>
                        <p className={styles.statSubtext}>Ce mois</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
                        <FiPieChart />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Trajets Complétés</p>
                        <p className={styles.statValue}>1,234</p>
                        <p className={styles.statSubtext}>Ce mois</p>
                    </div>
                </div>
            </div>

            <div className={styles.tableSection}>
                <h2 className={styles.sectionTitle}>Rapports Disponibles</h2>

                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        padding: '3rem 2rem',
                        background: 'var(--card-bg)',
                        borderRadius: '16px',
                        border: '2px dashed var(--border-color)',
                    }}>
                        <FiBarChart size={64} style={{ color: 'var(--primary-color)', marginBottom: '1rem' }} />
                        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                            Statistiques Avancées
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Les rapports détaillés et analyses avancées seront disponibles prochainement.
                        </p>
                        <ul style={{
                            textAlign: 'left',
                            color: 'var(--text-secondary)',
                            listStyle: 'none',
                            padding: 0,
                        }}>
                            <li style={{ marginBottom: '0.75rem' }}>✓ Rapports d'utilisation mensuels</li>
                            <li style={{ marginBottom: '0.75rem' }}>✓ Analyses de performance par utilisateur</li>
                            <li style={{ marginBottom: '0.75rem' }}>✓ Statistiques de consommation de carburant</li>
                            <li style={{ marginBottom: '0.75rem' }}>✓ Historique des trajets</li>
                            <li style={{ marginBottom: '0.75rem' }}>✓ Export de données (CSV, PDF)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
