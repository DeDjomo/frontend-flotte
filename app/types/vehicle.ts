// ============================================================================
// FICHIER: types/vehicle.ts
// DESCRIPTION: Types TypeScript pour l'entité Vehicle (Véhicule)
// ============================================================================

import { ISODateString } from './common';

/**
 * Interface Vehicle - Représente un véhicule de la flotte
 * Correspond à la table "vehicle" dans PostgreSQL
 * 
 * Table SQL:
 * CREATE TABLE vehicle (
 *   vehicleId SERIAL PRIMARY KEY,
 *   vehicleMake VARCHAR(50) NOT NULL,
 *   vehicleName VARCHAR(100) NOT NULL,
 *   vehicleRegistrationNumber VARCHAR(20) NOT NULL UNIQUE,
 *   vehicleType VARCHAR(50) NOT NULL,
 *   vehicleImage TEXT,
 *   vehicleDocument TEXT,
 *   vehicleIotAddress VARCHAR(100),
 *   vehicleFuelLevel DECIMAL(5,2) CHECK (vehicleFuelLevel >= 0 AND vehicleFuelLevel <= 100),
 *   vehicleNumberPassengers INTEGER CHECK (vehicleNumberPassengers > 0),
 *   vehicleSpeed DECIMAL(6,2) CHECK (vehicleSpeed >= 0),
 *   userId INTEGER NOT NULL,
 *   createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *   updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
 * );
 */
export interface Vehicle {
  /** ID unique du véhicule (auto-incrémenté) */
  vehicleId: number;
  
  /** Marque du véhicule (ex: Toyota, Mercedes, etc.) */
  vehicleMake: string;
  
  /** Nom/modèle du véhicule (ex: Corolla, Sprinter, etc.) */
  vehicleName: string;
  
  /** Numéro d'immatriculation (plaque) - unique */
  vehicleRegistrationNumber: string;
  
  /** Type de véhicule (ex: Berline, SUV, Camion, Bus, etc.) */
  vehicleType: string;
  
  /** 
   * URL ou chemin vers l'image du véhicule (optionnel)
   * Peut être un chemin local ou une URL complète
   */
  vehicleImage?: string | null;
  
  /** 
   * URL ou chemin vers les documents du véhicule (optionnel)
   * Carte grise, assurance, etc.
   */
  vehicleDocument?: string | null;
  
  /** 
   * Adresse du dispositif IoT (optionnel)
   * Pour la communication avec le tracker GPS
   * Peut être une adresse MAC, IP, ou identifiant unique
   */
  vehicleIotAddress?: string | null;
  
  /** 
   * Niveau de carburant actuel (en pourcentage)
   * Valeur entre 0 et 100
   */
  vehicleFuelLevel?: number | null;
  
  /** 
   * Nombre de passagers que le véhicule peut transporter
   * Doit être > 0
   */
  vehicleNumberPassengers?: number | null;
  
  /** 
   * Vitesse actuelle du véhicule (en km/h)
   * Mise à jour en temps réel par le dispositif IoT
   */
  vehicleSpeed?: number | null;
  
  /** ID de l'utilisateur propriétaire du véhicule */
  userId: number;
  
  /** Date d'ajout du véhicule dans le système */
  createdAt: ISODateString;
  
  /** Date de dernière modification */
  updatedAt: ISODateString;
}

/**
 * Type pour la création d'un nouveau véhicule
 * Exclut les champs auto-générés et optionnels
 * 
 * Utilisation: Pour les requêtes POST /vehicles
 */
export interface CreateVehicleDto {
  vehicleMake: string;
  vehicleName: string;
  vehicleRegistrationNumber: string;
  vehicleType: string;
  vehicleImage?: string;
  vehicleDocument?: string;
  vehicleIotAddress?: string;
  vehicleFuelLevel?: number;
  vehicleNumberPassengers?: number;
  vehicleSpeed?: number;
  userId: number;
}

/**
 * Type pour la mise à jour d'un véhicule
 * Tous les champs sont optionnels (mise à jour partielle)
 * 
 * Utilisation: Pour les requêtes PUT/PATCH /vehicles/:id
 */
export interface UpdateVehicleDto {
  vehicleMake?: string;
  vehicleName?: string;
  vehicleRegistrationNumber?: string;
  vehicleType?: string;
  vehicleImage?: string;
  vehicleDocument?: string;
  vehicleIotAddress?: string;
  vehicleFuelLevel?: number;
  vehicleNumberPassengers?: number;
  vehicleSpeed?: number;
  userId?: number;
}

/**
 * Énumération des types de véhicules courants
 * Tu peux l'utiliser pour avoir des valeurs prédéfinies
 */
export enum VehicleType {
  BERLINE = 'Berline',
  SUV = 'SUV',
  CAMION = 'Camion',
  CAMIONNETTE = 'Camionnette',
  BUS = 'Bus',
  MINIBUS = 'Minibus',
  MOTO = 'Moto',
  PICKUP = 'Pickup',
  AUTRE = 'Autre'
}

/**
 * Type pour un véhicule avec ses conducteurs assignés
 * Utile pour afficher tous les conducteurs d'un véhicule
 */
export interface VehicleWithDrivers extends Vehicle {
  /** Liste des conducteurs assignés */
  drivers?: Array<{
    driverId: number;
    driverName: string;
    driverPhoneNumber: string;
    assignedAt: ISODateString;
  }>;
}

/**
 * Type pour un véhicule avec toutes ses relations
 * Inclut le propriétaire, les conducteurs, etc.
 */
export interface VehicleDetails extends Vehicle {
  /** Informations du propriétaire */
  owner?: {
    userId: number;
    userName: string;
    userEmail: string;
  };
  
  /** Liste des conducteurs assignés */
  drivers?: Array<{
    driverId: number;
    driverName: string;
    driverPhoneNumber: string;
    assignedAt: ISODateString;
  }>;
  
  /** Statistiques du véhicule */
  statistics?: {
    totalTrips: number;
    totalDistance: number;
    totalFuelConsumption: number;
    lastMaintenanceDate?: ISODateString;
  };
}

/**
 * Type pour les filtres de recherche de véhicules
 */
export interface VehicleFilters {
  vehicleType?: string;
  vehicleMake?: string;
  userId?: number;
  minFuelLevel?: number;
  maxFuelLevel?: number;
}