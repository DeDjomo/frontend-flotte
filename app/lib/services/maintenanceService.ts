// ============================================================================
// FICHIER: lib/services/maintenanceService.ts
// DESCRIPTION: Service pour gérer toutes les opérations liées aux maintenances
// ============================================================================

/**
 * Ce service encapsule toutes les requêtes HTTP liées aux maintenances.
 * Gère l'historique, la planification et les statistiques de maintenance.
 */

import api from '../api';
import {
  Maintenance,
  CreateMaintenanceDto,
  UpdateMaintenanceDto,
  MaintenanceWithVehicle,
  MaintenanceStats,
  MaintenanceFilters,
  MaintenanceReport,
  ScheduledMaintenance,
  PaginatedResponse,
  PaginationParams,
} from '../../types';
import { AxiosResponse } from 'axios';

// ============================================================================
// 1. FONCTIONS CRUD DE BASE
// ============================================================================

/**
 * Récupérer toutes les maintenances
 * 
 * @param params - Paramètres de pagination
 * @returns Promise avec la liste des maintenances
 * 
 * Endpoint: GET /maintenances
 * Exemple d'utilisation:
 * const maintenances = await maintenanceService.getAllMaintenances();
 */
export const getAllMaintenances = async (
  params?: PaginationParams
): Promise<Maintenance[]> => {
  try {
    const response: AxiosResponse<Maintenance[]> = await api.get(
      '/maintenances',
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des maintenances:', error);
    throw error;
  }
};

/**
 * Récupérer toutes les maintenances avec pagination
 * 
 * @param params - Paramètres de pagination
 * @returns Promise avec la réponse paginée
 * 
 * Endpoint: GET /maintenances/paginated
 */
export const getAllMaintenancesPaginated = async (
  params: PaginationParams = { page: 0, size: 10 }
): Promise<PaginatedResponse<Maintenance>> => {
  try {
    const response: AxiosResponse<PaginatedResponse<Maintenance>> =
      await api.get('/maintenances/paginated', { params });
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération paginée des maintenances:',
      error
    );
    throw error;
  }
};

/**
 * Récupérer une maintenance par son ID
 * 
 * @param maintenanceId - ID de la maintenance
 * @returns Promise avec la maintenance
 * 
 * Endpoint: GET /maintenances/:id
 * Exemple d'utilisation:
 * const maintenance = await maintenanceService.getMaintenanceById(1);
 */
export const getMaintenanceById = async (
  maintenanceId: number
): Promise<Maintenance> => {
  try {
    const response: AxiosResponse<Maintenance> = await api.get(
      `/maintenances/${maintenanceId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de la maintenance ${maintenanceId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer une maintenance avec les détails du véhicule
 * 
 * @param maintenanceId - ID de la maintenance
 * @returns Promise avec la maintenance et détails du véhicule
 * 
 * Endpoint: GET /maintenances/:id/with-vehicle
 */
export const getMaintenanceWithVehicle = async (
  maintenanceId: number
): Promise<MaintenanceWithVehicle> => {
  try {
    const response: AxiosResponse<MaintenanceWithVehicle> = await api.get(
      `/maintenances/${maintenanceId}/with-vehicle`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de la maintenance ${maintenanceId} avec véhicule:`,
      error
    );
    throw error;
  }
};

/**
 * Créer une nouvelle maintenance
 * 
 * @param maintenanceData - Données de la maintenance
 * @returns Promise avec la maintenance créée
 * 
 * Endpoint: POST /maintenances
 * Exemple d'utilisation:
 * const newMaintenance = await maintenanceService.createMaintenance({
 *   maintenanceSubject: "Vidange",
 *   maintenanceCost: 25000,
 *   vehicleId: 1,
 *   maintenancePoint: { type: "Point", coordinates: [3.8480, 11.5021] }
 * });
 */
export const createMaintenance = async (
  maintenanceData: CreateMaintenanceDto
): Promise<Maintenance> => {
  try {
    const response: AxiosResponse<Maintenance> = await api.post(
      '/maintenances',
      maintenanceData
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la maintenance:', error);
    throw error;
  }
};

/**
 * Mettre à jour une maintenance existante
 * 
 * @param maintenanceId - ID de la maintenance
 * @param maintenanceData - Données à mettre à jour
 * @returns Promise avec la maintenance mise à jour
 * 
 * Endpoint: PUT /maintenances/:id
 */
export const updateMaintenance = async (
  maintenanceId: number,
  maintenanceData: UpdateMaintenanceDto
): Promise<Maintenance> => {
  try {
    const response: AxiosResponse<Maintenance> = await api.put(
      `/maintenances/${maintenanceId}`,
      maintenanceData
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de la maintenance ${maintenanceId}:`,
      error
    );
    throw error;
  }
};

/**
 * Supprimer une maintenance
 * 
 * @param maintenanceId - ID de la maintenance à supprimer
 * @returns Promise<void>
 * 
 * Endpoint: DELETE /maintenances/:id
 */
export const deleteMaintenance = async (
  maintenanceId: number
): Promise<void> => {
  try {
    await api.delete(`/maintenances/${maintenanceId}`);
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de la maintenance ${maintenanceId}:`,
      error
    );
    throw error;
  }
};

// ============================================================================
// 2. RECHERCHE ET FILTRAGE
// ============================================================================

/**
 * Rechercher des maintenances avec filtres
 * 
 * @param filters - Critères de recherche
 * @returns Promise avec la liste des maintenances correspondantes
 * 
 * Endpoint: GET /maintenances/search
 * Exemple d'utilisation:
 * const maintenances = await maintenanceService.searchMaintenances({
 *   vehicleId: 1,
 *   startDate: "2024-01-01",
 *   endDate: "2024-01-31",
 *   minCost: 10000
 * });
 */
export const searchMaintenances = async (
  filters: MaintenanceFilters
): Promise<Maintenance[]> => {
  try {
    const response: AxiosResponse<Maintenance[]> = await api.get(
      '/maintenances/search',
      { params: filters }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche de maintenances:', error);
    throw error;
  }
};

/**
 * Récupérer toutes les maintenances d'un véhicule
 * 
 * @param vehicleId - ID du véhicule
 * @param params - Paramètres de pagination
 * @returns Promise avec la liste des maintenances
 * 
 * Endpoint: GET /maintenances/vehicle/:vehicleId
 * Exemple d'utilisation:
 * const vehicleMaintenances = await maintenanceService.getMaintenancesByVehicle(1);
 */
export const getMaintenancesByVehicle = async (
  vehicleId: number,
  params?: PaginationParams
): Promise<Maintenance[]> => {
  try {
    const response: AxiosResponse<Maintenance[]> = await api.get(
      `/maintenances/vehicle/${vehicleId}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des maintenances du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer les maintenances par type
 * 
 * @param maintenanceType - Type de maintenance (Vidange, Freins, etc.)
 * @returns Promise avec la liste des maintenances
 * 
 * Endpoint: GET /maintenances/type/:type
 * Exemple d'utilisation:
 * const vidanges = await maintenanceService.getMaintenancesByType('Vidange');
 */
export const getMaintenancesByType = async (
  maintenanceType: string
): Promise<Maintenance[]> => {
  try {
    const encodedType = encodeURIComponent(maintenanceType);
    const response: AxiosResponse<Maintenance[]> = await api.get(
      `/maintenances/type/${encodedType}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des maintenances de type ${maintenanceType}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer les maintenances d'une période
 * 
 * @param startDate - Date de début
 * @param endDate - Date de fin
 * @returns Promise avec la liste des maintenances
 * 
 * Endpoint: GET /maintenances/period
 */
export const getMaintenancesByPeriod = async (
  startDate: string,
  endDate: string
): Promise<Maintenance[]> => {
  try {
    const response: AxiosResponse<Maintenance[]> = await api.get(
      '/maintenances/period',
      {
        params: { startDate, endDate },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des maintenances par période:',
      error
    );
    throw error;
  }
};

/**
 * Récupérer les maintenances récentes
 * 
 * @param limit - Nombre de maintenances à récupérer
 * @returns Promise avec les dernières maintenances
 * 
 * Endpoint: GET /maintenances/recent
 */
export const getRecentMaintenances = async (
  limit: number = 10
): Promise<Maintenance[]> => {
  try {
    const response: AxiosResponse<Maintenance[]> = await api.get(
      '/maintenances/recent',
      { params: { limit } }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des maintenances récentes:',
      error
    );
    throw error;
  }
};

// ============================================================================
// 3. STATISTIQUES ET RAPPORTS
// ============================================================================

/**
 * Récupérer les statistiques globales de maintenance
 * 
 * @returns Promise avec les statistiques
 * 
 * Endpoint: GET /maintenances/statistics
 * Exemple d'utilisation:
 * const stats = await maintenanceService.getMaintenanceStatistics();
 * // Retourne: { totalMaintenances, totalCost, averageCost, etc. }
 */
export const getMaintenanceStatistics = async (): Promise<MaintenanceStats> => {
  try {
    const response: AxiosResponse<MaintenanceStats> = await api.get(
      '/maintenances/statistics'
    );
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des statistiques de maintenance:',
      error
    );
    throw error;
  }
};

/**
 * Récupérer les statistiques de maintenance d'un véhicule
 * 
 * @param vehicleId - ID du véhicule
 * @returns Promise avec les statistiques
 * 
 * Endpoint: GET /maintenances/vehicle/:vehicleId/statistics
 */
export const getVehicleMaintenanceStatistics = async (
  vehicleId: number
): Promise<MaintenanceStats> => {
  try {
    const response: AxiosResponse<MaintenanceStats> = await api.get(
      `/maintenances/vehicle/${vehicleId}/statistics`
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
 * Générer un rapport de maintenance
 * 
 * @param vehicleId - ID du véhicule
 * @param startDate - Date de début
 * @param endDate - Date de fin
 * @returns Promise avec le rapport complet
 * 
 * Endpoint: GET /maintenances/vehicle/:vehicleId/report
 * Exemple d'utilisation:
 * const report = await maintenanceService.generateMaintenanceReport(
 *   1,
 *   "2024-01-01T00:00:00Z",
 *   "2024-12-31T23:59:59Z"
 * );
 */
export const generateMaintenanceReport = async (
  vehicleId: number,
  startDate: string,
  endDate: string
): Promise<MaintenanceReport> => {
  try {
    const response: AxiosResponse<MaintenanceReport> = await api.get(
      `/maintenances/vehicle/${vehicleId}/report`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la génération du rapport de maintenance pour le véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

/**
 * Calculer le coût total des maintenances
 * 
 * @param vehicleId - ID du véhicule (optionnel)
 * @param startDate - Date de début (optionnel)
 * @param endDate - Date de fin (optionnel)
 * @returns Promise avec le coût total
 * 
 * Endpoint: GET /maintenances/total-cost
 */
export const calculateTotalMaintenanceCost = async (
  vehicleId?: number,
  startDate?: string,
  endDate?: string
): Promise<number> => {
  try {
    const response: AxiosResponse<{ totalCost: number }> = await api.get(
      '/maintenances/total-cost',
      {
        params: { vehicleId, startDate, endDate },
      }
    );
    return response.data.totalCost;
  } catch (error) {
    console.error(
      'Erreur lors du calcul du coût total de maintenance:',
      error
    );
    throw error;
  }
};

/**
 * Compter le nombre total de maintenances
 * 
 * @returns Promise avec le nombre de maintenances
 * 
 * Endpoint: GET /maintenances/count
 */
export const countMaintenances = async (): Promise<number> => {
  try {
    const response: AxiosResponse<{ count: number }> = await api.get(
      '/maintenances/count'
    );
    return response.data.count;
  } catch (error) {
    console.error('Erreur lors du comptage des maintenances:', error);
    throw error;
  }
};

// ============================================================================
// 4. MAINTENANCE PLANIFIÉE (SCHEDULED MAINTENANCE)
// ============================================================================

/**
 * Récupérer toutes les maintenances planifiées
 * 
 * @returns Promise avec la liste des maintenances planifiées
 * 
 * Endpoint: GET /maintenances/scheduled
 * Exemple d'utilisation:
 * const scheduled = await maintenanceService.getScheduledMaintenances();
 */
export const getScheduledMaintenances = async (): Promise<
  ScheduledMaintenance[]
> => {
  try {
    const response: AxiosResponse<ScheduledMaintenance[]> = await api.get(
      '/maintenances/scheduled'
    );
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des maintenances planifiées:',
      error
    );
    throw error;
  }
};

/**
 * Récupérer les maintenances planifiées d'un véhicule
 * 
 * @param vehicleId - ID du véhicule
 * @returns Promise avec la liste des maintenances planifiées
 * 
 * Endpoint: GET /maintenances/vehicle/:vehicleId/scheduled
 */
export const getVehicleScheduledMaintenances = async (
  vehicleId: number
): Promise<ScheduledMaintenance[]> => {
  try {
    const response: AxiosResponse<ScheduledMaintenance[]> = await api.get(
      `/maintenances/vehicle/${vehicleId}/scheduled`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des maintenances planifiées du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

/**
 * Créer une maintenance planifiée
 * 
 * @param scheduledData - Données de la maintenance planifiée
 * @returns Promise avec la maintenance planifiée créée
 * 
 * Endpoint: POST /maintenances/scheduled
 * Exemple d'utilisation:
 * const scheduled = await maintenanceService.createScheduledMaintenance({
 *   scheduledDate: "2024-02-15T10:00:00Z",
 *   maintenanceSubject: "Révision 10000 km",
 *   vehicleId: 1,
 *   estimatedCost: 50000,
 *   status: "pending"
 * });
 */
export const createScheduledMaintenance = async (
  scheduledData: Omit<ScheduledMaintenance, 'scheduledMaintenanceId'>
): Promise<ScheduledMaintenance> => {
  try {
    const response: AxiosResponse<ScheduledMaintenance> = await api.post(
      '/maintenances/scheduled',
      scheduledData
    );
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la création de la maintenance planifiée:',
      error
    );
    throw error;
  }
};

/**
 * Marquer une maintenance planifiée comme terminée
 * 
 * @param scheduledMaintenanceId - ID de la maintenance planifiée
 * @param actualMaintenanceData - Données de la maintenance réelle effectuée
 * @returns Promise avec la maintenance créée
 * 
 * Endpoint: POST /maintenances/scheduled/:id/complete
 */
export const completeScheduledMaintenance = async (
  scheduledMaintenanceId: number,
  actualMaintenanceData: CreateMaintenanceDto
): Promise<Maintenance> => {
  try {
    const response: AxiosResponse<Maintenance> = await api.post(
      `/maintenances/scheduled/${scheduledMaintenanceId}/complete`,
      actualMaintenanceData
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la completion de la maintenance planifiée ${scheduledMaintenanceId}:`,
      error
    );
    throw error;
  }
};

/**
 * Annuler une maintenance planifiée
 * 
 * @param scheduledMaintenanceId - ID de la maintenance planifiée
 * @returns Promise<void>
 * 
 * Endpoint: DELETE /maintenances/scheduled/:id
 */
export const cancelScheduledMaintenance = async (
  scheduledMaintenanceId: number
): Promise<void> => {
  try {
    await api.delete(`/maintenances/scheduled/${scheduledMaintenanceId}`);
  } catch (error) {
    console.error(
      `Erreur lors de l'annulation de la maintenance planifiée ${scheduledMaintenanceId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer les maintenances à venir (prochains jours)
 * 
 * @param days - Nombre de jours à regarder en avant
 * @returns Promise avec la liste des maintenances à venir
 * 
 * Endpoint: GET /maintenances/upcoming
 * Exemple d'utilisation:
 * const upcoming = await maintenanceService.getUpcomingMaintenances(7);
 */
export const getUpcomingMaintenances = async (
  days: number = 7
): Promise<ScheduledMaintenance[]> => {
  try {
    const response: AxiosResponse<ScheduledMaintenance[]> = await api.get(
      '/maintenances/upcoming',
      { params: { days } }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des maintenances à venir:',
      error
    );
    throw error;
  }
};

// ============================================================================
// 5. EXPORT D'UN OBJET SERVICE COMPLET
// ============================================================================

const maintenanceService = {
  // CRUD
  getAllMaintenances,
  getAllMaintenancesPaginated,
  getMaintenanceById,
  getMaintenanceWithVehicle,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,

  // Recherche et filtrage
  searchMaintenances,
  getMaintenancesByVehicle,
  getMaintenancesByType,
  getMaintenancesByPeriod,
  getRecentMaintenances,

  // Statistiques et rapports
  getMaintenanceStatistics,
  getVehicleMaintenanceStatistics,
  generateMaintenanceReport,
  calculateTotalMaintenanceCost,
  countMaintenances,

  // Maintenance planifiée
  getScheduledMaintenances,
  getVehicleScheduledMaintenances,
  createScheduledMaintenance,
  completeScheduledMaintenance,
  cancelScheduledMaintenance,
  getUpcomingMaintenances,
};

export default maintenanceService;