// src/app/(dashboard)/positions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { vehicleService, positionService } from '@/app/lib/services';
import { useAuth } from '@/app/contexts/AuthContext';
import styles from './positions.module.css';
import 'leaflet/dist/leaflet.css';

// Import dynamique pour éviter les erreurs SSR avec Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface VehiclePosition {
  vehicleId: number;
  vehicleName: string;
  vehicleRegistrationNumber: string;
  position: {
    positionId: number;
    coordinate: {
      type: string;
      coordinates: [number, number]; // [longitude, latitude]
    };
    positionDateTime: string;
  } | null;
}

export default function PositionsPage() {
  const { user } = useAuth();
  const [vehiclePositions, setVehiclePositions] = useState<VehiclePosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leafletIcon, setLeafletIcon] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([3.8480, 11.5021]); // Yaoundé par défaut

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
    if (user?.userId) {
      fetchVehiclePositions();
    }
  }, [user]);

  const fetchVehiclePositions = async () => {
    if (!user?.userId) return;

    try {
      setLoading(true);
      setError(null);

      console.log('📡 Récupération des véhicules...');

      // Récupérer tous les véhicules de l'utilisateur
      const vehicles = await vehicleService.getVehiclesByUser(user.userId);
      console.log('✅ Véhicules récupérés:', vehicles.length);

      // Récupérer la position de chaque véhicule
      const positionsPromises = vehicles.map(async (vehicle: any) => {
        try {
          const position = await positionService.getLatestPosition(vehicle.vehicleId);
          return {
            vehicleId: vehicle.vehicleId,
            vehicleName: vehicle.vehicleName,
            vehicleRegistrationNumber: vehicle.vehicleRegistrationNumber,
            position: position
          };
        } catch (err) {
          console.warn(`⚠️ Position non disponible pour ${vehicle.vehicleRegistrationNumber}`);
          return {
            vehicleId: vehicle.vehicleId,
            vehicleName: vehicle.vehicleName,
            vehicleRegistrationNumber: vehicle.vehicleRegistrationNumber,
            position: null
          };
        }
      });

      const positions = await Promise.all(positionsPromises);
      setVehiclePositions(positions);

      // Centrer la carte sur le premier véhicule avec position
      const firstVehicleWithPosition = positions.find(v => v.position);
      if (firstVehicleWithPosition && firstVehicleWithPosition.position) {
        const coords = firstVehicleWithPosition.position.coordinate.coordinates;
        setMapCenter([coords[1], coords[0]]); // [lat, lon]
      }

      console.log('✅ Positions récupérées:', positions.filter(v => v.position).length, 'sur', positions.length);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des positions:', err);
      setError('Impossible de charger les positions des véhicules');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (err) {
      return '-';
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Positions des Véhicules</h1>
        </div>
        <div className={styles.loading}>Chargement de la carte...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Positions des Véhicules</h1>
        </div>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchVehiclePositions} className={styles.retryButton}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const vehiclesWithPosition = vehiclePositions.filter(v => v.position);
  const vehiclesWithoutPosition = vehiclePositions.filter(v => !v.position);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Positions des Véhicules</h1>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{vehiclesWithPosition.length}</span>
            <span className={styles.statLabel}>Véhicules localisés</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{vehiclePositions.length}</span>
            <span className={styles.statLabel}>Total véhicules</span>
          </div>
        </div>
      </div>

      {/* Carte */}
      <div className={styles.mapWrapper}>
        {leafletIcon && vehiclesWithPosition.length > 0 ? (
          <MapContainer
            key={`map-${vehiclesWithPosition.length}`}
            center={mapCenter}
            zoom={13}
            className={styles.map}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {vehiclesWithPosition.map((vehicle) => {
              if (!vehicle.position) return null;
              const coords = vehicle.position.coordinate.coordinates;
              return (
                <Marker
                  key={vehicle.vehicleId}
                  position={[coords[1], coords[0]]}
                  icon={leafletIcon}
                >
                  <Popup>
                    <div className={styles.popupContent}>
                      <strong className={styles.popupTitle}>
                        {vehicle.vehicleRegistrationNumber}
                      </strong>
                      <div className={styles.popupInfo}>
                        <span className={styles.popupLabel}>Service:</span>
                        <span>{vehicle.vehicleName}</span>
                      </div>
                      <div className={styles.popupInfo}>
                        <span className={styles.popupLabel}>Dernière position:</span>
                        <span>{formatDateTime(vehicle.position.positionDateTime)}</span>
                      </div>
                      <div className={styles.popupInfo}>
                        <span className={styles.popupLabel}>Coordonnées:</span>
                        <span>{coords[1].toFixed(4)}, {coords[0].toFixed(4)}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        ) : (
          <div className={styles.noPositions}>
            <p>Aucune position disponible pour les véhicules</p>
          </div>
        )}
      </div>

      {/* Légende */}
      <div className={styles.legend}>
        <h3 className={styles.legendTitle}>Légende</h3>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <div className={styles.legendMarker} style={{ backgroundColor: '#3b82f6' }}></div>
            <span>Véhicule localisé ({vehiclesWithPosition.length})</span>
          </div>
          {vehiclesWithoutPosition.length > 0 && (
            <div className={styles.legendItem}>
              <div className={styles.legendMarker} style={{ backgroundColor: '#94a3b8' }}></div>
              <span>Véhicule non localisé ({vehiclesWithoutPosition.length})</span>
            </div>
          )}
        </div>
      </div>

      {/* Liste des véhicules sans position */}
      {vehiclesWithoutPosition.length > 0 && (
        <div className={styles.noPositionList}>
          <h3 className={styles.noPositionTitle}>
            Véhicules sans position ({vehiclesWithoutPosition.length})
          </h3>
          <div className={styles.noPositionGrid}>
            {vehiclesWithoutPosition.map((vehicle) => (
              <div key={vehicle.vehicleId} className={styles.noPositionCard}>
                <span className={styles.vehicleReg}>{vehicle.vehicleRegistrationNumber}</span>
                <span className={styles.vehicleName}>{vehicle.vehicleName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
