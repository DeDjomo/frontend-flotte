// ============================================================================
// FICHIER: lib/services/fuelRechargeService.ts
// DESCRIPTION: Service pour gérer toutes les opérations liées aux recharges de carburant
// ============================================================================

/**
 * Ce service encapsule toutes les requêtes HTTP liées aux recharges de carburant.
 * Gère l'historique, les statistiques et l'analyse de consommation.
 */

import api from '../api';
import {
  FuelRecharge,
  CreateFuelRechargeDto,
  UpdateFuelRechargeDto,
  FuelRechargeWithVehicle,
  FuelRechargeStats,
  FuelRechargeFilters,
  FuelConsumptionReport,
  PaginatedResponse,
  PaginationParams,
} from '../../types';
import { AxiosResponse } from 'axios';

// ============================================================================
// 1. FONCTIONS CRUD DE BASE
// ============================================================================

/**
 * Récupérer toutes les recharges
 * 
 * @param params - Paramètres de pagination
 * @returns Promise avec la liste des recharges
 * 
 * Endpoint: GET /fuel-recharges
 * Exemple d'utilisation:
 * const recharges = await fuelRechargeService.getAllFuelRecharges();
 */
export const getAllFuelRecharges = async (
  params?: PaginationParams
): Promise<FuelRecharge[]> => {
  try {
    const response: AxiosResponse<FuelRecharge[]> = await api.get(
      '/fuel-recharges',
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des recharges:', error);
    throw error;
  }
};

/**
 * Récupérer toutes les recharges avec pagination
 * 
 * @param params - Paramètres de pagination
 * @returns Promise avec la réponse paginée
 * 
 * Endpoint: GET /fuel-recharges/paginated
 */
export const getAllFuelRechargesPaginated = async (
  params: PaginationParams = { page: 0, size: 10 }
): Promise<PaginatedResponse<FuelRecharge>> => {
  try {
    const response: AxiosResponse<PaginatedResponse<FuelRecharge>> =
      await api.get('/fuel-recharges/paginated', { params });
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération paginée des recharges:',
      error
    );
    throw error;
  }
};

/**
 * Récupérer une recharge par son ID
 * 
 * @param rechargeId - ID de la recharge
 * @returns Promise avec la recharge
 * 
 * Endpoint: GET /fuel-recharges/:id
 * Exemple d'utilisation:
 * const recharge = await fuelRechargeService.getFuelRechargeById(1);
 */
export const getFuelRechargeById = async (
  rechargeId: number
): Promise<FuelRecharge> => {
  try {
    const response: AxiosResponse<FuelRecharge> = await api.get(
      `/fuel-recharges/${rechargeId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de la recharge ${rechargeId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer une recharge avec les détails du véhicule
 * 
 * @param rechargeId - ID de la recharge
 * @returns Promise avec la recharge et détails du véhicule
 * 
 * Endpoint: GET /fuel-recharges/:id/with-vehicle
 */
export const getFuelRechargeWithVehicle = async (
  rechargeId: number
): Promise<FuelRechargeWithVehicle> => {
  try {
    const response: AxiosResponse<FuelRechargeWithVehicle> = await api.get(
      `/fuel-recharges/${rechargeId}/with-vehicle`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de la recharge ${rechargeId} avec véhicule:`,
      error
    );
    throw error;
  }
};

/**
 * Créer une nouvelle recharge
 * 
 * @param rechargeData - Données de la recharge
 * @returns Promise avec la recharge créée
 * 
 * Endpoint: POST /fuel-recharges
 * Exemple d'utilisation:
 * const newRecharge = await fuelRechargeService.createFuelRecharge({
 *   rechargeQuantity: 45.5,
 *   rechargePrice: 22750,
 *   vehicleId: 1,
 *   rechargePoint: { type: "Point", coordinates: [3.8480, 11.5021] }
 * });
 */
export const createFuelRecharge = async (
  rechargeData: CreateFuelRechargeDto
): Promise<FuelRecharge> => {
  try {
    const response: AxiosResponse<FuelRecharge> = await api.post(
      '/fuel-recharges',
      rechargeData
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la recharge:', error);
    throw error;
  }
};

/**
 * Mettre à jour une recharge existante
 * 
 * @param rechargeId - ID de la recharge
 * @param rechargeData - Données à mettre à jour
 * @returns Promise avec la recharge mise à jour
 * 
 * Endpoint: PUT /fuel-recharges/:id
 */
export const updateFuelRecharge = async (
  rechargeId: number,
  rechargeData: UpdateFuelRechargeDto
): Promise<FuelRecharge> => {
  try {
    const response: AxiosResponse<FuelRecharge> = await api.put(
      `/fuel-recharges/${rechargeId}`,
      rechargeData
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de la recharge ${rechargeId}:`,
      error
    );
    throw error;
  }
};

/**
 * Supprimer une recharge
 * 
 * @param rechargeId - ID de la recharge à supprimer
 * @returns Promise<void>
 * 
 * Endpoint: DELETE /fuel-recharges/:id
 */
export const deleteFuelRecharge = async (rechargeId: number): Promise<void> => {
  try {
    await api.delete(`/fuel-recharges/${rechargeId}`);
    console.log(`Recharge ${rechargeId} supprimée avec succès`);
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de la recharge ${rechargeId}:`,
      error
    );
    throw error;
  }
};

// ============================================================================
// 2. RECHERCHE ET FILTRAGE
// ============================================================================

/**
 * Rechercher des recharges avec filtres
 * 
 * @param filters - Critères de recherche
 * @returns Promise avec la liste des recharges correspondantes
 * 
 * Endpoint: GET /fuel-recharges/search
 * Exemple d'utilisation:
 * const recharges = await fuelRechargeService.searchFuelRecharges({
 *   vehicleId: 1,
 *   startDate: "2024-01-01",
 *   endDate: "2024-01-31",
 *   minQuantity: 30
 * });
 */
export const searchFuelRecharges = async (
  filters: FuelRechargeFilters
): Promise<FuelRecharge[]> => {
  try {
    const response: AxiosResponse<FuelRecharge[]> = await api.get(
      '/fuel-recharges/search',
      { params: filters }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche de recharges:', error);
    throw error;
  }
};

/**
 * Récupérer toutes les recharges d'un véhicule
 * 
 * @param vehicleId - ID du véhicule
 * @param params - Paramètres de pagination
 * @returns Promise avec la liste des recharges
 * 
 * Endpoint: GET /fuel-recharges/vehicle/:vehicleId
 * Exemple d'utilisation:
 * const vehicleRecharges = await fuelRechargeService.getFuelRechargesByVehicle(1);
 */
export const getFuelRechargesByVehicle = async (
  vehicleId: number,
  params?: PaginationParams
): Promise<FuelRecharge[]> => {
  try {
    const response: AxiosResponse<FuelRecharge[]> = await api.get(
      `/fuel-recharges/vehicle/${vehicleId}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des recharges du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer les recharges d'une période
 * 
 * @param startDate - Date de début
 * @param endDate - Date de fin
 * @returns Promise avec la liste des recharges
 * 
 * Endpoint: GET /fuel-recharges/period
 */
export const getFuelRechargesByPeriod = async (
  startDate: string,
  endDate: string
): Promise<FuelRecharge[]> => {
  try {
    const response: AxiosResponse<FuelRecharge[]> = await api.get(
      '/fuel-recharges/period',
      {
        params: { startDate, endDate },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des recharges par période:',
      error
    );
    throw error;
  }
};

/**
 * Récupérer les recharges récentes
 * 
 * @param limit - Nombre de recharges à récupérer
 * @returns Promise avec les dernières recharges
 * 
 * Endpoint: GET /fuel-recharges/recent
 */
export const getRecentFuelRecharges = async (
  limit: number = 10
): Promise<FuelRecharge[]> => {
  try {
    const response: AxiosResponse<FuelRecharge[]> = await api.get(
      '/fuel-recharges/recent',
      { params: { limit } }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des recharges récentes:', error);
    throw error;
  }
};

/**
 * Récupérer la dernière recharge d'un véhicule
 * 
 * @param vehicleId - ID du véhicule
 * @returns Promise avec la dernière recharge
 * 
 * Endpoint: GET /fuel-recharges/vehicle/:vehicleId/last
 * Exemple d'utilisation:
 * const lastRecharge = await fuelRechargeService.getLastFuelRecharge(1);
 */
export const getLastFuelRecharge = async (
  vehicleId: number
): Promise<FuelRecharge | null> => {
  try {
    const response: AxiosResponse<FuelRecharge> = await api.get(
      `/fuel-recharges/vehicle/${vehicleId}/last`
    );
    return response.data;
  } catch (error) {
    // Si aucune recharge trouvée, retourner null
    if ((error as any)?.response?.status === 404) {
      return null;
    }
    console.error(
      `Erreur lors de la récupération de la dernière recharge du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

// ============================================================================
// 3. STATISTIQUES ET RAPPORTS
// ============================================================================

/**
 * Récupérer les statistiques globales de recharge
 * 
 * @returns Promise avec les statistiques
 * 
 * Endpoint: GET /fuel-recharges/statistics
 * Exemple d'utilisation:
 * const stats = await fuelRechargeService.getFuelRechargeStatistics();
 * // Retourne: { totalRecharges, totalQuantity, totalCost, etc. }
 */
export const getFuelRechargeStatistics = async (): Promise<FuelRechargeStats> => {
  try {
    const response: AxiosResponse<FuelRechargeStats> = await api.get(
      '/fuel-recharges/statistics'
    );
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des statistiques de recharge:',
      error
    );
    throw error;
  }
};

/**
 * Récupérer les statistiques de recharge d'un véhicule
 * 
 * @param vehicleId - ID du véhicule
 * @returns Promise avec les statistiques
 * 
 * Endpoint: GET /fuel-recharges/vehicle/:vehicleId/statistics
 */
export const getVehicleFuelRechargeStatistics = async (
  vehicleId: number
): Promise<FuelRechargeStats> => {
  try {
    const response: AxiosResponse<FuelRechargeStats> = await api.get(
      `/fuel-recharges/vehicle/${vehicleId}/statistics`
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
 * Générer un rapport de consommation de carburant
 * 
 * @param vehicleId - ID du véhicule
 * @param startDate - Date de début
 * @param endDate - Date de fin
 * @returns Promise avec le rapport complet
 * 
 * Endpoint: GET /fuel-recharges/vehicle/:vehicleId/consumption-report
 * Exemple d'utilisation:
 * const report = await fuelRechargeService.generateConsumptionReport(
 *   1,
 *   "2024-01-01T00:00:00Z",
 *   "2024-12-31T23:59:59Z"
 * );
 */
export const generateConsumptionReport = async (
  vehicleId: number,
  startDate: string,
  endDate: string
): Promise<FuelConsumptionReport> => {
  try {
    const response: AxiosResponse<FuelConsumptionReport> = await api.get(
      `/fuel-recharges/vehicle/${vehicleId}/consumption-report`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la génération du rapport de consommation pour le véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

/**
 * Calculer le coût total des recharges
 * 
 * @param vehicleId - ID du véhicule (optionnel)
 * @param startDate - Date de début (optionnel)
 * @param endDate - Date de fin (optionnel)
 * @returns Promise avec le coût total
 * 
 * Endpoint: GET /fuel-recharges/total-cost
 */
export const calculateTotalFuelCost = async (
  vehicleId?: number,
  startDate?: string,
  endDate?: string
): Promise<number> => {
  try {
    const response: AxiosResponse<{ totalCost: number }> = await api.get(
      '/fuel-recharges/total-cost',
      {
        params: { vehicleId, startDate, endDate },
      }
    );
    return response.data.totalCost;
  } catch (error) {
    console.error('Erreur lors du calcul du coût total de carburant:', error);
    throw error;
  }
};

/**
 * Calculer la quantité totale de carburant rechargée
 * 
 * @param vehicleId - ID du véhicule (optionnel)
 * @param startDate - Date de début (optionnel)
 * @param endDate - Date de fin (optionnel)
 * @returns Promise avec la quantité totale en litres
 * 
 * Endpoint: GET /fuel-recharges/total-quantity
 */
export const calculateTotalFuelQuantity = async (
  vehicleId?: number,
  startDate?: string,
  endDate?: string
): Promise<number> => {
  try {
    const response: AxiosResponse<{ totalQuantity: number }> = await api.get(
      '/fuel-recharges/total-quantity',
      {
        params: { vehicleId, startDate, endDate },
      }
    );
    return response.data.totalQuantity;
  } catch (error) {
    console.error(
      'Erreur lors du calcul de la quantité totale de carburant:',
      error
    );
    throw error;
  }
};

/**
 * Calculer le prix moyen par litre
 * 
 * @param vehicleId - ID du véhicule (optionnel)
 * @param startDate - Date de début (optionnel)
 * @param endDate - Date de fin (optionnel)
 * @returns Promise avec le prix moyen par litre
 * 
 * Endpoint: GET /fuel-recharges/average-price-per-liter
 */
export const calculateAveragePricePerLiter = async (
  vehicleId?: number,
  startDate?: string,
  endDate?: string
): Promise<number> => {
  try {
    const response: AxiosResponse<{ averagePrice: number }> = await api.get(
      '/fuel-recharges/average-price-per-liter',
      {
        params: { vehicleId, startDate, endDate },
      }
    );
    return response.data.averagePrice;
  } catch (error) {
    console.error(
      'Erreur lors du calcul du prix moyen par litre:',
      error
    );
    throw error;
  }
};

/**
 * Compter le nombre total de recharges
 * 
 * @returns Promise avec le nombre de recharges
 * 
 * Endpoint: GET /fuel-recharges/count
 */
export const countFuelRecharges = async (): Promise<number> => {
  try {
    const response: AxiosResponse<{ count: number }> = await api.get(
      '/fuel-recharges/count'
    );
    return response.data.count;
  } catch (error) {
    console.error('Erreur lors du comptage des recharges:', error);
    throw error;
  }
};

// ============================================================================
// 4. ANALYSE DE CONSOMMATION
// ============================================================================

/**
 * Calculer la consommation moyenne d'un véhicule (litres/100km)
 * Nécessite l'historique des trajets et des recharges
 * 
 * @param vehicleId - ID du véhicule
 * @param startDate - Date de début
 * @param endDate - Date de fin
 * @returns Promise avec la consommation moyenne
 * 
 * Endpoint: GET /fuel-recharges/vehicle/:vehicleId/average-consumption
 * Exemple d'utilisation:
 * const avgConsumption = await fuelRechargeService.calculateAverageConsumption(
 *   1,
 *   "2024-01-01T00:00:00Z",
 *   "2024-01-31T23:59:59Z"
 * );
 * console.log(`Consommation moyenne: ${avgConsumption} L/100km`);
 */
export const calculateAverageConsumption = async (
  vehicleId: number,
  startDate: string,
  endDate: string
): Promise<number> => {
  try {
    const response: AxiosResponse<{ averageConsumption: number }> =
      await api.get(
        `/fuel-recharges/vehicle/${vehicleId}/average-consumption`,
        {
          params: { startDate, endDate },
        }
      );
    return response.data.averageConsumption;
  } catch (error) {
    console.error(
      `Erreur lors du calcul de la consommation moyenne du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

/**
 * Comparer les coûts de carburant entre plusieurs véhicules
 * 
 * @param vehicleIds - Liste des IDs de véhicules
 * @param startDate - Date de début
 * @param endDate - Date de fin
 * @returns Promise avec les comparaisons
 * 
 * Endpoint: POST /fuel-recharges/compare
 */
export const compareFuelCosts = async (
  vehicleIds: number[],
  startDate: string,
  endDate: string
): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await api.post(
      '/fuel-recharges/compare',
      {
        vehicleIds,
        startDate,
        endDate,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la comparaison des coûts de carburant:',
      error
    );
    throw error;
  }
};

/**
 * Obtenir les tendances de consommation sur une période
 * Retourne les données groupées par jour/semaine/mois
 * 
 * @param vehicleId - ID du véhicule
 * @param startDate - Date de début
 * @param endDate - Date de fin
 * @param groupBy - Grouper par 'day', 'week', ou 'month'
 * @returns Promise avec les tendances
 * 
 * Endpoint: GET /fuel-recharges/vehicle/:vehicleId/trends
 */
export const getFuelConsumptionTrends = async (
  vehicleId: number,
  startDate: string,
  endDate: string,
  groupBy: 'day' | 'week' | 'month' = 'day'
): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await api.get(
      `/fuel-recharges/vehicle/${vehicleId}/trends`,
      {
        params: { startDate, endDate, groupBy },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des tendances de consommation du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

// ============================================================================
// 5. EXPORT D'UN OBJET SERVICE COMPLET
// ============================================================================

const fuelRechargeService = {
  // CRUD
  getAllFuelRecharges,
  getAllFuelRechargesPaginated,
  getFuelRechargeById,
  getFuelRechargeWithVehicle,
  createFuelRecharge,
  updateFuelRecharge,
  deleteFuelRecharge,

  // Recherche et filtrage
  searchFuelRecharges,
  getFuelRechargesByVehicle,
  getFuelRechargesByPeriod,
  getRecentFuelRecharges,
  getLastFuelRecharge,

  // Statistiques et rapports
  getFuelRechargeStatistics,
  getVehicleFuelRechargeStatistics,
  generateConsumptionReport,
  calculateTotalFuelCost,
  calculateTotalFuelQuantity,
  calculateAveragePricePerLiter,
  countFuelRecharges,

  // Analyse de consommation
  calculateAverageConsumption,
  compareFuelCosts,
  getFuelConsumptionTrends,
};

export default fuelRechargeService;