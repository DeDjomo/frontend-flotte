// src/app/(dashboard)/vehicules/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiTrash2, FiTruck } from 'react-icons/fi';
import { vehicleService } from '@/app/lib/services';
import { useAuth } from '@/app/contexts/AuthContext';
import styles from './vehicules.module.css';
import { useRouter } from 'next/navigation';

// Mock data pour les tests
const MOCK_VEHICLES = [
  {
    vehicleId: 1,
    vehicleRegistrationNumber: 'CE237BE',
    vehicleMake: 'Toyota',
    vehicleType: 'Taxi',
    vehicleStatus: 'active',
  },
  {
    vehicleId: 2,
    vehicleRegistrationNumber: 'CE237BE',
    vehicleMake: 'Toyota',
    vehicleType: 'Taxi',
    vehicleStatus: 'active',
  },
  {
    vehicleId: 3,
    vehicleRegistrationNumber: 'CE237BE',
    vehicleMake: 'Toyota',
    vehicleType: 'Taxi',
    vehicleStatus: 'inactive',
  },
];

const USE_MOCK_DATA = false; // Mettre à true pour utiliser les données mockées

interface Vehicle {
  vehicleId: number;
  vehicleRegistrationNumber: string;
  vehicleMake: string;
  vehicleType: string;
  vehicleStatus?: string;
  vehicleName?: string;
}

export default function VehiculesPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user?.userId) {
      fetchVehicles();
    }
  }, [user]);

  const fetchVehicles = async () => {
    if (!user?.userId) return;

    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        console.log('🧪 Mode développement : utilisation des données mockées');
        setVehicles(MOCK_VEHICLES);
      } else {
        console.log('📡 Récupération des véhicules...');
        const data = await vehicleService.getVehiclesByUser(user.userId);
        console.log('✅ Véhicules récupérés:', data.length);
        setVehicles(data);
      }
    } catch (err) {
      console.error('❌ Erreur lors du chargement des véhicules:', err);
      setError('Impossible de charger les véhicules');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vehicleId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      return;
    }

    try {
      setDeletingId(vehicleId);
      console.log('Suppression du véhicule:', vehicleId);
      await vehicleService.deleteVehicle(vehicleId);
      console.log('Véhicule supprimé');
      
      // Recharger la liste
      await fetchVehicles();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert('Impossible de supprimer ce véhicule');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusLabel = (status?: string) => {
    // TODO: Utiliser le vrai statut quand l'API le gérera
    // Pour l'instant, tous les véhicules sont "En Service"
    if (status === 'inactive') {
      return 'H. Service';
    }
    return 'En Service';
  };

  const getStatusClass = (status?: string) => {
    if (status === 'inactive') {
      return styles.statusInactive;
    }
    return styles.statusActive;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.breadcrumb}>Mes Véhicules</p>
        <div className={styles.header}>
          <h1 className={styles.title}>Mes Véhicules</h1>
        </div>
        <div className={styles.loading}>Chargement des véhicules...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.breadcrumb}>Mes Véhicules</p>
        <div className={styles.header}>
          <h1 className={styles.title}>Mes Véhicules</h1>
        </div>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchVehicles}>Réessayer</button>
        </div>
      </div>
    );
  }

  // État vide
  if (vehicles.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.breadcrumb}>Mes Véhicules</p>
        <div className={styles.header}>
          <h1 className={styles.title}>Mes Véhicules</h1>
          <Link href="/vehicules/nouveau" className={styles.addButton}>
            <FiPlus /> Nouveau véhicule
          </Link>
        </div>

        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>Aucun Véhicule Enregistré</h2>
          <p className={styles.emptyText}>
            Cliquez sur le bouton pour en resgister un nouveau véhicule
          </p>
          <Link href="/vehicules/nouveau" className={styles.emptyButton}>
            <FiPlus /> Enregistrer un véhicule
          </Link>
        </div>
      </div>
    );
  }
  // Liste des véhicules
  return (
    
    <div className={styles.container}>
      <p className={styles.breadcrumb}>Mes Véhicules</p>
      
      <div className={styles.header}>
        <h1 className={styles.title}>Mes Véhicules</h1>
        <Link href="/vehicules/nouveau" className={styles.addButton}>
          <FiPlus /> Nouveau véhicule
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Immatriculation</th>
              <th>Marque</th>
              <th>Service</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr 
                key={vehicle.vehicleId} 
                onClick={() => router.push(`/vehicules/${vehicle.vehicleId}`)}
                className={styles.tableRow}
              >

                <td>
                  <div className={styles.vehicleIcon}>
                    <FiTruck />
                  </div>
                </td>
                <td className={styles.registration}>
                  {vehicle.vehicleRegistrationNumber}
                </td>
                <td>{vehicle.vehicleMake}</td>
                <td>{vehicle.vehicleType}</td>
                <td>
                  <span className={`${styles.status} ${getStatusClass(vehicle.vehicleStatus)}`}>
                    {getStatusLabel(vehicle.vehicleStatus)}
                  </span>
                </td>
                <td>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(vehicle.vehicleId)}
                    disabled={deletingId === vehicle.vehicleId}
                    aria-label="Supprimer"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}