// src/components/dashboard/RecentTrips.tsx
'use client';

import React from 'react';
import { FiClock } from 'react-icons/fi';
import styles from './RecentTrips.module.css';

interface Trip {
  tripId: number;
  departurePoint: {
    coordinates: [number, number];
  };
  arrivalPoint?: {
    coordinates: [number, number];
  };
  tripStartDate: string;
  tripEndDate?: string;
  tripStatus: 'ongoing' | 'completed' | 'cancelled';
  vehicleId: number;
  driverId: number;
}

interface RecentTripsProps {
  trips: Trip[];
  loading?: boolean;
}

const RecentTrips: React.FC<RecentTripsProps> = ({ trips, loading = false }) => {
  if (loading) {
    return (
      <div className={styles.activitySection}>
        <h2 className={styles.sectionTitle}>ACTIVITÉ RÉCENTE</h2>
        <div className={styles.activityCard}>
          <div className={styles.activityHeader}>
            <h3>Derniers Trajets</h3>
          </div>
          <div className={styles.activityContent}>
            <p className={styles.loadingState}>Chargement des trajets...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!trips || trips.length === 0) {
    return (
      <div className={styles.activitySection}>
        <h2 className={styles.sectionTitle}>ACTIVITÉ RÉCENTE</h2>
        <div className={styles.activityCard}>
          <div className={styles.activityHeader}>
            <h3>Derniers Trajets</h3>
          </div>
          <div className={styles.activityContent}>
            <p className={styles.emptyState}>Les Trajets Récents S'afficheront Ici</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'ongoing':
        return styles.statusOngoing;
      case 'completed':
        return styles.statusCompleted;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  return (
    <div className={styles.activitySection}>
      <h2 className={styles.sectionTitle}>ACTIVITÉ RÉCENTE</h2>
      <div className={styles.activityCard}>
        <div className={styles.activityHeader}>
          <h3>Derniers Trajets</h3>
        </div>
        <div className={styles.activityContent}>
          <div className={styles.tripsList}>
            {trips.map((trip) => (
              <div key={trip.tripId} className={styles.tripItem}>
                <div className={styles.tripInfo}>
                  <div className={styles.tripHeader}>
                    <span className={styles.tripId}>Trajet #{trip.tripId}</span>
                    <span className={`${styles.tripStatus} ${getStatusClass(trip.tripStatus)}`}>
                      {getStatusLabel(trip.tripStatus)}
                    </span>
                  </div>
                  <div className={styles.tripDetails}>
                    <div className={styles.tripDetail}>
                      <FiClock className={styles.tripIcon} />
                      <span>{formatDate(trip.tripStartDate)}</span>
                    </div>
                    {trip.tripEndDate && (
                      <div className={styles.tripDetail}>
                        <FiClock className={styles.tripIcon} />
                        <span>{formatDate(trip.tripEndDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTrips;