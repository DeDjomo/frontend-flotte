// ============================================================================
// FICHIER: lib/services/driverService.ts
// DESCRIPTION: Service pour gérer toutes les opérations API liées aux conducteurs
// ============================================================================

/**
 * Ce service encapsule toutes les requêtes HTTP liées aux conducteurs.
 * Gère les conducteurs, leurs véhicules assignés, et leurs informations.
 */

import api from '../api';
import {
  Driver,
  CreateDriverDto,
  UpdateDriverDto,
  DriverWithVehicles,
  PaginatedResponse,
  PaginationParams,
} from '../../types';
import { AxiosResponse } from 'axios';

// ============================================================================
// 1. FONCTIONS CRUD DE BASE
// ============================================================================

/**
 * Récupérer tous les conducteurs
 * 
 * @param params - Paramètres de pagination (optionnels)
 * @returns Promise avec la liste des conducteurs
 * 
 * Endpoint: GET /drivers
 * Exemple d'utilisation:
 * const drivers = await driverService.getAllDrivers();
 * const paginatedDrivers = await driverService.getAllDrivers({ page: 0, size: 20 });
 */
export const getAllDrivers = async (
  params?: PaginationParams
): Promise<Driver[]> => {
  try {
    const response: AxiosResponse<Driver[]> = await api.get('/drivers', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des conducteurs:', error);
    throw error;
  }
};

/**
 * Récupérer tous les conducteurs avec pagination
 * 
 * @param params - Paramètres de pagination
 * @returns Promise avec la réponse paginée
 * 
 * Endpoint: GET /drivers/paginated
 */
export const getAllDriversPaginated = async (
  params: PaginationParams = { page: 0, size: 10 }
): Promise<PaginatedResponse<Driver>> => {
  try {
    const response: AxiosResponse<PaginatedResponse<Driver>> = await api.get(
      '/drivers/paginated',
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération paginée des conducteurs:', error);
    throw error;
  }
};

/**
 * Récupérer un conducteur par son ID
 * 
 * @param driverId - ID du conducteur
 * @returns Promise avec le conducteur
 * 
 * Endpoint: GET /drivers/:id
 * Exemple d'utilisation:
 * const driver = await driverService.getDriverById(1);
 */
export const getDriverById = async (driverId: number): Promise<Driver> => {
  try {
    const response: AxiosResponse<Driver> = await api.get(
      `/drivers/${driverId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du conducteur ${driverId}:`, error);
    throw error;
  }
};

/**
 * Récupérer un conducteur avec ses véhicules assignés
 * 
 * @param driverId - ID du conducteur
 * @returns Promise avec le conducteur et ses véhicules
 * 
 * Endpoint: GET /drivers/:id/with-vehicles
 * Exemple d'utilisation:
 * const driverWithVehicles = await driverService.getDriverWithVehicles(1);
 */
export const getDriverWithVehicles = async (
  driverId: number
): Promise<DriverWithVehicles> => {
  try {
    const response: AxiosResponse<DriverWithVehicles> = await api.get(
      `/drivers/${driverId}/with-vehicles`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du conducteur ${driverId} avec ses véhicules:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer un conducteur par son email
 * 
 * @param email - Email du conducteur
 * @returns Promise avec le conducteur
 * 
 * Endpoint: GET /drivers/email/:email
 * Exemple d'utilisation:
 * const driver = await driverService.getDriverByEmail('driver@example.com');
 */
export const getDriverByEmail = async (email: string): Promise<Driver> => {
  try {
    const encodedEmail = encodeURIComponent(email);
    const response: AxiosResponse<Driver> = await api.get(
      `/drivers/email/${encodedEmail}`
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du conducteur avec l'email ${email}:`, error);
    throw error;
  }
};

/**
 * Récupérer un conducteur par son numéro de téléphone
 * 
 * @param phoneNumber - Numéro de téléphone du conducteur
 * @returns Promise avec le conducteur
 * 
 * Endpoint: GET /drivers/phone/:phoneNumber
 * Exemple d'utilisation:
 * const driver = await driverService.getDriverByPhone('+237600000000');
 */
export const getDriverByPhone = async (phoneNumber: string): Promise<Driver> => {
  try {
    const encodedPhone = encodeURIComponent(phoneNumber);
    const response: AxiosResponse<Driver> = await api.get(
      `/drivers/phone/${encodedPhone}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du conducteur avec le numéro ${phoneNumber}:`,
      error
    );
    throw error;
  }
};

/**
 * Créer un nouveau conducteur
 * 
 * @param driverData - Données du nouveau conducteur
 * @returns Promise avec le conducteur créé
 * 
 * Endpoint: POST /drivers
 * Exemple d'utilisation:
 * const newDriver = await driverService.createDriver({
 *   driverName: "Jean Dupont",
 *   driverEmail: "jean@example.com",
 *   driverPhoneNumber: "+237600000000",
 *   emergencyContactName: "Marie Dupont",
 *   emergencyContact: "+237611111111"
 * });
 */
export const createDriver = async (
  driverData: CreateDriverDto
): Promise<Driver> => {
  try {
    const response: AxiosResponse<Driver> = await api.post(
      '/drivers',
      driverData
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du conducteur:', error);
    throw error;
  }
};

/**
 * Mettre à jour un conducteur existant
 * 
 * @param driverId - ID du conducteur à modifier
 * @param driverData - Données à mettre à jour
 * @returns Promise avec le conducteur mis à jour
 * 
 * Endpoint: PUT /drivers/:id
 * Exemple d'utilisation:
 * const updated = await driverService.updateDriver(1, {
 *   driverPhoneNumber: "+237622222222"
 * });
 */
export const updateDriver = async (
  driverId: number,
  driverData: UpdateDriverDto
): Promise<Driver> => {
  try {
    const response: AxiosResponse<Driver> = await api.put(
      `/drivers/${driverId}`,
      driverData
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du conducteur ${driverId}:`, error);
    throw error;
  }
};

/**
 * Mettre à jour partiellement un conducteur (PATCH)
 * 
 * @param driverId - ID du conducteur
 * @param driverData - Champs à mettre à jour
 * @returns Promise avec le conducteur mis à jour
 * 
 * Endpoint: PATCH /drivers/:id
 */
export const patchDriver = async (
  driverId: number,
  driverData: UpdateDriverDto
): Promise<Driver> => {
  try {
    const response: AxiosResponse<Driver> = await api.patch(
      `/drivers/${driverId}`,
      driverData
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour partielle du conducteur ${driverId}:`, error);
    throw error;
  }
};

/**
 * Supprimer un conducteur
 * 
 * @param driverId - ID du conducteur à supprimer
 * @returns Promise<void>
 * 
 * Endpoint: DELETE /drivers/:id
 * Exemple d'utilisation:
 * await driverService.deleteDriver(1);
 */
export const deleteDriver = async (driverId: number): Promise<void> => {
  try {
    await api.delete(`/drivers/${driverId}`);
    console.log(`Conducteur ${driverId} supprimé avec succès`);
  } catch (error) {
    console.error(`Erreur lors de la suppression du conducteur ${driverId}:`, error);
    throw error;
  }
};

// ============================================================================
// 2. GESTION DES VÉHICULES ASSIGNÉS
// ============================================================================

/**
 * Récupérer tous les véhicules assignés à un conducteur
 * 
 * @param driverId - ID du conducteur
 * @returns Promise avec la liste des véhicules
 * 
 * Endpoint: GET /drivers/:id/vehicles
 * Exemple d'utilisation:
 * const vehicles = await driverService.getDriverVehicles(1);
 */
export const getDriverVehicles = async (driverId: number): Promise<any[]> => {
  try {
    const response: AxiosResponse<any[]> = await api.get(
      `/drivers/${driverId}/vehicles`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des véhicules du conducteur ${driverId}:`,
      error
    );
    throw error;
  }
};

/**
 * Assigner un véhicule à un conducteur
 * 
 * @param driverId - ID du conducteur
 * @param vehicleId - ID du véhicule
 * @returns Promise<void>
 * 
 * Endpoint: POST /drivers/:id/vehicles/:vehicleId
 * Exemple d'utilisation:
 * await driverService.assignVehicle(1, 5);
 */
export const assignVehicle = async (
  driverId: number,
  vehicleId: number
): Promise<void> => {
  try {
    await api.post(`/drivers/${driverId}/vehicles/${vehicleId}`);
    console.log(`Véhicule ${vehicleId} assigné au conducteur ${driverId}`);
  } catch (error) {
    console.error(
      `Erreur lors de l'assignation du véhicule ${vehicleId} au conducteur ${driverId}:`,
      error
    );
    throw error;
  }
};

/**
 * Retirer un véhicule d'un conducteur
 * 
 * @param driverId - ID du conducteur
 * @param vehicleId - ID du véhicule
 * @returns Promise<void>
 * 
 * Endpoint: DELETE /drivers/:id/vehicles/:vehicleId
 * Exemple d'utilisation:
 * await driverService.removeVehicle(1, 5);
 */
export const removeVehicle = async (
  driverId: number,
  vehicleId: number
): Promise<void> => {
  try {
    await api.delete(`/drivers/${driverId}/vehicles/${vehicleId}`);
    console.log(`Véhicule ${vehicleId} retiré du conducteur ${driverId}`);
  } catch (error) {
    console.error(
      `Erreur lors du retrait du véhicule ${vehicleId} du conducteur ${driverId}:`,
      error
    );
    throw error;
  }
};

// ============================================================================
// 3. RECHERCHE ET FILTRAGE
// ============================================================================

/**
 * Rechercher des conducteurs par nom
 * 
 * @param searchTerm - Terme de recherche
 * @returns Promise avec la liste des conducteurs correspondants
 * 
 * Endpoint: GET /drivers/search?q=...
 * Exemple d'utilisation:
 * const results = await driverService.searchDrivers("Jean");
 */
export const searchDrivers = async (searchTerm: string): Promise<Driver[]> => {
  try {
    const response: AxiosResponse<Driver[]> = await api.get('/drivers/search', {
      params: { q: searchTerm },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche de conducteurs:', error);
    throw error;
  }
};

/**
 * Récupérer les conducteurs disponibles (non assignés à un trajet en cours)
 * 
 * @returns Promise avec la liste des conducteurs disponibles
 * 
 * Endpoint: GET /drivers/available
 * Exemple d'utilisation:
 * const availableDrivers = await driverService.getAvailableDrivers();
 */
export const getAvailableDrivers = async (): Promise<Driver[]> => {
  try {
    const response: AxiosResponse<Driver[]> = await api.get('/drivers/available');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des conducteurs disponibles:', error);
    throw error;
  }
};

/**
 * Récupérer les conducteurs actuellement en trajet
 * 
 * @returns Promise avec la liste des conducteurs en trajet
 * 
 * Endpoint: GET /drivers/on-trip
 * Exemple d'utilisation:
 * const driversOnTrip = await driverService.getDriversOnTrip();
 */
export const getDriversOnTrip = async (): Promise<Driver[]> => {
  try {
    const response: AxiosResponse<Driver[]> = await api.get('/drivers/on-trip');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des conducteurs en trajet:', error);
    throw error;
  }
};

/**
 * Récupérer tous les conducteurs d'un utilisateur
 *
 * @param userId - ID de l'utilisateur
 * @returns Promise avec la liste des conducteurs
 *
 * Endpoint: GET /drivers/user/:userId
 * Exemple d'utilisation:
 * const userDrivers = await driverService.getDriversByUser(1);
 */
export const getDriversByUser = async (userId: number): Promise<Driver[]> => {
  try {
    const response: AxiosResponse<Driver[]> = await api.get(
      `/drivers/user/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des conducteurs de l'utilisateur ${userId}:`,
      error
    );
    throw error;
  }
};

/**
 * Compter le nombre total de conducteurs
 *
 * @returns Promise avec le nombre de conducteurs
 *
 * Endpoint: GET /drivers/count
 * Exemple d'utilisation:
 * const count = await driverService.countDrivers();
 */
export const countDrivers = async (): Promise<number> => {
  try {
    const response: AxiosResponse<{ count: number }> = await api.get(
      '/drivers/count'
    );
    return response.data.count;
  } catch (error) {
    console.error('Erreur lors du comptage des conducteurs:', error);
    throw error;
  }
};

/**
 * Compter le nombre de conducteurs d'un utilisateur
 *
 * @param drivers - Liste des conducteurs de l'utilisateur
 * @returns Nombre de conducteurs
 *
 * Exemple d'utilisation:
 * const drivers = await driverService.getDriversByUser(1);
 * const count = driverService.countUserDrivers(drivers);
 */
export const countUserDrivers = (drivers: Driver[]): number => {
  return drivers.length;
};

// ============================================================================
// 4. STATISTIQUES ET HISTORIQUE
// ============================================================================

/**
 * Récupérer les statistiques d'un conducteur
 * 
 * @param driverId - ID du conducteur
 * @returns Promise avec les statistiques
 * 
 * Endpoint: GET /drivers/:id/statistics
 * Exemple d'utilisation:
 * const stats = await driverService.getDriverStatistics(1);
 * // Retourne: { totalTrips, totalDistance, totalDuration, etc. }
 */
export const getDriverStatistics = async (
  driverId: number
): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await api.get(
      `/drivers/${driverId}/statistics`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des statistiques du conducteur ${driverId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer l'historique des trajets d'un conducteur
 * 
 * @param driverId - ID du conducteur
 * @param params - Paramètres de pagination
 * @returns Promise avec la liste des trajets
 * 
 * Endpoint: GET /drivers/:id/trips
 * Exemple d'utilisation:
 * const trips = await driverService.getDriverTrips(1, { page: 0, size: 20 });
 */
export const getDriverTrips = async (
  driverId: number,
  params?: PaginationParams
): Promise<any[]> => {
  try {
    const response: AxiosResponse<any[]> = await api.get(
      `/drivers/${driverId}/trips`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des trajets du conducteur ${driverId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer le trajet actuel d'un conducteur (si en cours)
 * 
 * @param driverId - ID du conducteur
 * @returns Promise avec le trajet en cours ou null
 * 
 * Endpoint: GET /drivers/:id/current-trip
 * Exemple d'utilisation:
 * const currentTrip = await driverService.getCurrentTrip(1);
 */
export const getCurrentTrip = async (driverId: number): Promise<any | null> => {
  try {
    const response: AxiosResponse<any> = await api.get(
      `/drivers/${driverId}/current-trip`
    );
    return response.data;
  } catch (error) {
    // Si le conducteur n'a pas de trajet en cours, l'API peut retourner 404
    // On retourne null dans ce cas
    if ((error as any)?.response?.status === 404) {
      return null;
    }
    console.error(
      `Erreur lors de la récupération du trajet actuel du conducteur ${driverId}:`,
      error
    );
    throw error;
  }
};

// ============================================================================
// 5. GESTION DES CONTACTS D'URGENCE
// ============================================================================

/**
 * Mettre à jour le contact d'urgence d'un conducteur
 * 
 * @param driverId - ID du conducteur
 * @param emergencyContactName - Nom du contact d'urgence
 * @param emergencyContact - Numéro du contact d'urgence
 * @returns Promise avec le conducteur mis à jour
 * 
 * Endpoint: PATCH /drivers/:id/emergency-contact
 * Exemple d'utilisation:
 * await driverService.updateEmergencyContact(1, "Marie Dupont", "+237611111111");
 */
export const updateEmergencyContact = async (
  driverId: number,
  emergencyContactName: string,
  emergencyContact: string
): Promise<Driver> => {
  try {
    const response: AxiosResponse<Driver> = await api.patch(
      `/drivers/${driverId}/emergency-contact`,
      {
        emergencyContactName,
        emergencyContact,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour du contact d'urgence du conducteur ${driverId}:`,
      error
    );
    throw error;
  }
};

/**
 * Mettre à jour les informations personnelles d'un conducteur
 * 
 * @param driverId - ID du conducteur
 * @param personnalInformations - Informations personnelles (texte libre)
 * @returns Promise avec le conducteur mis à jour
 * 
 * Endpoint: PATCH /drivers/:id/personal-info
 * Exemple d'utilisation:
 * await driverService.updatePersonalInfo(1, "Adresse: 123 rue...\nPermis: ABC123");
 */
export const updatePersonalInfo = async (
  driverId: number,
  personnalInformations: string
): Promise<Driver> => {
  try {
    const response: AxiosResponse<Driver> = await api.patch(
      `/drivers/${driverId}/personal-info`,
      { personnalInformations }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour des informations personnelles du conducteur ${driverId}:`,
      error
    );
    throw error;
  }
};

// ============================================================================
// 6. EXPORT D'UN OBJET SERVICE COMPLET
// ============================================================================

const driverService = {
  // CRUD
  getAllDrivers,
  getAllDriversPaginated,
  getDriverById,
  getDriverWithVehicles,
  getDriverByEmail,
  getDriverByPhone,
  createDriver,
  updateDriver,
  patchDriver,
  deleteDriver,

  // Gestion des véhicules
  getDriverVehicles,
  assignVehicle,
  removeVehicle,

  // Recherche et filtrage
  searchDrivers,
  getDriversByUser,
  getAvailableDrivers,
  getDriversOnTrip,
  countDrivers,
  countUserDrivers,

  // Statistiques et historique
  getDriverStatistics,
  getDriverTrips,
  getCurrentTrip,

  // Contacts et informations
  updateEmergencyContact,
  updatePersonalInfo,
};

export default driverService;