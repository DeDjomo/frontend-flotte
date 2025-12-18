// src/app/(admin)/parametres/page.tsx
'use client';

import React from 'react';
import { FiSettings, FiMail, FiDatabase, FiShield, FiGlobe } from 'react-icons/fi';
import styles from '../overview/dashboard.module.css';

export default function ParametresPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Paramètres de l'Application</h1>
                <p className={styles.subtitle}>Configurez les paramètres globaux de FleetMan</p>
            </div>

            <div className={styles.tableSection}>
                <h2 className={styles.sectionTitle}>Configuration</h2>

                <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px' }}>
                    {/* Paramètre Email */}
                    <div style={{
                        padding: '1.5rem',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                            }}>
                                <FiMail size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Notifications Email</h3>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    Configurer les notifications par email
                                </p>
                            </div>
                        </div>
                        <button style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                        }}>
                            Configurer
                        </button>
                    </div>

                    {/* Paramètre Base de données */}
                    <div style={{
                        padding: '1.5rem',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                            }}>
                                <FiDatabase size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Sauvegarde de Données</h3>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    Gérer les sauvegardes automatiques
                                </p>
                            </div>
                        </div>
                        <button style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                        }}>
                            Gérer
                        </button>
                    </div>

                    {/* Paramètre Sécurité */}
                    <div style={{
                        padding: '1.5rem',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                            }}>
                                <FiShield size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Sécurité et Accès</h3>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    Paramètres de sécurité et d'authentification
                                </p>
                            </div>
                        </div>
                        <button style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                        }}>
                            Gérer
                        </button>
                    </div>

                    {/* Paramètre Localisation */}
                    <div style={{
                        padding: '1.5rem',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                            }}>
                                <FiGlobe size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Région et Langue</h3>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    Configurer la langue et les paramètres régionaux
                                </p>
                            </div>
                        </div>
                        <button style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                        }}>
                            Configurer
                        </button>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>Les fonctionnalités de configuration seront complétées prochainement</p>
                </div>
            </div>
        </div>
    );
}
