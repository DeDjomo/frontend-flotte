// src/app/(admin)/utilisateurs/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FiUsers, FiTruck, FiUser, FiEdit, FiTrash2 } from 'react-icons/fi';
import userService from '@/app/lib/services/userService';
import vehicleService from '@/app/lib/services/vehicleService';
import driverService from '@/app/lib/services/driverService';
import { SafeUser } from '@/app/types';
import styles from '../overview/dashboard.module.css';

interface UserStats extends SafeUser {
    vehicleCount: number;
    driverCount: number;
}

export default function UtilisateursPage() {
    const [users, setUsers] = useState<UserStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const allUsers = await userService.getAllUsers();

            const usersWithStats = await Promise.all(
                allUsers.map(async (user) => {
                    try {
                        const vehicles = await vehicleService.getVehiclesByUser(user.userId);
                        const vehicleCount = vehicleService.countUserVehicles(vehicles);

                        const drivers = await driverService.getDriversByUser(user.userId);
                        const driverCount = driverService.countUserDrivers(drivers);

                        return {
                            ...user,
                            vehicleCount,
                            driverCount,
                        };
                    } catch (err) {
                        console.error(`Erreur pour l'utilisateur ${user.userId}:`, err);
                        return {
                            ...user,
                            vehicleCount: 0,
                            driverCount: 0,
                        };
                    }
                })
            );

            setUsers(usersWithStats);
        } catch (err) {
            console.error('Erreur lors de la récupération des utilisateurs:', err);
            setError('Impossible de charger les utilisateurs. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Chargement des utilisateurs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.errorContainer}>
                    <p className={styles.errorText}>{error}</p>
                    <button onClick={fetchUsers} className={styles.retryButton}>
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Gestion des Utilisateurs</h1>
                <p className={styles.subtitle}>Gérez tous les utilisateurs de FleetMan</p>
            </div>

            {/* Statistiques rapides */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                        <FiUsers />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Total Utilisateurs</p>
                        <p className={styles.statValue}>{users.length}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                        <FiTruck />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Total Véhicules</p>
                        <p className={styles.statValue}>{users.reduce((sum, u) => sum + u.vehicleCount, 0)}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
                        <FiUser />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Total Chauffeurs</p>
                        <p className={styles.statValue}>{users.reduce((sum, u) => sum + u.driverCount, 0)}</p>
                    </div>
                </div>
            </div>

            {/* Barre de recherche */}
            <div className={styles.tableSection}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <input
                        type="text"
                        placeholder="Rechercher un utilisateur..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            maxWidth: '400px',
                            padding: '0.75rem 1rem',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            background: 'var(--card-bg)',
                            color: 'var(--text-primary)',
                        }}
                    />
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Téléphone</th>
                                <th>Véhicules</th>
                                <th>Chauffeurs</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.userId}>
                                    <td>{user.userId}</td>
                                    <td className={styles.userName}>{user.userName}</td>
                                    <td>{user.userEmail}</td>
                                    <td>{user.userPhoneNumber || 'N/A'}</td>
                                    <td>
                                        <span className={styles.badge}>{user.vehicleCount}</span>
                                    </td>
                                    <td>
                                        <span className={styles.badge}>{user.driverCount}</span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                style={{
                                                    padding: '0.5rem',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: 'var(--primary-color)',
                                                }}
                                                title="Modifier"
                                            >
                                                <FiEdit size={18} />
                                            </button>
                                            <button
                                                style={{
                                                    padding: '0.5rem',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: 'var(--danger-color)',
                                                }}
                                                title="Supprimer"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div className={styles.emptyState}>
                            <p>Aucun utilisateur trouvé</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
