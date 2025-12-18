// ============================================================================
// FICHIER: types/driver.ts
// DESCRIPTION: Types TypeScript pour l'entité Driver (Conducteur)
// ============================================================================

import { ISODateString } from './common';

/**
 * Interface Driver - Représente un conducteur
 * Correspond à la table "driver" dans PostgreSQL
 * 
 * Table SQL:
 * CREATE TABLE driver (
 *   driverId SERIAL PRIMARY KEY,
 *   driverName VARCHAR(100) NOT NULL,
 *   driverEmail VARCHAR(150) NOT NULL UNIQUE,
 *   driverPhoneNumber VARCHAR(20) NOT NULL,
 *   emergencyContactName VARCHAR(100),
 *   emergencyContact VARCHAR(20),
 *   personalInformations TEXT,
 *   createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *   updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
 * );
 */
export interface Driver {
  /** ID unique du conducteur (auto-incrémenté) */
  driverId: number;
  
  /** Nom complet du conducteur */
  driverName: string;
  
  /** Email du conducteur (unique) */
  driverEmail: string;
  
  /** Numéro de téléphone du conducteur */
  driverPhoneNumber: string;
  
  /** Nom du contact d'urgence (optionnel) */
  emergencyContactName?: string | null;
  
  /** Numéro de téléphone du contact d'urgence (optionnel) */
  emergencyContact?: string | null;
  
  /** 
   * Informations personnelles supplémentaires (optionnel)
   * Peut contenir: adresse, numéro de permis, groupe sanguin, etc.
   */
  personalInformations?: string | null;
  
  /** Date de création de la fiche conducteur */
  createdAt: ISODateString;
  
  /** Date de dernière modification */
  updatedAt: ISODateString;
}

/**
 * Type pour la création d'un nouveau conducteur
 * Exclut les champs auto-générés
 * 
 * Utilisation: Pour les requêtes POST /drivers
 */
export interface CreateDriverDto {
  driverName: string;
  driverEmail: string;
  driverPhoneNumber: string;
  emergencyContactName?: string;
  emergencyContact?: string;
  personalInformations?: string;
  userId: number;
}

/**
 * Type pour la mise à jour d'un conducteur
 * Tous les champs sont optionnels (mise à jour partielle)
 * 
 * Utilisation: Pour les requêtes PUT/PATCH /drivers/:id
 */
export interface UpdateDriverDto {
  driverName?: string;
  driverEmail?: string;
  driverPhoneNumber?: string;
  emergencyContactName?: string;
  emergencyContact?: string;
  personalInformations?: string;
}

/**
 * Type pour un conducteur avec ses véhicules assignés
 * Utile pour afficher tous les véhicules d'un conducteur
 */
export interface DriverWithVehicles extends Driver {
  /** Liste des IDs des véhicules assignés */
  vehicleIds?: number[];
  
  /** Ou la liste complète des véhicules (si l'API les retourne) */
  vehicles?: Array<{
    vehicleId: number;
    vehicleName: string;
    vehicleRegistrationNumber: string;
    assignedAt: ISODateString;
  }>;
}