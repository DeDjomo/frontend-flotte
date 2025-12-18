// src/app/(dashboard)/chauffeurs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiTrash2, FiUser, FiEdit2 } from 'react-icons/fi';
import { driverService } from '@/app/lib/services';
import { useAuth } from '@/app/contexts/AuthContext';
import { useModal } from '@/app/contexts/ModalContext';
import styles from './chauffeurs.module.css';
import { useRouter } from 'next/navigation';
import type { Driver } from '@/app/types';

const USE_MOCK_DATA = false;

export default function ChauffeursPage() {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();
  const { showConfirm } = useModal();

  useEffect(() => {
    if (user?.userId) {
      fetchDrivers();
    }
  }, [user]);

  const fetchDrivers = async () => {
    if (!user?.userId) return;

    try {
      setLoading(true);
      setError(null);

      console.log('📡 Récupération des chauffeurs...');
      const data = await driverService.getDriversByUser(user.userId);
      console.log('✅ Chauffeurs récupérés:', data.length);
      setDrivers(data);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des chauffeurs:', err);
      setError('Impossible de charger les chauffeurs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (driverId: number) => {
    if (!await showConfirm({
      title: 'Supprimer le chauffeur',
      message: 'Êtes-vous sûr de vouloir supprimer ce chauffeur ? Cette action est irréversible.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      isDanger: true
    })) {
      return;
    }

    try {
      setDeletingId(driverId);
      console.log('Suppression du chauffeur:', driverId);
      await driverService.deleteDriver(driverId);
      console.log('Chauffeur supprimé');

      // Recharger la liste
      await fetchDrivers();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert('Impossible de supprimer ce chauffeur');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.breadcrumb}>Mes Chauffeurs</p>
        <div className={styles.header}>
          <h1 className={styles.title}>Mes Chauffeurs</h1>
        </div>
        <div className={styles.loading}>Chargement des chauffeurs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.breadcrumb}>Mes Chauffeurs</p>
        <div className={styles.header}>
          <h1 className={styles.title}>Mes Chauffeurs</h1>
        </div>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchDrivers}>Réessayer</button>
        </div>
      </div>
    );
  }

  // État vide
  if (drivers.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.breadcrumb}>Mes Chauffeurs</p>
        <div className={styles.header}>
          <h1 className={styles.title}>Mes Chauffeurs</h1>
          <Link href="/chauffeurs/nouveau" className={styles.addButton}>
            <FiPlus /> Nouveau chauffeur
          </Link>
        </div>

        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>Aucun Chauffeur Enregistré</h2>
          <p className={styles.emptyText}>
            Cliquez sur le bouton pour enregistrer un nouveau chauffeur
          </p>
          <Link href="/chauffeurs/nouveau" className={styles.emptyButton}>
            <FiPlus /> Enregistrer un chauffeur
          </Link>
        </div>
      </div>
    );
  }

  // Liste des chauffeurs
  return (
    <div className={styles.container}>
      <p className={styles.breadcrumb}>Mes Chauffeurs</p>

      <div className={styles.header}>
        <h1 className={styles.title}>Mes Chauffeurs</h1>
        <Link href="/chauffeurs/nouveau" className={styles.addButton}>
          <FiPlus /> Nouveau chauffeur
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Nom</th>
              <th>Statut</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr
                key={driver.driverId}
                onClick={() => router.push(`/chauffeurs/${driver.driverId}`)}
                className={styles.tableRow}
              >
                <td>
                  <div className={styles.driverIcon}>
                    <FiUser />
                  </div>
                </td>
                <td className={styles.driverName}>
                  {driver.driverName}
                </td>
                <td>
                  <span className={styles.statusBadge}>
                    Hors service
                  </span>
                </td>
                <td>{driver.driverEmail}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className={styles.editButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/chauffeurs/${driver.driverId}/edit`);
                      }}
                      title="Modifier"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(driver.driverId);
                      }}
                      disabled={deletingId === driver.driverId}
                      aria-label="Supprimer"
                      title="Supprimer"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
