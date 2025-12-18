// ============================================================================
// FICHIER: types/position.ts
// DESCRIPTION: Types TypeScript pour les entités Position et PositionHistory
// ============================================================================

import { ISODateString, GeoJSONPoint, GeoJSONLineString } from './common';

/**
 * Interface Position - Représente une position GPS en temps réel
 * Correspond à la table "position" dans PostgreSQL
 * 
 * Table SQL:
 * CREATE TABLE position (
 *   positionId BIGSERIAL PRIMARY KEY,
 *   coordinate GEOMETRY(Point, 4326) NOT NULL,
 *   positionDateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *   vehicleId INTEGER NOT NULL
 * );
 * 
 * Note: Cette table stocke les positions actuelles des véhicules
 * Elle est mise à jour en temps réel par les dispositifs IoT
 */
export interface Position {
  /** ID unique de la position (auto-incrémenté) */
  positionId: number;
  
  /** 
   * Coordonnées GPS du véhicule
   * Format GeoJSON Point avec coordonnées [longitude, latitude]
   * Exemple: { type: "Point", coordinates: [3.8480, 11.5021] }
   */
  coordinate: GeoJSONPoint;
  
  /** Date et heure de capture de la position */
  positionDateTime: ISODateString;
  
  /** ID du véhicule */
  vehicleId: number;
}

/**
 * Interface PositionHistory - Représente l'historique des positions
 * Correspond à la table "positionHistory" dans PostgreSQL
 * 
 * Table SQL:
 * CREATE TABLE positionHistory (
 *   positionHistoryId SERIAL PRIMARY KEY,
 *   summaryCoordinate GEOMETRY(LineString, 4326) NOT NULL,
 *   positionDateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *   vehicleId INTEGER NOT NULL
 * );
 * 
 * Note: Cette table stocke un résumé des trajets sous forme de LineString
 * Utile pour afficher le parcours d'un véhicule sur une carte
 */
export interface PositionHistory {
  /** ID unique de l'historique (auto-incrémenté) */
  positionHistoryId: number;
  
  /** 
   * Trajet sous forme de LineString
   * Format GeoJSON LineString avec un tableau de coordonnées
   * Exemple: { 
   *   type: "LineString", 
   *   coordinates: [
   *     [3.8480, 11.5021],
   *     [3.8490, 11.5031],
   *     [3.8500, 11.5041]
   *   ]
   * }
   */
  summaryCoordinate: GeoJSONLineString;
  
  /** Date et heure de l'historique */
  positionDateTime: ISODateString;
  
  /** ID du véhicule */
  vehicleId: number;
}

/**
 * Type pour créer une nouvelle position
 * 
 * Utilisation: Pour les requêtes POST /positions (envoi par IoT)
 */
export interface CreatePositionDto {
  coordinate: GeoJSONPoint;
  vehicleId: number;
  /** positionDateTime est optionnel car il a une valeur par défaut */
  positionDateTime?: ISODateString;
}

/**
 * Type pour créer un nouvel historique de positions
 * 
 * Utilisation: Pour les requêtes POST /position-history
 */
export interface CreatePositionHistoryDto {
  summaryCoordinate: GeoJSONLineString;
  vehicleId: number;
  /** positionDateTime est optionnel car il a une valeur par défaut */
  positionDateTime?: ISODateString;
}

/**
 * Type pour une position avec détails du véhicule
 * Utilisé pour afficher les véhicules sur une carte
 */
export interface PositionWithVehicle extends Position {
  vehicle?: {
    vehicleId: number;
    vehicleName: string;
    vehicleMake: string;
    vehicleRegistrationNumber: string;
    vehicleType: string;
    vehicleSpeed?: number;
    vehicleFuelLevel?: number;
  };
}

/**
 * Type pour le tracking en temps réel
 * Combine position actuelle et informations du véhicule
 */
export interface LiveTracking {
  /** Position actuelle */
  position: PositionWithVehicle;
  
  /** Statut du véhicule */
  status: 'moving' | 'stopped' | 'idle';
  
  /** Vitesse actuelle (km/h) */
  speed?: number;
  
  /** Direction (en degrés, 0-360) */
  heading?: number;
  
  /** Dernière mise à jour */
  lastUpdate: ISODateString;
  
  /** Conducteur actuel (si disponible) */
  currentDriver?: {
    driverId: number;
    driverName: string;
  };
  
  /** Trajet en cours (si disponible) */
  currentTrip?: {
    tripId: number;
    departurePoint: GeoJSONPoint;
    departureDateTime: ISODateString;
  };
}

/**
 * Type pour les filtres de positions
 */
export interface PositionFilters {
  /** Filtrer par véhicule */
  vehicleId?: number;
  
  /** Filtrer par plage de dates */
  startDate?: ISODateString;
  endDate?: ISODateString;
  
  /** Limiter le nombre de résultats */
  limit?: number;
}

/**
 * Type pour les filtres d'historique de positions
 */
export interface PositionHistoryFilters {
  /** Filtrer par véhicule */
  vehicleId?: number;
  
  /** Filtrer par plage de dates */
  startDate?: ISODateString;
  endDate?: ISODateString;
}

/**
 * Type pour un ensemble de positions pour affichage sur carte
 * Optimisé pour le rendu de plusieurs véhicules
 */
export interface VehiclePositionsMap {
  /** Timestamp de la dernière mise à jour */
  lastUpdate: ISODateString;
  
  /** Positions de tous les véhicules */
  vehicles: {
    [vehicleId: number]: PositionWithVehicle;
  };
  
  /** Nombre total de véhicules */
  totalVehicles: number;
  
  /** Nombre de véhicules en mouvement */
  movingVehicles: number;
  
  /** Nombre de véhicules arrêtés */
  stoppedVehicles: number;
}

/**
 * Type pour l'analyse d'un trajet
 * Basé sur l'historique des positions
 */
export interface TripAnalysis {
  /** ID du véhicule */
  vehicleId: number;
  
  /** Période analysée */
  period: {
    startDate: ISODateString;
    endDate: ISODateString;
  };
  
  /** Trajet (LineString) */
  path: GeoJSONLineString;
  
  /** Distance totale parcourue (km) */
  totalDistance: number;
  
  /** Durée totale (minutes) */
  totalDuration: number;
  
  /** Vitesse moyenne (km/h) */
  averageSpeed: number;
  
  /** Vitesse maximale (km/h) */
  maxSpeed: number;
  
  /** Nombre d'arrêts */
  stopCount: number;
  
  /** Points d'arrêt */
  stops?: Array<{
    location: GeoJSONPoint;
    arrivalTime: ISODateString;
    departureTime: ISODateString;
    duration: number; // en minutes
  }>;
}

/**
 * Type pour une mise à jour de position en temps réel
 * Utilisé pour les WebSocket ou Server-Sent Events
 */
export interface PositionUpdate {
  /** Type d'événement */
  type: 'position_update';
  
  /** Timestamp de l'événement */
  timestamp: ISODateString;
  
  /** Position mise à jour */
  position: PositionWithVehicle;
}