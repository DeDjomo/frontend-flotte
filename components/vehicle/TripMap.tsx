'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FiX } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });

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
  const [icons, setIcons] = useState<{ green: any, red: any } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        const greenIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        const redIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        setIcons({ green: greenIcon, red: redIcon });
      });
    }
  }, []);

  if (!icons) return null;

  const center: [number, number] = [
    (trip.departurePoint.coordinates[1] + trip.arrivalPoint.coordinates[1]) / 2,
    (trip.departurePoint.coordinates[0] + trip.arrivalPoint.coordinates[0]) / 2
  ];

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
          {trip.departurePoint && trip.arrivalPoint && (
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
              <Polyline
                positions={[
                  [trip.departurePoint.coordinates[1], trip.departurePoint.coordinates[0]],
                  [trip.arrivalPoint.coordinates[1], trip.arrivalPoint.coordinates[0]]
                ]}
                color="#3b82f6"
                weight={4}
                opacity={0.7}
              />
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
}
