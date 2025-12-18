// ============================================================================
// FICHIER: types/maintenance.ts
// DESCRIPTION: Types TypeScript pour l'entité Maintenance
// ============================================================================

import { ISODateString, GeoJSONPoint } from './common';

/**
 * Interface Maintenance - Représente une opération de maintenance
 * Correspond à la table "maintenance" dans PostgreSQL
 * 
 * Table SQL:
 * CREATE TABLE maintenance (
 *   maintenanceId SERIAL PRIMARY KEY,
 *   maintenanceDateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *   maintenancePoint GEOMETRY(Point, 4326),
 *   maintenanceSubject VARCHAR(200) NOT NULL,
 *   maintenanceCost DECIMAL(10,2) NOT NULL CHECK (maintenanceCost >= 0),
 *   vehicleId INTEGER NOT NULL
 * );
 */
export interface Maintenance {
  /** ID unique de la maintenance (auto-incrémenté) */
  maintenanceId: number;
  
  /** Date et heure de la maintenance */
  maintenanceDateTime: ISODateString;
  
  /** 
   * Point géographique où la maintenance a eu lieu (optionnel)
   * Format GeoJSON Point avec coordonnées [longitude, latitude]
   * Exemple: { type: "Point", coordinates: [3.8480, 11.5021] }
   */
  maintenancePoint?: GeoJSONPoint | null;
  
  /** 
   * Sujet/description de la maintenance
   * Ex: "Vidange", "Changement de pneus", "Révision complète"
   */
  maintenanceSubject: string;
  
  /** 
   * Coût de la maintenance (en FCFA ou autre devise)
   * Doit être >= 0
   */
  maintenanceCost: number;
  
  /** ID du véhicule maintenu */
  vehicleId: number;
}

/**
 * Type pour la création d'une nouvelle maintenance
 * Exclut les champs auto-générés
 * 
 * Utilisation: Pour les requêtes POST /maintenances
 */
export interface CreateMaintenanceDto {
  maintenanceSubject: string;
  maintenanceCost: number;
  maintenancePoint?: GeoJSONPoint;
  vehicleId: number;
  /** maintenanceDateTime est optionnel car il a une valeur par défaut (CURRENT_TIMESTAMP) */
  maintenanceDateTime?: ISODateString;
}

/**
 * Type pour la mise à jour d'une maintenance
 * Tous les champs sont optionnels
 * 
 * Utilisation: Pour les requêtes PUT/PATCH /maintenances/:id
 */
export interface UpdateMaintenanceDto {
  maintenanceDateTime?: ISODateString;
  maintenancePoint?: GeoJSONPoint;
  maintenanceSubject?: string;
  maintenanceCost?: number;
  vehicleId?: number;
}

/**
 * Énumération des types de maintenance courants
 */
export enum MaintenanceType {
  /** Vidange d'huile */
  OIL_CHANGE = 'Vidange',
  
  /** Changement de pneus */
  TIRE_CHANGE = 'Changement de pneus',
  
  /** Freins */
  BRAKES = 'Freins',
  
  /** Batterie */
  BATTERY = 'Batterie',
  
  /** Révision complète */
  FULL_SERVICE = 'Révision complète',
  
  /** Réparation */
  REPAIR = 'Réparation',
  
  /** Contrôle technique */
  INSPECTION = 'Contrôle technique',
  
  /** Climatisation */
  AC_SERVICE = 'Climatisation',
  
  /** Autre */
  OTHER = 'Autre'
}

/**
 * Type pour une maintenance avec les détails du véhicule
 */
export interface MaintenanceWithVehicle extends Maintenance {
  vehicle?: {
    vehicleId: number;
    vehicleName: string;
    vehicleMake: string;
    vehicleRegistrationNumber: string;
  };
}

/**
 * Type pour les statistiques de maintenance
 */
export interface MaintenanceStats {
  /** Nombre total de maintenances */
  totalMaintenances: number;
  
  /** Coût total des maintenances */
  totalCost: number;
  
  /** Coût moyen par maintenance */
  averageCost: number;
  
  /** Dernière maintenance */
  lastMaintenance?: {
    maintenanceId: number;
    maintenanceDateTime: ISODateString;
    maintenanceSubject: string;
    maintenanceCost: number;
  };
  
  /** Prochaine maintenance prévue (optionnel) */
  nextScheduledMaintenance?: {
    estimatedDate: ISODateString;
    type: string;
    reason: string;
  };
  
  /** Répartition par type de maintenance */
  byType?: Record<string, number>;
}

/**
 * Type pour les filtres de maintenance
 */
export interface MaintenanceFilters {
  /** Filtrer par véhicule */
  vehicleId?: number;
  
  /** Filtrer par plage de dates */
  startDate?: ISODateString;
  endDate?: ISODateString;
  
  /** Filtrer par type de maintenance */
  maintenanceSubject?: string;
  
  /** Filtrer par coût minimal */
  minCost?: number;
  
  /** Filtrer par coût maximal */
  maxCost?: number;
}

/**
 * Type pour un rapport de maintenance
 * Utile pour analyser l'historique de maintenance d'un véhicule
 */
export interface MaintenanceReport {
  /** ID du véhicule */
  vehicleId: number;
  
  /** Informations du véhicule */
  vehicle: {
    vehicleName: string;
    vehicleMake: string;
    vehicleRegistrationNumber: string;
  };
  
  /** Période du rapport */
  period: {
    startDate: ISODateString;
    endDate: ISODateString;
  };
  
  /** Statistiques */
  stats: MaintenanceStats;
  
  /** Liste des maintenances */
  maintenances: Maintenance[];
  
  /** Recommandations (optionnel) */
  recommendations?: string[];
}

/**
 * Type pour planifier une maintenance future
 */
export interface ScheduledMaintenance {
  /** ID de la maintenance planifiée */
  scheduledMaintenanceId?: number;
  
  /** Date prévue */
  scheduledDate: ISODateString;
  
  /** Type de maintenance prévue */
  maintenanceSubject: string;
  
  /** Coût estimé */
  estimatedCost?: number;
  
  /** ID du véhicule */
  vehicleId: number;
  
  /** Statut */
  status: 'pending' | 'completed' | 'cancelled';
  
  /** Notes */
  notes?: string;
}