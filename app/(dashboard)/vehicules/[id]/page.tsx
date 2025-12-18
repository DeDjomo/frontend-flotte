// src/app/(dashboard)/vehicules/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FiTruck, FiX, FiTrash2 } from 'react-icons/fi';
import { vehicleService, positionService, tripService, fuelRechargeService, maintenanceService } from '@/app/lib/services';
import { useAuth } from '@/app/contexts/AuthContext';
import { useModal } from '@/app/contexts/ModalContext';
import SpeedGauge from '@/components/vehicle/SpeedGauge';
import FuelGauge from '@/components/vehicle/FuelGauge';
import PassengerIndicator from '@/components/vehicle/PassengerIndicator';
import TripMap from '@/components/vehicle/TripMap';
import styles from './vehicleDetail.module.css';
import 'leaflet/dist/leaflet.css';

// Import dynamique pour éviter les erreurs SSR avec Leaflet (pour la carte de position uniquement)
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Mock data pour les tests
const MOCK_VEHICLE = {
  vehicleId: 1,
  vehicleRegistrationNumber: 'OU657BE',
  vehicleMake: 'Toyota',
  vehicleName: 'Taxi',
  vehicleType: 'Voiture',
  vehicleStatus: 'active',
  vehicleSpeed: 65,
  vehicleFuelLevel: 75,
  vehicleNumberPassengers: 3, // Nombre actuel de passagers
  vehicleCapacity: 10, // Capacité maximale (par défaut: 10)
};

const MOCK_POSITION = {
  positionId: 1,
  coordinate: {
    type: 'Point',
    coordinates: [11.5021, 3.8480] // [longitude, latitude] - Yaoundé (format GeoJSON)
  },
  positionDateTime: '2024-01-15T14:30:00',
  vehicleId: 1,
  vehicleName: 'Toyota Taxi'
};

const USE_MOCK_DATA = false;

type TabType = 'position' | 'details' | 'historique' | 'bilans';

// Composant pour afficher le nom du lieu
function TripLocation({ coordinates, getLocationName }: { coordinates: number[], getLocationName: (lat: number, lon: number) => Promise<string> }) {
  const [locationName, setLocationName] = useState<string>('Chargement...');

  useEffect(() => {
    const fetchLocation = async () => {
      const [lon, lat] = coordinates;
      const name = await getLocationName(lat, lon);
      setLocationName(name);
    };
    fetchLocation();
  }, [coordinates, getLocationName]);

  return <span className={styles.tripLocation}>{locationName}</span>;
}

export default function VehicleDetailPage() {
  const params = useParams();
  const vehicleId = parseInt(params.id as string);

  const [vehicle, setVehicle] = useState<any>(null);
  const [driver, setDriver] = useState<any>(null);
  const [position, setPosition] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [fuelRecharges, setFuelRecharges] = useState<any[]>([]);
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('position');
  const [loading, setLoading] = useState(true);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingTripId, setDeletingTripId] = useState<number | null>(null);
  const { showConfirm } = useModal();
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [locationNames, setLocationNames] = useState<{ [key: string]: string }>({});
  const [leafletIcon, setLeafletIcon] = useState<any>(null);

  // Charger l'icône Leaflet côté client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        const icon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        setLeafletIcon(icon);
      });
    }
  }, []);

  useEffect(() => {
    fetchVehicleData();
  }, [vehicleId]);

  // Fonction pour obtenir le nom d'un lieu à partir de coordonnées
  const getLocationName = async (lat: number, lon: number): Promise<string> => {
    const key = `${lat},${lon}`;

    // Vérifier si on a déjà le nom en cache
    if (locationNames[key]) {
      return locationNames[key];
    }

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

      // Mettre en cache
      setLocationNames(prev => ({ ...prev, [key]: locationName }));

      return locationName;
    } catch (error) {
      console.error('Erreur lors du géocodage:', error);
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  };

  const fetchVehicleData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        console.log('🧪 Mode développement : utilisation des données mockées');
        setVehicle(MOCK_VEHICLE);
        setPosition(MOCK_POSITION);
        setDriver({ driverName: 'Jean Dupont' });
      } else {
        // Récupérer les détails du véhicule
        console.log('📡 Récupération du véhicule...');
        const vehicleData = await vehicleService.getVehicleById(vehicleId);
        console.log('✅ Véhicule récupéré:', vehicleData);
        console.log('📊 Vitesse:', vehicleData.vehicleSpeed);
        console.log('⛽ Carburant:', vehicleData.vehicleFuelLevel);
        console.log('👥 Passagers:', vehicleData.vehicleNumberPassengers);
        setVehicle(vehicleData);

        // Récupérer les conducteurs du véhicule
        try {
          console.log('📡 Récupération des conducteurs...');
          const drivers = await vehicleService.getVehicleDrivers(vehicleId);
          if (drivers && drivers.length > 0) {
            setDriver(drivers[0]); // Prendre le premier conducteur
          }
        } catch (err: any) {
          console.error('❌ Erreur conducteurs:', err.response?.status, err.response?.data);
          console.warn('⚠️ Aucun conducteur assigné');
        }

        // Récupérer la dernière position connue
        try {
          console.log('📡 Récupération de la position...');
          const latestPosition = await positionService.getLatestPosition(vehicleId);
          console.log('✅ Position récupérée:', latestPosition);
          setPosition(latestPosition);
        } catch (err: any) {
          console.error('❌ Erreur position:', err.response?.status, err.response?.data);
          console.warn('⚠️ Position non disponible');
        }

        // Récupérer l'historique des trajets
        try {
          console.log('📡 Récupération des trajets...');
          const vehicleTrips = await tripService.getTripsByVehicle(vehicleId);
          console.log('✅ Trajets récupérés:', vehicleTrips.length);
          setTrips(vehicleTrips);
        } catch (err: any) {
          console.error('❌ Erreur trajets:', err.response?.status, err.response?.data);
          console.warn('⚠️ Impossible de récupérer l\'historique des trajets');
        }

        // Récupérer les recharges de carburant
        try {
          console.log('📡 Récupération des recharges de carburant...');
          const vehicleFuelRecharges = await fuelRechargeService.getFuelRechargesByVehicle(vehicleId);
          console.log('✅ Recharges - Type:', typeof vehicleFuelRecharges);
          console.log('✅ Recharges - Raw response:', vehicleFuelRecharges);
          console.log('✅ Recharges - Is Array?:', Array.isArray(vehicleFuelRecharges));
          console.log('✅ Recharges - Length:', vehicleFuelRecharges?.length);
          console.log('✅ Recharges - Keys:', vehicleFuelRecharges ? Object.keys(vehicleFuelRecharges) : 'null');

          // Handle both array and paginated response formats
          let rechargesArray: any[] = [];

          if (Array.isArray(vehicleFuelRecharges)) {
            rechargesArray = vehicleFuelRecharges;
          } else if (vehicleFuelRecharges && typeof vehicleFuelRecharges === 'object') {
            // Try different possible properties for paginated responses
            rechargesArray = (vehicleFuelRecharges as any).content
              || (vehicleFuelRecharges as any).data
              || (vehicleFuelRecharges as any).items
              || (vehicleFuelRecharges as any).results
              || [];
          }

          console.log('✅ Recharges - Final array type:', Array.isArray(rechargesArray));
          console.log('✅ Recharges - Final array length:', rechargesArray.length);
          console.log('✅ Recharges - First item:', rechargesArray.length > 0 ? rechargesArray[0] : 'none');
          setFuelRecharges(rechargesArray);
        } catch (err: any) {
          console.error('❌ Erreur lors de la récupération des recharges de carburant:', err);
          console.error('❌ Détails de l\'erreur:', err.response?.status, err.response?.data);
          console.warn('⚠️ Impossible de récupérer les recharges de carburant');
          setFuelRecharges([]); // Ensure we set empty array on error
        }

        // Récupérer les maintenances
        try {
          console.log('📡 Récupération des maintenances...');
          const vehicleMaintenances = await maintenanceService.getMaintenancesByVehicle(vehicleId);
          console.log('✅ Maintenances récupérées:', vehicleMaintenances.length);
          setMaintenances(vehicleMaintenances);
        } catch (err: any) {
          console.error('❌ Erreur maintenances:', err.response?.status, err.response?.data);
          console.warn('⚠️ Impossible de récupérer les maintenances');
        }
      }
    } catch (err) {
      console.error('❌ Erreur lors du chargement:', err);
      setError('Impossible de charger les données du véhicule');
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status?: string) => {
    if (status === 'inactive') {
      return 'Hors service';
    }
    return 'En service';
  };

  const handleDeleteTrip = async (tripId: number) => {
    if (!await showConfirm({
      title: 'Supprimer le trajet',
      message: 'Êtes-vous sûr de vouloir supprimer ce trajet ? Cette action est irréversible.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      isDanger: true
    })) return;

    try {
      await tripService.deleteTrip(tripId);
      setTrips(prev => prev.filter(t => t.tripId !== tripId));
      console.log('✅ Trajet supprimé');
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      alert('Erreur lors de la suppression du trajet');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Chargement...</div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error || 'Véhicule non trouvé'}</p>
          <Link href="/vehicules" className={styles.backLink}>
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <p className={styles.breadcrumb}>
        <Link href="/vehicules" className={styles.breadcrumbLink}>
          Mes Véhicules
        </Link>
        {' '}/{' '}
        <span className={styles.breadcrumbCurrent}>{vehicle.vehicleRegistrationNumber}</span>
      </p>

      {/* Card d'informations du véhicule */}
      <div className={styles.vehicleCard}>
        <div className={styles.vehicleIcon}>
          <FiTruck />
        </div>
        <div className={styles.vehicleInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Immatriculation :</span>
            <span className={styles.infoValue}>{vehicle.vehicleRegistrationNumber}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Status :</span>
            <span className={styles.infoValue}>{getStatusLabel(vehicle.vehicleStatus)}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Service :</span>
            <span className={styles.infoValue}>{vehicle.vehicleName}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Conducteur :</span>
            <span className={styles.infoValue}>
              {driver ? driver.driverName : 'Aucun conducteur assigné'}
            </span>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'position' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('position')}
        >
          Position du véhicule
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'details' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Détails sur le véhicule
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'historique' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('historique')}
        >
          Historique des trajets
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'bilans' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('bilans')}
        >
          Bilans sur le véhicule
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className={styles.tabContent}>
        {activeTab === 'position' && (
          <div className={styles.mapContainer}>
            {position && leafletIcon ? (
              <MapContainer
                center={[position.coordinate.coordinates[1], position.coordinate.coordinates[0]]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[position.coordinate.coordinates[1], position.coordinate.coordinates[0]]}
                  icon={leafletIcon}
                >
                  <Popup>
                    <strong>{vehicle.vehicleRegistrationNumber}</strong>
                    <br />
                    {vehicle.vehicleName}
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className={styles.noPosition}>
                <p>{!position ? 'Position du véhicule non disponible' : 'Chargement de la carte...'}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className={styles.detailsContent}>
            <div className={styles.detailsHeader}>
              <h2 className={styles.detailsTitle}>Métriques en temps réel</h2>
              <p className={styles.detailsSubtitle}>
                Informations actuelles du véhicule {vehicle.vehicleRegistrationNumber}
              </p>
            </div>

            {/* Grille des métriques visuelles */}
            <div className={styles.metricsGrid}>
              <SpeedGauge
                speed={vehicle.vehicleSpeed || 0}
                maxSpeed={180}
              />
              <FuelGauge
                level={vehicle.vehicleFuelLevel || 0}
              />
              <PassengerIndicator
                current={vehicle.vehicleNumberPassengers || 0}
                capacity={vehicle.vehicleCapacity || 10}
              />
            </div>
          </div>
        )}

        {activeTab === 'historique' && (
          <div className={styles.tripsContent}>
            <h2 className={styles.detailsTitle}>Historique des trajets</h2>
            {loadingTrips ? (
              <p>Chargement des trajets...</p>
            ) : trips.length === 0 ? (
              <p className={styles.noData}>Aucun trajet enregistré pour ce véhicule</p>
            ) : (
              <div className={styles.tripsList}>
                {trips.map((trip) => {
                  // Convertir le tableau de dates en objet Date
                  const departureDate = trip.departureDateTime
                    ? new Date(
                      trip.departureDateTime[0],
                      trip.departureDateTime[1] - 1,
                      trip.departureDateTime[2],
                      trip.departureDateTime[3] || 0,
                      trip.departureDateTime[4] || 0
                    )
                    : null;

                  const arrivalDate = trip.arrivalDateTime
                    ? new Date(
                      trip.arrivalDateTime[0],
                      trip.arrivalDateTime[1] - 1,
                      trip.arrivalDateTime[2],
                      trip.arrivalDateTime[3] || 0,
                      trip.arrivalDateTime[4] || 0
                    )
                    : null;

                  return (
                    <div
                      key={trip.tripId}
                      className={styles.tripCard}
                      onClick={() => setSelectedTrip(trip)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.tripHeader}>
                        <h3 className={styles.tripId}>Trajet #{trip.tripId}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span className={styles.tripDriver}>
                            Conducteur: {trip.driverName || 'Non assigné'}
                          </span>
                          <button
                            className={styles.deleteButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTrip(trip.tripId);
                            }}
                            title="Supprimer le trajet"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>

                      <div className={styles.tripDetails}>
                        <div className={styles.tripInfo}>
                          <span className={styles.tripLabel}>Départ</span>
                          <span className={styles.tripValue}>
                            {departureDate
                              ? departureDate.toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                              : 'Non défini'}
                          </span>
                          {trip.departurePoint && (
                            <TripLocation
                              coordinates={trip.departurePoint.coordinates}
                              getLocationName={getLocationName}
                            />
                          )}
                        </div>

                        <div className={styles.tripArrow}>→</div>

                        <div className={styles.tripInfo}>
                          <span className={styles.tripLabel}>Arrivée</span>
                          <span className={styles.tripValue}>
                            {arrivalDate
                              ? arrivalDate.toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                              : 'En cours'}
                          </span>
                          {trip.arrivalPoint && (
                            <TripLocation
                              coordinates={trip.arrivalPoint.coordinates}
                              getLocationName={getLocationName}
                            />
                          )}
                        </div>
                      </div>

                      {departureDate && arrivalDate && (
                        <div className={styles.tripDuration}>
                          Durée: {Math.round((arrivalDate.getTime() - departureDate.getTime()) / 1000 / 60)} minutes
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bilans' && (
          <div className={styles.bilansContent}>
            <h2 className={styles.detailsTitle}>Bilans du véhicule</h2>

            {/* Section Recharges de carburant */}
            <div className={styles.bilansSection}>
              <h3 className={styles.bilansSectionTitle}>Recharges de carburant</h3>
              {(() => {
                console.log('🔍 DEBUG Affichage - fuelRecharges:', fuelRecharges);
                console.log('🔍 DEBUG Affichage - fuelRecharges length:', fuelRecharges?.length);
                console.log('🔍 DEBUG Affichage - Is Array?:', Array.isArray(fuelRecharges));
                return null;
              })()}
              {fuelRecharges.length === 0 ? (
                <p className={styles.noData}>Aucune recharge enregistrée</p>
              ) : (
                <div className={styles.bilansList}>
                  {fuelRecharges.map((recharge) => {
                    const rechargeDate = recharge.rechargeDateTime
                      ? new Date(
                        recharge.rechargeDateTime[0],
                        recharge.rechargeDateTime[1] - 1,
                        recharge.rechargeDateTime[2],
                        recharge.rechargeDateTime[3] || 0,
                        recharge.rechargeDateTime[4] || 0,
                        recharge.rechargeDateTime[5] || 0
                      )
                      : null;

                    return (
                      <div key={recharge.rechargeId} className={styles.bilanCard}>
                        <div className={styles.bilanCardHeader}>
                          <span className={styles.bilanCardTitle}>
                            Recharge #{recharge.rechargeId}
                          </span>
                          <span className={styles.bilanCardDate}>
                            {rechargeDate ? rechargeDate.toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'Date inconnue'}
                          </span>
                        </div>
                        <div className={styles.bilanCardBody}>
                          <div className={styles.bilanInfo}>
                            <span className={styles.bilanLabel}>Quantité</span>
                            <span className={styles.bilanValue}>{recharge.rechargeQuantity} L</span>
                          </div>
                          <div className={styles.bilanInfo}>
                            <span className={styles.bilanLabel}>Prix</span>
                            <span className={styles.bilanValue}>{recharge.rechargePrice.toFixed(2)} FCFA</span>
                          </div>
                          {recharge.rechargePoint && (
                            <div className={styles.bilanInfo}>
                              <span className={styles.bilanLabel}>Lieu</span>
                              <TripLocation
                                coordinates={recharge.rechargePoint.coordinates}
                                getLocationName={getLocationName}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section Maintenances */}
            <div className={styles.bilansSection}>
              <h3 className={styles.bilansSectionTitle}>Maintenances</h3>
              {maintenances.length === 0 ? (
                <p className={styles.noData}>Aucune maintenance enregistrée</p>
              ) : (
                <div className={styles.bilansList}>
                  {maintenances.map((maintenance) => {
                    const maintenanceDate = maintenance.maintenanceDateTime
                      ? new Date(
                        maintenance.maintenanceDateTime[0],
                        maintenance.maintenanceDateTime[1] - 1,
                        maintenance.maintenanceDateTime[2],
                        maintenance.maintenanceDateTime[3] || 0,
                        maintenance.maintenanceDateTime[4] || 0,
                        maintenance.maintenanceDateTime[5] || 0
                      )
                      : null;

                    return (
                      <div key={maintenance.maintenanceId} className={styles.bilanCard}>
                        <div className={styles.bilanCardHeader}>
                          <span className={styles.bilanCardTitle}>
                            Maintenance #{maintenance.maintenanceId}
                          </span>
                          <span className={styles.bilanCardDate}>
                            {maintenanceDate ? maintenanceDate.toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'Date inconnue'}
                          </span>
                        </div>
                        <div className={styles.bilanCardBody}>
                          <div className={styles.bilanInfo}>
                            <span className={styles.bilanLabel}>Sujet</span>
                            <span className={styles.bilanValue}>{maintenance.maintenanceSubject}</span>
                          </div>
                          <div className={styles.bilanInfo}>
                            <span className={styles.bilanLabel}>Coût</span>
                            <span className={styles.bilanValue}>{maintenance.maintenanceCost.toFixed(2)} FCFA</span>
                          </div>
                          {maintenance.maintenancePoint && (
                            <div className={styles.bilanInfo}>
                              <span className={styles.bilanLabel}>Lieu</span>
                              <TripLocation
                                coordinates={maintenance.maintenancePoint.coordinates}
                                getLocationName={getLocationName}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de visualisation du trajet */}
      {selectedTrip && typeof window !== 'undefined' && (
        <TripMap
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
          modalStyles={{
            tripModal: styles.tripModal,
            tripModalContent: styles.tripModalContent,
            tripModalHeader: styles.tripModalHeader,
            tripModalClose: styles.tripModalClose,
            tripModalMap: styles.tripModalMap
          }}
        />
      )}
    </div>
  );
}