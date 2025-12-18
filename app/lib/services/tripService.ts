// ============================================================================
// FICHIER: lib/services/tripService.ts
// DESCRIPTION: Service pour gérer toutes les opérations API liées aux trajets
// ============================================================================

/**
 * Ce service encapsule toutes les requêtes HTTP liées aux trajets.
 * Gère le démarrage, l'arrêt, et le suivi des trajets des véhicules.
 */

import api from '../api';
import {
  Trip,
  CreateTripDto,
  UpdateTripDto,
  StartTripDto,
  EndTripDto,
  TripWithDetails,
  TripStats,
  TripFilters,
  TripReport,
  PaginatedResponse,
  PaginationParams,
} from '../../types';
import { AxiosResponse } from 'axios';

// ============================================================================
// 1. FONCTIONS CRUD DE BASE
// ============================================================================

/**
 * Récupérer tous les trajets
 * 
 * @param params - Paramètres de pagination (optionnels)
 * @returns Promise avec la liste des trajets
 * 
 * Endpoint: GET /trips
 * Exemple d'utilisation:
 * const trips = await tripService.getAllTrips();
 * const paginatedTrips = await tripService.getAllTrips({ page: 0, size: 20 });
 */
export const getAllTrips = async (
  params?: PaginationParams
): Promise<Trip[]> => {
  try {
    const response: AxiosResponse<Trip[]> = await api.get('/trips', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des trajets:', error);
    throw error;
  }
};

/**
 * Récupérer tous les trajets avec pagination
 * 
 * @param params - Paramètres de pagination
 * @returns Promise avec la réponse paginée
 * 
 * Endpoint: GET /trips/paginated
 */
export const getAllTripsPaginated = async (
  params: PaginationParams = { page: 0, size: 10 }
): Promise<PaginatedResponse<Trip>> => {
  try {
    const response: AxiosResponse<PaginatedResponse<Trip>> = await api.get(
      '/trips/paginated',
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération paginée des trajets:', error);
    throw error;
  }
};

/**
 * Récupérer un trajet par son ID
 * 
 * @param tripId - ID du trajet
 * @returns Promise avec le trajet
 * 
 * Endpoint: GET /trips/:id
 * Exemple d'utilisation:
 * const trip = await tripService.getTripById(1);
 */
export const getTripById = async (tripId: number): Promise<Trip> => {
  try {
    const response: AxiosResponse<Trip> = await api.get(`/trips/${tripId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du trajet ${tripId}:`, error);
    throw error;
  }
};

/**
 * Récupérer un trajet avec tous ses détails
 * 
 * @param tripId - ID du trajet
 * @returns Promise avec le trajet et ses détails complets
 * 
 * Endpoint: GET /trips/:id/details
 * Exemple d'utilisation:
 * const tripDetails = await tripService.getTripDetails(1);
 */
export const getTripDetails = async (
  tripId: number
): Promise<TripWithDetails> => {
  try {
    const response: AxiosResponse<TripWithDetails> = await api.get(
      `/trips/${tripId}/details`
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails du trajet ${tripId}:`, error);
    throw error;
  }
};

/**
 * Créer un nouveau trajet complet
 * 
 * @param tripData - Données du nouveau trajet
 * @returns Promise avec le trajet créé
 * 
 * Endpoint: POST /trips
 * Exemple d'utilisation:
 * const newTrip = await tripService.createTrip({
 *   departurePoint: { type: "Point", coordinates: [3.8480, 11.5021] },
 *   arrivalPoint: { type: "Point", coordinates: [3.8680, 11.5321] },
 *   departureDateTime: "2024-01-15T08:00:00Z",
 *   driverId: 1,
 *   vehicleId: 1
 * });
 */
export const createTrip = async (tripData: CreateTripDto): Promise<Trip> => {
  try {
    const response: AxiosResponse<Trip> = await api.post('/trips', tripData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du trajet:', error);
    throw error;
  }
};

/**
 * Mettre à jour un trajet existant
 * 
 * @param tripId - ID du trajet à modifier
 * @param tripData - Données à mettre à jour
 * @returns Promise avec le trajet mis à jour
 * 
 * Endpoint: PUT /trips/:id
 */
export const updateTrip = async (
  tripId: number,
  tripData: UpdateTripDto
): Promise<Trip> => {
  try {
    const response: AxiosResponse<Trip> = await api.put(
      `/trips/${tripId}`,
      tripData
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du trajet ${tripId}:`, error);
    throw error;
  }
};

/**
 * Supprimer un trajet
 * 
 * @param tripId - ID du trajet à supprimer
 * @returns Promise<void>
 * 
 * Endpoint: DELETE /trips/:id
 */
export const deleteTrip = async (tripId: number): Promise<void> => {
  try {
    await api.delete(`/trips/${tripId}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression du trajet ${tripId}:`, error);
    throw error;
  }
};

// ============================================================================
// 2. DÉMARRAGE ET ARRÊT DE TRAJETS
// ============================================================================

/**
 * Démarrer un nouveau trajet
 * Crée un trajet en cours (sans arrivalDateTime)
 * 
 * @param tripData - Point de départ, conducteur et véhicule
 * @returns Promise avec le trajet démarré
 * 
 * Endpoint: POST /trips/start
 * Exemple d'utilisation:
 * const trip = await tripService.startTrip({
 *   departurePoint: { type: "Point", coordinates: [3.8480, 11.5021] },
 *   driverId: 1,
 *   vehicleId: 1
 * });
 */
export const startTrip = async (tripData: StartTripDto): Promise<Trip> => {
  try {
    const response: AxiosResponse<Trip> = await api.post(
      '/trips/start',
      tripData
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors du démarrage du trajet:', error);
    throw error;
  }
};

/**
 * Terminer un trajet en cours
 * Met à jour le trajet avec le point d'arrivée et l'heure d'arrivée
 * 
 * @param tripData - ID du trajet et point d'arrivée
 * @returns Promise avec le trajet terminé
 * 
 * Endpoint: POST /trips/end
 * Exemple d'utilisation:
 * const completedTrip = await tripService.endTrip({
 *   tripId: 1,
 *   arrivalPoint: { type: "Point", coordinates: [3.8680, 11.5321] },
 *   arrivalDateTime: "2024-01-15T10:30:00Z" // Optionnel
 * });
 */
export const endTrip = async (tripData: EndTripDto): Promise<Trip> => {
  try {
    const response: AxiosResponse<Trip> = await api.post(
      '/trips/end',
      tripData
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'arrêt du trajet:', error);
    throw error;
  }
};

/**
 * Annuler un trajet en cours
 * 
 * @param tripId - ID du trajet à annuler
 * @returns Promise<void>
 * 
 * Endpoint: POST /trips/:id/cancel
 */
export const cancelTrip = async (tripId: number): Promise<void> => {
  try {
    await api.post(`/trips/${tripId}/cancel`);
  } catch (error) {
    console.error(`Erreur lors de l'annulation du trajet ${tripId}:`, error);
    throw error;
  }
};

// ============================================================================
// 3. RECHERCHE ET FILTRAGE
// ============================================================================

/**
 * Rechercher des trajets avec filtres
 * 
 * @param filters - Critères de recherche
 * @returns Promise avec la liste des trajets correspondants
 * 
 * Endpoint: GET /trips/search
 * Exemple d'utilisation:
 * const trips = await tripService.searchTrips({
 *   driverId: 1,
 *   startDate: "2024-01-01",
 *   endDate: "2024-01-31"
 * });
 */
export const searchTrips = async (filters: TripFilters): Promise<Trip[]> => {
  try {
    const response: AxiosResponse<Trip[]> = await api.get('/trips/search', {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche de trajets:', error);
    throw error;
  }
};

/**
 * Récupérer tous les trajets d'un conducteur
 * 
 * @param driverId - ID du conducteur
 * @param params - Paramètres de pagination
 * @returns Promise avec la liste des trajets
 * 
 * Endpoint: GET /trips/driver/:driverId
 * Exemple d'utilisation:
 * const driverTrips = await tripService.getTripsByDriver(1);
 */
export const getTripsByDriver = async (
  driverId: number,
  params?: PaginationParams
): Promise<Trip[]> => {
  try {
    const response: AxiosResponse<Trip[]> = await api.get(
      `/trips/driver/${driverId}`,
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
 * Récupérer tous les trajets d'un véhicule
 * 
 * @param vehicleId - ID du véhicule
 * @param params - Paramètres de pagination
 * @returns Promise avec la liste des trajets
 * 
 * Endpoint: GET /trips/vehicle/:vehicleId
 * Exemple d'utilisation:
 * const vehicleTrips = await tripService.getTripsByVehicle(1);
 */
export const getTripsByVehicle = async (
  vehicleId: number,
  params?: PaginationParams
): Promise<Trip[]> => {
  try {
    const response: AxiosResponse<Trip[]> = await api.get(
      `/trips/vehicle/${vehicleId}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des trajets du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer les trajets en cours
 * 
 * @returns Promise avec la liste des trajets en cours
 * 
 * Endpoint: GET /trips/ongoing
 * Exemple d'utilisation:
 * const ongoingTrips = await tripService.getOngoingTrips();
 */
export const getOngoingTrips = async (): Promise<Trip[]> => {
  try {
    const response: AxiosResponse<Trip[]> = await api.get('/trips/ongoing');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des trajets en cours:', error);
    throw error;
  }
};

/**
 * Récupérer les trajets terminés
 * 
 * @param params - Paramètres de pagination
 * @returns Promise avec la liste des trajets terminés
 * 
 * Endpoint: GET /trips/completed
 */
export const getCompletedTrips = async (
  params?: PaginationParams
): Promise<Trip[]> => {
  try {
    const response: AxiosResponse<Trip[]> = await api.get('/trips/completed', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des trajets terminés:', error);
    throw error;
  }
};

/**
 * Récupérer les trajets d'une période donnée
 * 
 * @param startDate - Date de début (ISO string)
 * @param endDate - Date de fin (ISO string)
 * @returns Promise avec la liste des trajets
 * 
 * Endpoint: GET /trips/period
 * Exemple d'utilisation:
 * const trips = await tripService.getTripsByPeriod(
 *   "2024-01-01T00:00:00Z",
 *   "2024-01-31T23:59:59Z"
 * );
 */
export const getTripsByPeriod = async (
  startDate: string,
  endDate: string
): Promise<Trip[]> => {
  try {
    const response: AxiosResponse<Trip[]> = await api.get('/trips/period', {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des trajets par période:', error);
    throw error;
  }
};

// ============================================================================
// 4. STATISTIQUES ET RAPPORTS
// ============================================================================

/**
 * Récupérer les statistiques globales des trajets
 * 
 * @returns Promise avec les statistiques
 * 
 * Endpoint: GET /trips/statistics
 * Exemple d'utilisation:
 * const stats = await tripService.getTripStatistics();
 * // Retourne: { totalTrips, ongoingTrips, totalDistance, etc. }
 */
export const getTripStatistics = async (): Promise<TripStats> => {
  try {
    const response: AxiosResponse<TripStats> = await api.get(
      '/trips/statistics'
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques des trajets:', error);
    throw error;
  }
};

/**
 * Récupérer les statistiques des trajets d'un conducteur
 * 
 * @param driverId - ID du conducteur
 * @returns Promise avec les statistiques
 * 
 * Endpoint: GET /trips/driver/:driverId/statistics
 */
export const getDriverTripStatistics = async (
  driverId: number
): Promise<TripStats> => {
  try {
    const response: AxiosResponse<TripStats> = await api.get(
      `/trips/driver/${driverId}/statistics`
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
 * Récupérer les statistiques des trajets d'un véhicule
 * 
 * @param vehicleId - ID du véhicule
 * @returns Promise avec les statistiques
 * 
 * Endpoint: GET /trips/vehicle/:vehicleId/statistics
 */
export const getVehicleTripStatistics = async (
  vehicleId: number
): Promise<TripStats> => {
  try {
    const response: AxiosResponse<TripStats> = await api.get(
      `/trips/vehicle/${vehicleId}/statistics`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des statistiques du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

/**
 * Générer un rapport de trajets
 * 
 * @param startDate - Date de début
 * @param endDate - Date de fin
 * @param driverId - ID du conducteur (optionnel)
 * @param vehicleId - ID du véhicule (optionnel)
 * @returns Promise avec le rapport complet
 * 
 * Endpoint: GET /trips/report
 * Exemple d'utilisation:
 * const report = await tripService.generateTripReport(
 *   "2024-01-01T00:00:00Z",
 *   "2024-01-31T23:59:59Z",
 *   1 // driverId optionnel
 * );
 */
export const generateTripReport = async (
  startDate: string,
  endDate: string,
  driverId?: number,
  vehicleId?: number
): Promise<TripReport> => {
  try {
    const response: AxiosResponse<TripReport> = await api.get('/trips/report', {
      params: { startDate, endDate, driverId, vehicleId },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la génération du rapport de trajets:', error);
    throw error;
  }
};

/**
 * Compter le nombre total de trajets
 * 
 * @returns Promise avec le nombre de trajets
 * 
 * Endpoint: GET /trips/count
 */
export const countTrips = async (): Promise<number> => {
  try {
    const response: AxiosResponse<{ count: number }> = await api.get(
      '/trips/count'
    );
    return response.data.count;
  } catch (error) {
    console.error('Erreur lors du comptage des trajets:', error);
    throw error;
  }
};

/**
 * Calculer la distance d'un trajet
 * Utilise les coordonnées de départ et d'arrivée pour calculer la distance
 * 
 * @param tripId - ID du trajet
 * @returns Promise avec la distance en kilomètres
 * 
 * Endpoint: GET /trips/:id/distance
 * Exemple d'utilisation:
 * const distance = await tripService.calculateTripDistance(1);
 * console.log(`Distance: ${distance} km`);
 */
export const calculateTripDistance = async (tripId: number): Promise<number> => {
  try {
    const response: AxiosResponse<{ distance: number }> = await api.get(
      `/trips/${tripId}/distance`
    );
    return response.data.distance;
  } catch (error) {
    console.error(
      `Erreur lors du calcul de la distance du trajet ${tripId}:`,
      error
    );
    throw error;
  }
};

/**
 * Calculer la durée d'un trajet
 * 
 * @param tripId - ID du trajet
 * @returns Promise avec la durée en minutes
 * 
 * Endpoint: GET /trips/:id/duration
 */
export const calculateTripDuration = async (tripId: number): Promise<number> => {
  try {
    const response: AxiosResponse<{ duration: number }> = await api.get(
      `/trips/${tripId}/duration`
    );
    return response.data.duration;
  } catch (error) {
    console.error(
      `Erreur lors du calcul de la durée du trajet ${tripId}:`,
      error
    );
    throw error;
  }
};

// ============================================================================
// 5. EXPORT D'UN OBJET SERVICE COMPLET
// ============================================================================

const tripService = {
  // CRUD
  getAllTrips,
  getAllTripsPaginated,
  getTripById,
  getTripDetails,
  createTrip,
  updateTrip,
  deleteTrip,

  // Démarrage/Arrêt
  startTrip,
  endTrip,
  cancelTrip,

  // Recherche et filtrage
  searchTrips,
  getTripsByDriver,
  getTripsByVehicle,
  getOngoingTrips,
  getCompletedTrips,
  getTripsByPeriod,

  // Statistiques et rapports
  getTripStatistics,
  getDriverTripStatistics,
  getVehicleTripStatistics,
  generateTripReport,
  countTrips,
  calculateTripDistance,
  calculateTripDuration,
};

export default tripService;