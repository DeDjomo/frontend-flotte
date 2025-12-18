// src/app/(dashboard)/chauffeurs/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiUser, FiTruck } from 'react-icons/fi';
import { driverService, tripService } from '@/app/lib/services';
import styles from './driverDetail.module.css';

type TabType = 'trips' | 'details';

// Composant pour afficher le nom du lieu
function TripLocation({ coordinates }: { coordinates: number[] }) {
  const [locationName, setLocationName] = useState<string>('Chargement...');

  useEffect(() => {
    const fetchLocation = async () => {
      if (!coordinates || coordinates.length < 2) {
        setLocationName('Coordonnées invalides');
        return;
      }

      const [lon, lat] = coordinates;

      try {
        // Utiliser Nominatim (OpenStreetMap) pour le géocodage inverse
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'fr'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Erreur de géocodage');
        }

        const data = await response.json();

        // Construire un nom de lieu lisible
        let locationName = '';
        if (data.address) {
          const addr = data.address;
          // Prioriser: rue/route, quartier, ville
          locationName = addr.road || addr.suburb || addr.neighbourhood ||
            addr.city || addr.town || addr.village ||
            addr.county || 'Lieu inconnu';

          // Ajouter la ville si on a une rue
          if (addr.road && (addr.city || addr.town)) {
            locationName += `, ${addr.city || addr.town}`;
          }
        } else {
          locationName = data.display_name?.split(',')[0] || 'Lieu inconnu';
        }

        setLocationName(locationName);
      } catch (error) {
        console.error('Erreur lors du géocodage:', error);
        setLocationName(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
      }
    };

    fetchLocation();
  }, [coordinates]);

  return <span className={styles.tripLocationText}>{locationName}</span>;
}

export default function DriverDetailPage() {
  const params = useParams();
  const driverId = parseInt(params.id as string);

  const [driver, setDriver] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('trips');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDriverData();
  }, [driverId]);

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les détails du chauffeur
      console.log('📡 Récupération du chauffeur...');
      const driverData = await driverService.getDriverById(driverId);
      console.log('✅ Chauffeur récupéré:', driverData);
      setDriver(driverData);

      // Récupérer l'historique des trajets du chauffeur
      try {
        const driverTrips = await tripService.getTripsByDriver(driverId);
        console.log('✅ Trajets récupérés:', driverTrips.length);
        setTrips(driverTrips);
      } catch (err) {
        console.warn('⚠️ Impossible de récupérer l\'historique des trajets');
      }

      // Récupérer les véhicules assignés
      try {
        const driverVehicles = await driverService.getDriverVehicles(driverId);
        console.log('✅ Véhicules récupérés:', driverVehicles.length);
        setVehicles(driverVehicles);
      } catch (err) {
        console.warn('⚠️ Impossible de récupérer les véhicules du chauffeur');
      }
    } catch (err) {
      console.error('❌ Erreur lors du chargement:', err);
      setError('Impossible de charger les données du chauffeur');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateArray: number[]) => {
    if (!dateArray || dateArray.length < 3) return '-';
    const [year, month, day, hour = 0, minute = 0] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusLabel = () => {
    // TODO: Vérifier si le chauffeur a un trajet en cours
    return 'Hors service';
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Chargement...</div>
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error || 'Chauffeur non trouvé'}</p>
          <Link href="/chauffeurs" className={styles.backLink}>
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <p className={styles.breadcrumb}>
        <Link href="/chauffeurs" className={styles.breadcrumbLink}>
          Mes Chauffeurs
        </Link>
        {' '}/{' '}
        <span className={styles.breadcrumbCurrent}>{driver.driverName}</span>
      </p>

      {/* Card d'informations du chauffeur */}
      <div className={styles.driverCard}>
        <div className={styles.driverIcon}>
          <FiUser />
        </div>
        <div className={styles.driverInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Nom :</span>
            <span className={styles.infoValue}>{driver.driverName}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Email :</span>
            <span className={styles.infoValue}>{driver.driverEmail}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Téléphone :</span>
            <span className={styles.infoValue}>{driver.driverPhoneNumber}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Statut :</span>
            <span className={styles.infoValue}>{getStatusLabel()}</span>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'trips' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('trips')}
        >
          Historique des trajets
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'details' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Détails sur le chauffeur
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className={styles.tabContent}>
        {activeTab === 'trips' && (
          <div className={styles.tripsContainer}>
            {trips.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Aucun trajet effectué</p>
              </div>
            ) : (
              <div className={styles.tripsList}>
                {trips.map((trip) => (
                  <div key={trip.tripId} className={styles.tripCard}>
                    <div className={styles.tripHeader}>
                      <span className={styles.tripId}>Trajet #{trip.tripId}</span>
                      <span className={styles.tripDate}>
                        {formatDate(trip.departureDateTime)}
                      </span>
                    </div>
                    <div className={styles.tripDetails}>
                      <div className={styles.tripRoute}>
                        <div className={styles.tripPoint}>
                          <span className={styles.tripLabel}>Départ</span>
                          {trip.departurePoint?.coordinates ? (
                            <TripLocation coordinates={trip.departurePoint.coordinates} />
                          ) : (
                            <span className={styles.tripLocationText}>Coordonnées non disponibles</span>
                          )}
                        </div>
                        <div className={styles.tripPoint}>
                          <span className={styles.tripLabel}>Arrivée</span>
                          {trip.arrivalPoint?.coordinates ? (
                            <TripLocation coordinates={trip.arrivalPoint.coordinates} />
                          ) : (
                            <span className={styles.tripLocationText}>En cours...</span>
                          )}
                        </div>
                      </div>
                      {trip.arrivalDateTime && (
                        <div className={styles.tripStatus}>
                          Arrivée : {formatDate(trip.arrivalDateTime)}
                        </div>
                      )}
                      {!trip.arrivalDateTime && (
                        <div className={styles.tripStatusActive}>
                          Trajet en cours
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className={styles.detailsContainer}>
            <div className={styles.detailsCard}>
              <h3 className={styles.detailsTitle}>Informations personnelles</h3>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Contact d'urgence</span>
                  <span className={styles.detailValue}>
                    {driver.emergencyContactName || 'Non renseigné'}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Téléphone d'urgence</span>
                  <span className={styles.detailValue}>
                    {driver.emergencyContact || 'Non renseigné'}
                  </span>
                </div>
                {driver.personalInformations && (
                  <div className={`${styles.detailItem} ${styles.fullWidth}`}>
                    <span className={styles.detailLabel}>Informations complémentaires</span>
                    <span className={styles.detailValue}>
                      {driver.personalInformations}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.detailsCard}>
              <h3 className={styles.detailsTitle}>Véhicules assignés</h3>
              {vehicles.length === 0 ? (
                <p className={styles.emptyState} style={{ minHeight: 'auto', padding: '1rem' }}>
                  Aucun véhicule assigné
                </p>
              ) : (
                <div className={styles.tripsList}>
                  {vehicles.map((vehicle) => (
                    <Link
                      key={vehicle.vehicleId}
                      href={`/vehicules/${vehicle.vehicleId}`}
                      className={styles.tripCard}
                      style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
                    >
                      <div className={styles.tripHeader} style={{ marginBottom: 0, borderBottom: 'none' }}>
                        <span className={styles.tripId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FiTruck />
                          {vehicle.vehicleRegistrationNumber}
                        </span>
                        <span className={styles.tripDate}>
                          {vehicle.vehicleBrand} {vehicle.vehicleModel}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.detailsCard}>
              <h3 className={styles.detailsTitle}>Statistiques</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{trips.length}</span>
                  <span className={styles.statLabel}>Trajets effectués</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>
                    {trips.filter(t => !t.arrivalDateTime).length}
                  </span>
                  <span className={styles.statLabel}>Trajets en cours</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
