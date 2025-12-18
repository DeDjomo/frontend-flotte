// src/app/(dashboard)/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FiUsers, FiTruck, FiUser, FiTrendingUp, FiActivity, FiBarChart2 } from 'react-icons/fi';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import userService from '@/app/lib/services/userService';
import vehicleService from '@/app/lib/services/vehicleService';
import driverService from '@/app/lib/services/driverService';
import { SafeUser } from '@/app/types';
import styles from './dashboard.module.css';

// Interface pour les statistiques étendues d'un utilisateur
interface UserStats extends SafeUser {
    vehicleCount: number;
    driverCount: number;
}

// Couleurs pour les graphiques
const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminPage() {
    const [users, setUsers] = useState<UserStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalVehicles, setTotalVehicles] = useState(0);
    const [totalDrivers, setTotalDrivers] = useState(0);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Récupérer tous les utilisateurs
            const allUsers = await userService.getAllUsers();
            setTotalUsers(allUsers.length);

            // 2. Pour chaque utilisateur, récupérer le nombre de véhicules et chauffeurs
            const usersWithStats = await Promise.all(
                allUsers.map(async (user) => {
                    try {
                        // Récupérer les véhicules de l'utilisateur
                        const vehicles = await vehicleService.getVehiclesByUser(user.userId);
                        const vehicleCount = vehicleService.countUserVehicles(vehicles);

                        // Récupérer les chauffeurs de l'utilisateur
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

            // Calculer les totaux
            const totalV = usersWithStats.reduce((sum, user) => sum + user.vehicleCount, 0);
            const totalD = usersWithStats.reduce((sum, user) => sum + user.driverCount, 0);

            setTotalVehicles(totalV);
            setTotalDrivers(totalD);
        } catch (err) {
            console.error('Erreur lors de la récupération des données admin:', err);
            setError('Impossible de charger les données. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    // Calculer les métriques avancées
    const avgVehiclesPerUser = totalUsers > 0 ? (totalVehicles / totalUsers).toFixed(1) : '0';
    const avgDriversPerUser = totalUsers > 0 ? (totalDrivers / totalUsers).toFixed(1) : '0';

    // Préparer les données pour le graphique en barres (Top 10 utilisateurs)
    const top10Users = [...users]
        .sort((a, b) => b.vehicleCount - a.vehicleCount)
        .slice(0, 10)
        .map(user => ({
            name: user.userName.length > 15 ? user.userName.substring(0, 12) + '...' : user.userName,
            vehicules: user.vehicleCount,
            chauffeurs: user.driverCount,
        }));

    // Préparer les données pour le graphique circulaire (répartition des utilisateurs)
    const userDistribution = [
        { name: 'Sans véhicule', value: users.filter(u => u.vehicleCount === 0).length },
        { name: '1-2 véhicules', value: users.filter(u => u.vehicleCount >= 1 && u.vehicleCount <= 2).length },
        { name: '3-5 véhicules', value: users.filter(u => u.vehicleCount >= 3 && u.vehicleCount <= 5).length },
        { name: '6+ véhicules', value: users.filter(u => u.vehicleCount >= 6).length },
    ].filter(item => item.value > 0);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Chargement des statistiques...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.errorContainer}>
                    <p className={styles.errorText}>{error}</p>
                    <button onClick={fetchAdminData} className={styles.retryButton}>
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Tableau de Bord Administrateur</h1>
                <p className={styles.subtitle}>Vue d'ensemble de l'application FleetMan</p>
            </div>

            {/* Cartes de statistiques globales - Vue Améliorée */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                        <FiUsers />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Utilisateurs</p>
                        <p className={styles.statValue}>{totalUsers}</p>
                        <p className={styles.statSubtext}>Total inscrits</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                        <FiTruck />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Véhicules</p>
                        <p className={styles.statValue}>{totalVehicles}</p>
                        <p className={styles.statSubtext}>Total enregistrés</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
                        <FiUser />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Chauffeurs</p>
                        <p className={styles.statValue}>{totalDrivers}</p>
                        <p className={styles.statSubtext}>Total actifs</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <FiTrendingUp />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Ratio Véh./User</p>
                        <p className={styles.statValue}>{avgVehiclesPerUser}</p>
                        <p className={styles.statSubtext}>Moyenne par utilisateur</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <FiActivity />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Ratio Chauf./User</p>
                        <p className={styles.statValue}>{avgDriversPerUser}</p>
                        <p className={styles.statSubtext}>Moyenne par utilisateur</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                        <FiBarChart2 />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Taux d'utilisation</p>
                        <p className={styles.statValue}>
                            {totalUsers > 0 ? Math.round((users.filter(u => u.vehicleCount > 0).length / totalUsers) * 100) : 0}%
                        </p>
                        <p className={styles.statSubtext}>Users avec véhicules</p>
                    </div>
                </div>
            </div>

            {/* Section des graphiques */}
            <div className={styles.chartsSection}>
                <div className={styles.chartContainer}>
                    <h2 className={styles.chartTitle}>Top 10 Utilisateurs - Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={top10Users}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                            <XAxis dataKey="name" stroke="var(--text-secondary)" />
                            <YAxis stroke="var(--text-secondary)" />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                }}
                            />
                            <Legend />
                            <Bar dataKey="vehicules" fill="#3b82f6" name="Véhicules" />
                            <Bar dataKey="chauffeurs" fill="#8b5cf6" name="Chauffeurs" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className={styles.chartContainer}>
                    <h2 className={styles.chartTitle}>Répartition des Utilisateurs par Flotte</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={userDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {userDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tableau des utilisateurs */}
            <div className={styles.tableSection}>
                <h2 className={styles.sectionTitle}>Détails par Utilisateur</h2>

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
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
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
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {users.length === 0 && (
                        <div className={styles.emptyState}>
                            <p>Aucun utilisateur trouvé</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
