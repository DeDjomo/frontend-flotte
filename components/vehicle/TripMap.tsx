'use client';

import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';

// Import dynamique pour éviter les erreurs SSR avec Leaflet
import dynamic from 'next/dynamic';

// Import des composants Leaflet côté client uniquement
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false, loading: () => <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Chargement de la carte...</div> }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then(mod => mod.Polyline),
  { ssr: false }
);

interface TripMapProps {
  trip: any;
  onClose: () => void;
  modalStyles: {
    tripModal: string;
    tripModalContent: string;
    tripModalHeader: string;
    tripModalClose: string;
    tripModalMap: string;
  };
}

export default function TripMap({ trip, onClose, modalStyles }: TripMapProps) {
  const [icons, setIcons] = useState<{ green: any; red: any } | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Vérifier que nous sommes côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Charger les icônes Leaflet
  useEffect(() => {
    if (!isClient) return;

    const loadIcons = async () => {
      try {
        const L = await import('leaflet');

        // Fix pour les icônes Leaflet par défaut
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        const greenIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        const redIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        setIcons({ green: greenIcon, red: redIcon });
        console.log('✅ Icônes Leaflet chargées avec succès');
      } catch (error) {
        console.error('❌ Erreur lors du chargement des icônes Leaflet:', error);
        setLoadingError('Erreur lors du chargement de la carte');
      }
    };

    loadIcons();
  }, [isClient]);

  // Vérifier que le trajet a les points nécessaires
  if (!trip.departurePoint?.coordinates || !trip.arrivalPoint?.coordinates) {
    return (
      <div className={modalStyles.tripModal} onClick={onClose}>
        <div className={modalStyles.tripModalContent} onClick={(e) => e.stopPropagation()}>
          <div className={modalStyles.tripModalHeader}>
            <h2>Trajet #{trip.tripId}</h2>
            <button className={modalStyles.tripModalClose} onClick={onClose}>
              <FiX />
            </button>
          </div>
          <div className={modalStyles.tripModalMap} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            fontSize: '1.1rem'
          }}>
            <p>Points de départ ou d'arrivée non disponibles pour ce trajet</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculer le centre de la carte
  const center: [number, number] = [
    (trip.departurePoint.coordinates[1] + trip.arrivalPoint.coordinates[1]) / 2,
    (trip.departurePoint.coordinates[0] + trip.arrivalPoint.coordinates[0]) / 2
  ];

  // Afficher l'erreur si une erreur s'est produite
  if (loadingError) {
    return (
      <div className={modalStyles.tripModal} onClick={onClose}>
        <div className={modalStyles.tripModalContent} onClick={(e) => e.stopPropagation()}>
          <div className={modalStyles.tripModalHeader}>
            <h2>Trajet #{trip.tripId}</h2>
            <button className={modalStyles.tripModalClose} onClick={onClose}>
              <FiX />
            </button>
          </div>
          <div className={modalStyles.tripModalMap} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--error-text)',
            fontSize: '1.1rem'
          }}>
            <p>{loadingError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={modalStyles.tripModal} onClick={onClose}>
      <div className={modalStyles.tripModalContent} onClick={(e) => e.stopPropagation()}>
        <div className={modalStyles.tripModalHeader}>
          <h2>Trajet #{trip.tripId}</h2>
          <button className={modalStyles.tripModalClose} onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className={modalStyles.tripModalMap}>
          {!isClient ? (
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)'
            }}>
              Chargement...
            </div>
          ) : !icons ? (
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)'
            }}>
              Chargement de la carte...
            </div>
          ) : (
            <MapContainer
              center={center}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Marqueur de départ (vert) */}
              <Marker
                position={[trip.departurePoint.coordinates[1], trip.departurePoint.coordinates[0]]}
                icon={icons.green}
              >
                <Popup>
                  <strong>Départ</strong>
                  <br />
                  {trip.departureDateTime && new Date(
                    trip.departureDateTime[0],
                    trip.departureDateTime[1] - 1,
                    trip.departureDateTime[2],
                    trip.departureDateTime[3] || 0,
                    trip.departureDateTime[4] || 0
                  ).toLocaleString('fr-FR')}
                </Popup>
              </Marker>
              {/* Marqueur d'arrivée (rouge) */}
              <Marker
                position={[trip.arrivalPoint.coordinates[1], trip.arrivalPoint.coordinates[0]]}
                icon={icons.red}
              >
                <Popup>
                  <strong>Arrivée</strong>
                  <br />
                  {trip.arrivalDateTime && new Date(
                    trip.arrivalDateTime[0],
                    trip.arrivalDateTime[1] - 1,
                    trip.arrivalDateTime[2],
                    trip.arrivalDateTime[3] || 0,
                    trip.arrivalDateTime[4] || 0
                  ).toLocaleString('fr-FR')}
                </Popup>
              </Marker>
              {/* Ligne entre départ et arrivée */}
              <Polyline
                positions={[
                  [trip.departurePoint.coordinates[1], trip.departurePoint.coordinates[0]],
                  [trip.arrivalPoint.coordinates[1], trip.arrivalPoint.coordinates[0]]
                ]}
                color="#06b6d4"
                weight={4}
                opacity={0.8}
                dashArray="10, 10"
              />
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
}
