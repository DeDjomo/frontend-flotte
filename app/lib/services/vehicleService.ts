// ============================================================================
// FICHIER: lib/services/vehicleService.ts
// DESCRIPTION: Service pour gérer toutes les opérations API liées aux véhicules
// ============================================================================

/**
 * Ce service encapsule toutes les requêtes HTTP liées aux véhicules.
 * Gère les véhicules, leurs conducteurs, et les statistiques associées.
 */

import api from '../api';
import {
  Vehicle,
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleWithDrivers,
  VehicleDetails,
  VehicleFilters,
  PaginatedResponse,
  PaginationParams,
} from '../../types';
import { AxiosResponse } from 'axios';

// ============================================================================
// 1. FONCTIONS CRUD DE BASE
// ============================================================================

/**
 * Récupérer tous les véhicules
 * 
 * @param params - Paramètres de pagination (optionnels)
 * @returns Promise avec la liste des véhicules
 * 
 * Endpoint: GET /vehicles
 * Exemple d'utilisation:
 * const vehicles = await vehicleService.getAllVehicles();
 * const paginatedVehicles = await vehicleService.getAllVehicles({ page: 0, size: 20 });
 */
export const getAllVehicles = async (
  params?: PaginationParams
): Promise<Vehicle[]> => {
  try {
    const response: AxiosResponse<Vehicle[]> = await api.get('/vehicles', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des véhicules:', error);
    throw error;
  }
};

/**
 * Récupérer tous les véhicules avec pagination
 * 
 * @param params - Paramètres de pagination
 * @returns Promise avec la réponse paginée
 * 
 * Endpoint: GET /vehicles/paginated
 */
export const getAllVehiclesPaginated = async (
  params: PaginationParams = { page: 0, size: 10 }
): Promise<PaginatedResponse<Vehicle>> => {
  try {
    const response: AxiosResponse<PaginatedResponse<Vehicle>> = await api.get(
      '/vehicles/paginated',
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération paginée des véhicules:', error);
    throw error;
  }
};

/**
 * Récupérer un véhicule par son ID
 * 
 * @param vehicleId - ID du véhicule
 * @returns Promise avec le véhicule
 * 
 * Endpoint: GET /vehicles/:id
 * Exemple d'utilisation:
 * const vehicle = await vehicleService.getVehicleById(1);
 */
export const getVehicleById = async (vehicleId: number): Promise<Vehicle> => {
  try {
    const response: AxiosResponse<Vehicle> = await api.get(
      `/vehicles/${vehicleId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du véhicule ${vehicleId}:`, error);
    throw error;
  }
};

/**
 * Récupérer un véhicule avec tous ses détails (conducteurs, statistiques, etc.)
 * 
 * @param vehicleId - ID du véhicule
 * @returns Promise avec les détails complets du véhicule
 * 
 * Endpoint: GET /vehicles/:id/details
 * Exemple d'utilisation:
 * const vehicleDetails = await vehicleService.getVehicleDetails(1);
 */
export const getVehicleDetails = async (
  vehicleId: number
): Promise<VehicleDetails> => {
  try {
    const response: AxiosResponse<VehicleDetails> = await api.get(
      `/vehicles/${vehicleId}/details`
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails du véhicule ${vehicleId}:`, error);
    throw error;
  }
};

/**
 * Récupérer un véhicule par son numéro d'immatriculation
 * 
 * @param registrationNumber - Numéro d'immatriculation (plaque)
 * @returns Promise avec le véhicule
 * 
 * Endpoint: GET /vehicles/registration/:number
 * Exemple d'utilisation:
 * const vehicle = await vehicleService.getVehicleByRegistration('CM-123-AB');
 */
export const getVehicleByRegistration = async (
  registrationNumber: string
): Promise<Vehicle> => {
  try {
    const encodedNumber = encodeURIComponent(registrationNumber);
    const response: AxiosResponse<Vehicle> = await api.get(
      `/vehicles/registration/${encodedNumber}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du véhicule ${registrationNumber}:`,
      error
    );
    throw error;
  }
};

/**
 * Créer un nouveau véhicule
 * 
 * @param vehicleData - Données du nouveau véhicule
 * @returns Promise avec le véhicule créé
 * 
 * Endpoint: POST /vehicles
 * Exemple d'utilisation:
 * const newVehicle = await vehicleService.createVehicle({
 *   vehicleMake: "Toyota",
 *   vehicleName: "Corolla",
 *   vehicleRegistrationNumber: "CM-123-AB",
 *   vehicleType: "Berline",
 *   vehicleNumberPassengers: 5,
 *   userId: 1
 * });
 */
export const createVehicle = async (
  vehicleData: CreateVehicleDto
): Promise<Vehicle> => {
  try {
    const response: AxiosResponse<Vehicle> = await api.post(
      '/vehicles',
      vehicleData
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du véhicule:', error);
    throw error;
  }
};

/**
 * Mettre à jour un véhicule existant
 * 
 * @param vehicleId - ID du véhicule à modifier
 * @param vehicleData - Données à mettre à jour
 * @returns Promise avec le véhicule mis à jour
 * 
 * Endpoint: PUT /vehicles/:id
 * Exemple d'utilisation:
 * const updated = await vehicleService.updateVehicle(1, {
 *   vehicleFuelLevel: 75.5
 * });
 */
export const updateVehicle = async (
  vehicleId: number,
  vehicleData: UpdateVehicleDto
): Promise<Vehicle> => {
  try {
    const response: AxiosResponse<Vehicle> = await api.put(
      `/vehicles/${vehicleId}`,
      vehicleData
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du véhicule ${vehicleId}:`, error);
    throw error;
  }
};

/**
 * Mettre à jour partiellement un véhicule (PATCH)
 * 
 * @param vehicleId - ID du véhicule
 * @param vehicleData - Champs à mettre à jour
 * @returns Promise avec le véhicule mis à jour
 * 
 * Endpoint: PATCH /vehicles/:id
 */
export const patchVehicle = async (
  vehicleId: number,
  vehicleData: UpdateVehicleDto
): Promise<Vehicle> => {
  try {
    const response: AxiosResponse<Vehicle> = await api.patch(
      `/vehicles/${vehicleId}`,
      vehicleData
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour partielle du véhicule ${vehicleId}:`, error);
    throw error;
  }
};

/**
 * Supprimer un véhicule
 * 
 * @param vehicleId - ID du véhicule à supprimer
 * @returns Promise<void>
 * 
 * Endpoint: DELETE /vehicles/:id
 * Exemple d'utilisation:
 * await vehicleService.deleteVehicle(1);
 */
export const deleteVehicle = async (vehicleId: number): Promise<void> => {
  try {
    await api.delete(`/vehicles/${vehicleId}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression du véhicule ${vehicleId}:`, error);
    throw error;
  }
};

// ============================================================================
// 2. GESTION DES CONDUCTEURS ASSIGNÉS
// ============================================================================

/**
 * Récupérer tous les conducteurs assignés à un véhicule
 * 
 * @param vehicleId - ID du véhicule
 * @returns Promise avec la liste des conducteurs
 * 
 * Endpoint: GET /driver-vehicle/vehicle/:vehicleId
 * Exemple d'utilisation:
 * const drivers = await vehicleService.getVehicleDrivers(1);
 */
export const getVehicleDrivers = async (vehicleId: number): Promise<any[]> => {
  try {
    const response: AxiosResponse<any[]> = await api.get(
      `/driver-vehicle/vehicle/${vehicleId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des conducteurs du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

/**
 * Assigner un conducteur à un véhicule
 * 
 * @param vehicleId - ID du véhicule
 * @param driverId - ID du conducteur
 * @returns Promise<void>
 * 
 * Endpoint: POST /vehicles/:id/drivers/:driverId
 * Exemple d'utilisation:
 * await vehicleService.assignDriver(1, 5);
 */
export const assignDriver = async (
  vehicleId: number,
  driverId: number
): Promise<void> => {
  try {
    await api.post(`/vehicles/${vehicleId}/drivers/${driverId}`);
  } catch (error) {
    console.error(
      `Erreur lors de l'assignation du conducteur ${driverId} au véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

/**
 * Retirer un conducteur d'un véhicule
 * 
 * @param vehicleId - ID du véhicule
 * @param driverId - ID du conducteur
 * @returns Promise<void>
 * 
 * Endpoint: DELETE /vehicles/:id/drivers/:driverId
 * Exemple d'utilisation:
 * await vehicleService.removeDriver(1, 5);
 */
export const removeDriver = async (
  vehicleId: number,
  driverId: number
): Promise<void> => {
  try {
    await api.delete(`/vehicles/${vehicleId}/drivers/${driverId}`);
  } catch (error) {
    console.error(
      `Erreur lors du retrait du conducteur ${driverId} du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

// ============================================================================
// 3. RECHERCHE ET FILTRAGE
// ============================================================================

/**
 * Rechercher des véhicules avec filtres
 * 
 * @param filters - Critères de recherche
 * @returns Promise avec la liste des véhicules correspondants
 * 
 * Endpoint: GET /vehicles/search
 * Exemple d'utilisation:
 * const vehicles = await vehicleService.searchVehicles({
 *   vehicleType: "Berline",
 *   minFuelLevel: 50
 * });
 */
export const searchVehicles = async (
  filters: VehicleFilters
): Promise<Vehicle[]> => {
  try {
    const response: AxiosResponse<Vehicle[]> = await api.get(
      '/vehicles/search',
      { params: filters }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche de véhicules:', error);
    throw error;
  }
};

/**
 * Récupérer tous les véhicules d'un utilisateur
 * 
 * @param userId - ID de l'utilisateur
 * @returns Promise avec la liste des véhicules
 * 
 * Endpoint: GET /vehicles/user/:userId
 * Exemple d'utilisation:
 * const myVehicles = await vehicleService.getVehiclesByUser(1);
 */
export const getVehiclesByUser = async (userId: number): Promise<Vehicle[]> => {
  try {
    const response: AxiosResponse<Vehicle[]> = await api.get(
      `/vehicles/user/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des véhicules de l'utilisateur ${userId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer les véhicules par type
 * 
 * @param vehicleType - Type de véhicule (Berline, SUV, etc.)
 * @returns Promise avec la liste des véhicules
 * 
 * Endpoint: GET /vehicles/type/:type
 * Exemple d'utilisation:
 * const suvs = await vehicleService.getVehiclesByType('SUV');
 */
export const getVehiclesByType = async (
  vehicleType: string
): Promise<Vehicle[]> => {
  try {
    const encodedType = encodeURIComponent(vehicleType);
    const response: AxiosResponse<Vehicle[]> = await api.get(
      `/vehicles/type/${encodedType}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des véhicules de type ${vehicleType}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer les véhicules par marque
 * 
 * @param make - Marque du véhicule (Toyota, Mercedes, etc.)
 * @returns Promise avec la liste des véhicules
 * 
 * Endpoint: GET /vehicles/make/:make
 * Exemple d'utilisation:
 * const toyotas = await vehicleService.getVehiclesByMake('Toyota');
 */
export const getVehiclesByMake = async (make: string): Promise<Vehicle[]> => {
  try {
    const encodedMake = encodeURIComponent(make);
    const response: AxiosResponse<Vehicle[]> = await api.get(
      `/vehicles/make/${encodedMake}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des véhicules de marque ${make}:`,
      error
    );
    throw error;
  }
};

// ============================================================================
// 4. STATISTIQUES ET INFORMATIONS EN TEMPS RÉEL
// ============================================================================

/**
 * Compter le nombre total de véhicules
 *
 * @returns Promise avec le nombre de véhicules
 *
 * Endpoint: GET /vehicles/count
 * Exemple d'utilisation:
 * const count = await vehicleService.countVehicles();
 */
export const countVehicles = async (): Promise<number> => {
  try {
    const response: AxiosResponse<{ count: number }> = await api.get(
      '/vehicles/count'
    );
    return response.data.count;
  } catch (error) {
    console.error('Erreur lors du comptage des véhicules:', error);
    throw error;
  }
};

/**
 * Compter le nombre de véhicules d'un utilisateur
 *
 * @param vehicles - Liste des véhicules de l'utilisateur
 * @returns Nombre de véhicules
 *
 * Exemple d'utilisation:
 * const vehicles = await vehicleService.getVehiclesByUser(1);
 * const count = vehicleService.countUserVehicles(vehicles);
 */
export const countUserVehicles = (vehicles: Vehicle[]): number => {
  return vehicles.length;
};

/**
 * Récupérer les véhicules avec un niveau de carburant faible
 * 
 * @param threshold - Seuil en pourcentage (par défaut 20%)
 * @returns Promise avec la liste des véhicules
 * 
 * Endpoint: GET /vehicles/low-fuel?threshold=20
 * Exemple d'utilisation:
 * const lowFuelVehicles = await vehicleService.getLowFuelVehicles(25);
 */
export const getLowFuelVehicles = async (
  threshold: number = 20
): Promise<Vehicle[]> => {
  try {
    const response: AxiosResponse<Vehicle[]> = await api.get(
      '/vehicles/low-fuel',
      { params: { threshold } }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des véhicules à carburant faible:', error);
    throw error;
  }
};

/**
 * Récupérer les véhicules actuellement en mouvement
 * 
 * @returns Promise avec la liste des véhicules en mouvement
 * 
 * Endpoint: GET /vehicles/moving
 * Exemple d'utilisation:
 * const movingVehicles = await vehicleService.getMovingVehicles();
 */
export const getMovingVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response: AxiosResponse<Vehicle[]> = await api.get('/vehicles/moving');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des véhicules en mouvement:', error);
    throw error;
  }
};

/**
 * Mettre à jour la vitesse d'un véhicule
 * Généralement appelé par le dispositif IoT
 * 
 * @param vehicleId - ID du véhicule
 * @param speed - Vitesse actuelle (km/h)
 * @returns Promise<void>
 * 
 * Endpoint: PATCH /vehicles/:id/speed
 * Exemple d'utilisation:
 * await vehicleService.updateVehicleSpeed(1, 85.5);
 */
export const updateVehicleSpeed = async (
  vehicleId: number,
  speed: number
): Promise<void> => {
  try {
    await api.patch(`/vehicles/${vehicleId}/speed`, { speed });
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de la vitesse du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

/**
 * Mettre à jour le niveau de carburant d'un véhicule
 * Généralement appelé par le dispositif IoT
 * 
 * @param vehicleId - ID du véhicule
 * @param fuelLevel - Niveau de carburant (0-100%)
 * @returns Promise<void>
 * 
 * Endpoint: PATCH /vehicles/:id/fuel
 * Exemple d'utilisation:
 * await vehicleService.updateVehicleFuel(1, 45.8);
 */
export const updateVehicleFuel = async (
  vehicleId: number,
  fuelLevel: number
): Promise<void> => {
  try {
    await api.patch(`/vehicles/${vehicleId}/fuel`, { fuelLevel });
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour du carburant du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

// ============================================================================
// 5. GESTION DES DOCUMENTS ET IMAGES
// ============================================================================

/**
 * Télécharger une image pour un véhicule
 * 
 * @param vehicleId - ID du véhicule
 * @param imageFile - Fichier image
 * @returns Promise avec l'URL de l'image uploadée
 * 
 * Endpoint: POST /vehicles/:id/image
 * Exemple d'utilisation:
 * const imageUrl = await vehicleService.uploadVehicleImage(1, fileInput.files[0]);
 */
export const uploadVehicleImage = async (
  vehicleId: number,
  imageFile: File
): Promise<string> => {
  try {
    // Créer un FormData pour envoyer le fichier
    const formData = new FormData();
    formData.append('image', imageFile);

    const response: AxiosResponse<{ imageUrl: string }> = await api.post(
      `/vehicles/${vehicleId}/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.imageUrl;
  } catch (error) {
    console.error(
      `Erreur lors de l'upload de l'image du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

/**
 * Télécharger un document pour un véhicule
 * 
 * @param vehicleId - ID du véhicule
 * @param documentFile - Fichier document (carte grise, assurance, etc.)
 * @returns Promise avec l'URL du document uploadé
 * 
 * Endpoint: POST /vehicles/:id/document
 * Exemple d'utilisation:
 * const docUrl = await vehicleService.uploadVehicleDocument(1, fileInput.files[0]);
 */
export const uploadVehicleDocument = async (
  vehicleId: number,
  documentFile: File
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('document', documentFile);

    const response: AxiosResponse<{ documentUrl: string }> = await api.post(
      `/vehicles/${vehicleId}/document`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.documentUrl;
  } catch (error) {
    console.error(
      `Erreur lors de l'upload du document du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

// ============================================================================
// 6. EXPORT D'UN OBJET SERVICE COMPLET
// ============================================================================

const vehicleService = {
  // CRUD
  getAllVehicles,
  getAllVehiclesPaginated,
  getVehicleById,
  getVehicleDetails,
  getVehicleByRegistration,
  createVehicle,
  updateVehicle,
  patchVehicle,
  deleteVehicle,

  // Gestion des conducteurs
  getVehicleDrivers,
  assignDriver,
  removeDriver,

  // Recherche et filtrage
  searchVehicles,
  getVehiclesByUser,
  getVehiclesByType,
  getVehiclesByMake,

  // Statistiques et temps réel
  countVehicles,
  countUserVehicles,
  getLowFuelVehicles,
  getMovingVehicles,
  updateVehicleSpeed,
  updateVehicleFuel,

  // Documents
  uploadVehicleImage,
  uploadVehicleDocument,
};

export default vehicleService;