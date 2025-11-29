// ============================================================================
// FICHIER: types/fuelRecharge.ts
// DESCRIPTION: Types TypeScript pour l'entité FuelRecharge (Recharge de carburant)
// ============================================================================

import { ISODateString, GeoJSONPoint } from './common';

/**
 * Interface FuelRecharge - Représente une recharge de carburant
 * Correspond à la table "fuelRecharge" dans PostgreSQL
 * 
 * Table SQL:
 * CREATE TABLE fuelRecharge (
 *   rechargeId SERIAL PRIMARY KEY,
 *   rechargeQuantity DECIMAL(8,2) NOT NULL CHECK (rechargeQuantity > 0),
 *   rechargePrice DECIMAL(10,2) NOT NULL CHECK (rechargePrice >= 0),
 *   rechargePoint GEOMETRY(Point, 4326),
 *   rechargeDateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *   vehicleId INTEGER NOT NULL
 * );
 */
export interface FuelRecharge {
  /** ID unique de la recharge (auto-incrémenté) */
  rechargeId: number;
  
  /** 
   * Quantité de carburant rechargée (en litres)
   * Doit être > 0
   */
  rechargeQuantity: number;
  
  /** 
   * Prix total de la recharge (en FCFA ou autre devise)
   * Doit être >= 0
   */
  rechargePrice: number;
  
  /** 
   * Point géographique où la recharge a eu lieu (optionnel)
   * Format GeoJSON Point avec coordonnées [longitude, latitude]
   * Exemple: { type: "Point", coordinates: [3.8480, 11.5021] }
   */
  rechargePoint?: GeoJSONPoint | null;
  
  /** Date et heure de la recharge */
  rechargeDateTime: ISODateString;
  
  /** ID du véhicule rechargé */
  vehicleId: number;
}

/**
 * Type pour la création d'une nouvelle recharge
 * Exclut les champs auto-générés
 * 
 * Utilisation: Pour les requêtes POST /fuel-recharges
 */
export interface CreateFuelRechargeDto {
  rechargeQuantity: number;
  rechargePrice: number;
  rechargePoint?: GeoJSONPoint;
  vehicleId: number;
  /** rechargeDateTime est optionnel car il a une valeur par défaut (CURRENT_TIMESTAMP) */
  rechargeDateTime?: ISODateString;
}

/**
 * Type pour la mise à jour d'une recharge
 * Tous les champs sont optionnels
 * 
 * Utilisation: Pour les requêtes PUT/PATCH /fuel-recharges/:id
 */
export interface UpdateFuelRechargeDto {
  rechargeQuantity?: number;
  rechargePrice?: number;
  rechargePoint?: GeoJSONPoint;
  rechargeDateTime?: ISODateString;
  vehicleId?: number;
}

/**
 * Type pour une recharge avec les détails du véhicule
 */
export interface FuelRechargeWithVehicle extends FuelRecharge {
  vehicle?: {
    vehicleId: number;
    vehicleName: string;
    vehicleMake: string;
    vehicleRegistrationNumber: string;
  };
}

/**
 * Type pour les statistiques de recharge
 */
export interface FuelRechargeStats {
  /** Nombre total de recharges */
  totalRecharges: number;
  
  /** Quantité totale de carburant rechargée (litres) */
  totalQuantity: number;
  
  /** Coût total des recharges */
  totalCost: number;
  
  /** Prix moyen par litre */
  averagePricePerLiter: number;
  
  /** Quantité moyenne par recharge */
  averageQuantity: number;
  
  /** Dernière recharge */
  lastRecharge?: {
    rechargeId: number;
    rechargeDateTime: ISODateString;
    rechargeQuantity: number;
    rechargePrice: number;
  };
}

/**
 * Type pour les filtres de recharge
 */
export interface FuelRechargeFilters {
  /** Filtrer par véhicule */
  vehicleId?: number;
  
  /** Filtrer par plage de dates */
  startDate?: ISODateString;
  endDate?: ISODateString;
  
  /** Filtrer par quantité minimale */
  minQuantity?: number;
  
  /** Filtrer par quantité maximale */
  maxQuantity?: number;
  
  /** Filtrer par prix minimal */
  minPrice?: number;
  
  /** Filtrer par prix maximal */
  maxPrice?: number;
}

/**
 * Type pour un rapport de consommation de carburant
 * Utile pour analyser la consommation sur une période
 */
export interface FuelConsumptionReport {
  /** ID du véhicule */
  vehicleId: number;
  
  /** Période du rapport */
  period: {
    startDate: ISODateString;
    endDate: ISODateString;
  };
  
  /** Statistiques */
  stats: FuelRechargeStats;
  
  /** Liste des recharges */
  recharges: FuelRecharge[];
  
  /** Consommation moyenne (litres/100km) - si disponible */
  averageConsumption?: number;
}