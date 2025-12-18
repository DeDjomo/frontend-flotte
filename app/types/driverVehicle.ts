// ============================================================================
// FICHIER: types/driverVehicle.ts
// DESCRIPTION: Types pour la relation Many-to-Many entre Driver et Vehicle
// ============================================================================

import { ISODateString } from './common';

/**
 * Interface DriverVehicle - Représente l'assignation d'un conducteur à un véhicule
 * Correspond à la table "driver_vehicle" dans PostgreSQL
 * 
 * Table SQL:
 * CREATE TABLE driver_vehicle (
 *   driverId INTEGER NOT NULL,
 *   vehicleId INTEGER NOT NULL,
 *   assignedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *   PRIMARY KEY (driverId, vehicleId)
 * );
 * 
 * Note: Cette table permet à:
 * - Un conducteur de conduire plusieurs véhicules
 * - Un véhicule d'être conduit par plusieurs conducteurs
 */
export interface DriverVehicle {
  /** ID du conducteur */
  driverId: number;
  
  /** ID du véhicule */
  vehicleId: number;
  
  /** Date et heure d'assignation */
  assignedAt: ISODateString;
}

/**
 * Type pour créer une nouvelle assignation conducteur-véhicule
 * 
 * Utilisation: Pour les requêtes POST /driver-vehicle
 */
export interface CreateDriverVehicleDto {
  driverId: number;
  vehicleId: number;
}

/**
 * Type pour une assignation avec les détails du conducteur
 * Utilisé quand on récupère les conducteurs d'un véhicule
 */
export interface DriverVehicleWithDriverDetails extends DriverVehicle {
  driver: {
    driverName: string;
    driverEmail: string;
    driverPhoneNumber: string;
  };
}

/**
 * Type pour une assignation avec les détails du véhicule
 * Utilisé quand on récupère les véhicules d'un conducteur
 */
export interface DriverVehicleWithVehicleDetails extends DriverVehicle {
  vehicle: {
    vehicleName: string;
    vehicleMake: string;
    vehicleRegistrationNumber: string;
    vehicleType: string;
  };
}

/**
 * Type pour une assignation complète avec tous les détails
 */
export interface DriverVehicleComplete extends DriverVehicle {
  driver: {
    driverName: string;
    driverEmail: string;
    driverPhoneNumber: string;
  };
  vehicle: {
    vehicleName: string;
    vehicleMake: string;
    vehicleRegistrationNumber: string;
    vehicleType: string;
  };
}