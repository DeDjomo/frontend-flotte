// src/app/(dashboard)/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FiTruck, FiUsers, FiAlertTriangle, FiPlus, FiMapPin } from 'react-icons/fi';
import StatCard from '@/components/dashboard/StatCard';
import ActionButton from '@/components/dashboard/ActionButton';
import RecentTrips from '@/components/dashboard/RecentTrips';
import { vehicleService, driverService, notificationService, tripService } from '@/app/lib/services';
import styles from './dashboard.module.css';

// Mode développement : données mockées
const USE_MOCK_DATA = false; // Mettre à true pour utiliser les données mockées

const MOCK_DATA = {
  vehicles: [
    {
      vehicleId: 1,
      vehicleMake: "Toyota",
      vehicleName: "Corolla",
      vehicleRegistrationNumber: "CE-123-YA",
      vehicleType: "Berline",
      vehicleFuelLevel: 75,
      vehicleSpeed: 0,
    },
    {
      vehicleId: 2,
      vehicleMake: "Mercedes",
      vehicleName: "Sprinter",
      vehicleRegistrationNumber: "CE-456-YA",
      vehicleType: "Utilitaire",
      vehicleFuelLevel: 45,
      vehicleSpeed: 65,
    }
  ],
  drivers: [
    {
      driverId: 1,
      driverName: "Jean Dupont",
      driverEmail: "jean@example.com",
      driverPhoneNumber: "+237600000000",
    },
    {
      driverId: 2,
      driverName: "Marie Kouam",
      driverEmail: "marie@example.com",
      driverPhoneNumber: "+237611111111",
    }
  ],
  notifications: [
    {
      notificationId: 1,
      notificationSubject: "Maintenance requise",
      notificationContent: "Le véhicule CE-123-YA nécessite une maintenance",
      notificationState: false,
      notificationDateTime: "2024-01-15T10:30:00Z",
    },
    {
      notificationId: 2,
      notificationSubject: "Carburant faible",
      notificationContent: "Le véhicule CE-456-YA a un niveau de carburant bas",
      notificationState: false,
      notificationDateTime: "2024-01-15T11:00:00Z",
    }
  ],
  trips: [
    {
      tripId: 1,
      departurePoint: { type: "Point", coordinates: [11.5021, 3.8480] },
      tripStartDate: "2024-01-15T08:30:00Z",
      tripStatus: "ongoing",
      vehicleId: 1,
      driverId: 1,
    }
  ]
};

interface DashboardStats {
  vehiclesCount: number;
  activeVehicles: number;
  inactiveVehicles: number;
  driversCount: number;
  activeDrivers: number;
  inactiveDrivers: number;
  unreadNotifications: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    vehiclesCount: 0,
    activeVehicles: 0,
    inactiveVehicles: 0,
    driversCount: 0,
    activeDrivers: 0,
    inactiveDrivers: 0,
    unreadNotifications: 0,
  });
  const [recentTrips, setRecentTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        let vehicles: any[] = [];
        let uniqueDrivers: any[] = [];
        let notifications: any[] = [];
        let trips: any[] = [];
        let unreadCount = 0;

        if (USE_MOCK_DATA) {
          // Utiliser les données mockées
          console.log('Mode développement : utilisation des données mockées');
          vehicles = MOCK_DATA.vehicles;
          uniqueDrivers = MOCK_DATA.drivers;
          notifications = MOCK_DATA.notifications;
          trips = MOCK_DATA.trips;
          unreadCount = notifications.filter(n => !n.notificationState).length;
        } else {
          // Appeler l'API réelle
          const userId = 1; // TODO: Récupérer depuis la session

          console.log('📡 Récupération des véhicules...');
          vehicles = await vehicleService.getVehiclesByUser(userId);
          console.log('✅ Véhicules récupérés:', vehicles.length);

          console.log('📡 Récupération des chauffeurs...');
          uniqueDrivers = await driverService.getDriversByUser(userId);
          console.log('✅ Chauffeurs récupérés:', uniqueDrivers.length);

          console.log('📡 Récupération des notifications non lues...');
          try {
            unreadCount = await notificationService.countUnreadNotifications(userId);
            console.log('✅ Notifications non lues:', unreadCount);
          } catch (err) {
            console.warn('⚠️ Impossible de récupérer le nombre de notifications non lues');
          }

          console.log('📡 Récupération des trajets...');
          try {
            trips = await tripService.getOngoingTrips();
            console.log('✅ Trajets en cours récupérés:', trips.length);
          } catch (err) {
            console.warn('⚠️ Impossible de récupérer les trajets');
          }
        }

        // Calculer les statistiques avec les fonctions utilitaires
        const vehiclesCount = vehicleService.countUserVehicles(vehicles);
        const driversCount = driverService.countUserDrivers(uniqueDrivers);
        const activeVehicles = vehicles.length;
        const inactiveVehicles = 0;
        const activeDriversCount = uniqueDrivers.length;
        const inactiveDriversCount = 0;

        setStats({
          vehiclesCount,
          activeVehicles,
          inactiveVehicles,
          driversCount,
          activeDrivers: activeDriversCount,
          inactiveDrivers: inactiveDriversCount,
          unreadNotifications: unreadCount,
        });

        setRecentTrips(trips.slice(0, 5));
        console.log('Dashboard chargé avec succès');

      } catch (err) {
        console.error(' Erreur lors du chargement des données:', err);
        setError('Le serveur backend ne répond pas. Veuillez le démarrer ou activer le mode développement (USE_MOCK_DATA = true)');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => window.location.reload()} style={{ marginRight: '0.5rem' }}>
              Réessayer
            </button>
            <button onClick={() => {
              // Copier une commande pour démarrer le backend
              navigator.clipboard.writeText('cd fleetman-backend && ./mvnw spring-boot:run');
              alert('Commande copiée ! Collez-la dans votre terminal pour démarrer le backend.');
            }}>
              Copier la commande de démarrage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <p className={styles.breadcrumb}>Dashboard</p>
      <h1 className={styles.title}>APERÇU DE MA FLOTTE DE VÉHICULES</h1>
      
      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        <StatCard
          icon={<FiTruck />}
          title="Véhicules"
          count={stats.vehiclesCount}
          label="Total De Véhicules"
          activeCount={stats.activeVehicles}
          activeLabel="Actifs"
          inactiveCount={stats.inactiveVehicles}
          inactiveLabel="Inactifs"
          href="/vehicules"
          loading={loading}
        />

        <StatCard
          icon={<FiUsers />}
          title="Chauffeurs"
          count={stats.driversCount}
          label="Nombre De Chauffeurs"
          activeCount={stats.activeDrivers}
          activeLabel="En Service"
          inactiveCount={stats.inactiveDrivers}
          inactiveLabel="Au Repos"
          href="/chauffeurs"
          loading={loading}
        />

        <StatCard
          icon={<FiAlertTriangle />}
          title="Alertes"
          count={stats.unreadNotifications}
          label="Alertes Non Lues"
          href="/alertes"
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <div className={styles.actionsSection}>
        <h2 className={styles.sectionTitle}>ACTIONS RAPIDES</h2>
        <div className={styles.actionsGrid}>
          <ActionButton
            icon={<FiPlus />}
            label="Ajouter Un Véhicule"
            href="/vehicules/nouveau"
          />
          <ActionButton
            icon={<FiPlus />}
            label="Ajouter Un Chauffeur"
            href="/chauffeurs/nouveau"
          />
          <ActionButton
            icon={<FiMapPin />}
            label="Voir Les Positions"
            href="/positions"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentTrips trips={recentTrips} loading={loading} />
    </div>
  );
}