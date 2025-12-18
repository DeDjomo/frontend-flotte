// src/app/(admin)/paiements/page.tsx
'use client';

import React from 'react';
import { FiDollarSign, FiCreditCard, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import styles from '../overview/dashboard.module.css';

export default function PaiementsPage() {
    // Données de démonstration
    const stats = {
        revenusTotal: '125,450',
        revenumMensuel: '12,500',
        abonnementsActifs: 45,
        paiementsEnAttente: 3,
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Gestion des Paiements</h1>
                <p className={styles.subtitle}>Suivez les abonnements et paiements des utilisateurs</p>
            </div>

            {/* Statistiques de paiement */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <FiDollarSign />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Revenus Total</p>
                        <p className={styles.statValue}>{stats.revenusTotal} FCFA</p>
                        <p className={styles.statSubtext}>Depuis le début</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                        <FiTrendingUp />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Revenu Mensuel</p>
                        <p className={styles.statValue}>{stats.revenumMensuel} FCFA</p>
                        <p className={styles.statSubtext}>Ce mois</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                        <FiCreditCard />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Abonnements Actifs</p>
                        <p className={styles.statValue}>{stats.abonnementsActifs}</p>
                        <p className={styles.statSubtext}>Utilisateurs payants</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <FiCalendar />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>En Attente</p>
                        <p className={styles.statValue}>{stats.paiementsEnAttente}</p>
                        <p className={styles.statSubtext}>Paiements à traiter</p>
                    </div>
                </div>
            </div>

            {/* Tableau des derniers paiements */}
            <div className={styles.tableSection}>
                <h2 className={styles.sectionTitle}>Derniers Paiements</h2>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Utilisateur</th>
                                <th>Montant</th>
                                <th>Plan</th>
                                <th>Date</th>
                                <th>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td className={styles.userName}>Kant Meukam</td>
                                <td>5,000 FCFA</td>
                                <td>Premium</td>
                                <td>2025-12-15</td>
                                <td><span className={styles.badge}>Payé</span></td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td className={styles.userName}>Jean Dupont</td>
                                <td>3,000 FCFA</td>
                                <td>Standard</td>
                                <td>2025-12-14</td>
                                <td><span className={styles.badge}>Payé</span></td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td className={styles.userName}>Marie Martin</td>
                                <td>5,000 FCFA</td>
                                <td>Premium</td>
                                <td>2025-12-13</td>
                                <td><span className={styles.badge}>En attente</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>Cette page sera connectée au système de paiement prochainement</p>
                </div>
            </div>
        </div>
    );
}
