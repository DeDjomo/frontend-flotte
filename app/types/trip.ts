// ============================================================================
// FICHIER: types/trip.ts
// DESCRIPTION: Types TypeScript pour l'entité Trip (Trajet)
// ============================================================================

import { ISODateString, GeoJSONPoint } from './common';

/**
 * Interface Trip - Représente un trajet effectué par un véhicule
 * Correspond à la table "trip" dans PostgreSQL
 * 
 * Table SQL:
 * CREATE TABLE trip (
 *   tripId SERIAL PRIMARY KEY,
 *   departurePoint GEOMETRY(Point, 4326) NOT NULL,
 *   arrivalPoint GEOMETRY(Point, 4326) NOT NULL,
 *   departureDateTime TIMESTAMP NOT NULL,
 *   arrivalDateTime TIMESTAMP,
 *   driverId INTEGER NOT NULL,
 *   vehicleId INTEGER NOT NULL,
 *   CONSTRAINT chk_valid_trip_dates CHECK (departureDateTime <= arrivalDateTime)
 * );
 */
export interface Trip {
  /** ID unique du trajet (auto-incrémenté) */
  tripId: number;
  
  /** 
   * Point de départ du trajet
   * Format GeoJSON Point avec coordonnées [longitude, latitude]
   * Exemple: { type: "Point", coordinates: [3.8480, 11.5021] }
   */
  departurePoint: GeoJSONPoint;
  
  /** 
   * Point d'arrivée du trajet
   * Format GeoJSON Point avec coordonnées [longitude, latitude]
   */
  arrivalPoint: GeoJSONPoint;
  
  /** Date et heure de départ */
  departureDateTime: ISODateString;
  
  /** 
   * Date et heure d'arrivée (optionnel)
   * null si le trajet est en cours
   */
  arrivalDateTime?: ISODateString | null;
  
  /** ID du conducteur */
  driverId: number;
  
  /** ID du véhicule */
  vehicleId: number;
}

/**
 * Type pour la création d'un nouveau trajet
 * Exclut les champs auto-générés
 * 
 * Utilisation: Pour les requêtes POST /trips (démarrer un trajet)
 */
export interface CreateTripDto {
  departurePoint: GeoJSONPoint;
  arrivalPoint: GeoJSONPoint;
  departureDateTime: ISODateString;
  arrivalDateTime?: ISODateString;
  driverId: number;
  vehicleId: number;
}

/**
 * Type pour la mise à jour d'un trajet
 * Généralement utilisé pour terminer un trajet en cours
 * 
 * Utilisation: Pour les requêtes PUT/PATCH /trips/:id
 */
export interface UpdateTripDto {
  departurePoint?: GeoJSONPoint;
  arrivalPoint?: GeoJSONPoint;
  departureDateTime?: ISODateString;
  arrivalDateTime?: ISODateString;
  driverId?: number;
  vehicleId?: number;
}

/**
 * Type pour démarrer un trajet
 * Version simplifiée qui crée un trajet en cours
 */
export interface StartTripDto {
  departurePoint: GeoJSONPoint;
  driverId: number;
  vehicleId: number;
}

/**
 * Type pour terminer un trajet
 * Complète un trajet en cours
 */
export interface EndTripDto {
  tripId: number;
  arrivalPoint: GeoJSONPoint;
  arrivalDateTime?: ISODateString; // Optionnel, peut être généré automatiquement
}

/**
 * Énumération du statut d'un trajet
 */
export enum TripStatus {
  /** Trajet planifié mais pas encore commencé */
  PLANNED = 'planned',
  
  /** Trajet en cours */
  IN_PROGRESS = 'in_progress',
  
  /** Trajet terminé */
  COMPLETED = 'completed',
  
  /** Trajet annulé */
  CANCELLED = 'cancelled'
}

/**
 * Type pour un trajet avec détails
 * Inclut les informations du conducteur et du véhicule
 */
export interface TripWithDetails extends Trip {
  /** Informations du conducteur */
  driver?: {
    driverId: number;
    driverName: string;
    driverPhoneNumber: string;
  };
  
  /** Informations du véhicule */
  vehicle?: {
    vehicleId: number;
    vehicleName: string;
    vehicleMake: string;
    vehicleRegistrationNumber: string;
  };
  
  /** Statut calculé du trajet */
  status?: TripStatus;
  
  /** Durée du trajet (en minutes) - calculée si arrivalDateTime existe */
  duration?: number;
  
  /** Distance du trajet (en km) - peut être calculée par l'API */
  distance?: number;
}

/**
 * Type pour les statistiques de trajets
 */
export interface TripStats {
  /** Nombre total de trajets */
  totalTrips: number;
  
  /** Nombre de trajets en cours */
  ongoingTrips: number;
  
  /** Nombre de trajets terminés */
  completedTrips: number;
  
  /** Distance totale parcourue (km) */
  totalDistance: number;
  
  /** Durée totale (minutes) */
  totalDuration: number;
  
  /** Distance moyenne par trajet */
  averageDistance: number;
  
  /** Durée moyenne par trajet */
  averageDuration: number;
  
  /** Dernier trajet */
  lastTrip?: {
    tripId: number;
    departureDateTime: ISODateString;
    arrivalDateTime?: ISODateString;
    distance?: number;
  };
}

/**
 * Type pour les filtres de trajets
 */
export interface TripFilters {
  /** Filtrer par conducteur */
  driverId?: number;
  
  /** Filtrer par véhicule */
  vehicleId?: number;
  
  /** Filtrer par statut */
  status?: TripStatus;
  
  /** Filtrer par plage de dates de départ */
  startDate?: ISODateString;
  endDate?: ISODateString;
  
  /** Filtrer les trajets en cours uniquement */
  ongoingOnly?: boolean;
  
  /** Filtrer les trajets terminés uniquement */
  completedOnly?: boolean;
}

/**
 * Type pour un rapport de trajets
 */
export interface TripReport {
  /** Période du rapport */
  period: {
    startDate: ISODateString;
    endDate: ISODateString;
  };
  
  /** Statistiques globales */
  stats: TripStats;
  
  /** Liste des trajets */
  trips: TripWithDetails[];
  
  /** Répartition par conducteur */
  byDriver?: Record<number, {
    driverName: string;
    tripCount: number;
    totalDistance: number;
    totalDuration: number;
  }>;
  
  /** Répartition par véhicule */
  byVehicle?: Record<number, {
    vehicleName: string;
    tripCount: number;
    totalDistance: number;
    totalDuration: number;
  }>;
}

/**
 * Type pour les coordonnées nommées
 * Utile pour afficher des lieux avec leurs noms
 */
export interface NamedLocation {
  name: string;
  address?: string;
  coordinates: GeoJSONPoint;
}