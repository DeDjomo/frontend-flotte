// ============================================================================
// FICHIER: lib/services/positionService.ts
// DESCRIPTION: Service pour gérer le tracking GPS et les positions des véhicules
// ============================================================================

/**
 * Ce service encapsule toutes les requêtes HTTP liées au tracking GPS.
 * Gère les positions en temps réel et l'historique des positions.
 */

import api from '../api';
import {
  Position,
  PositionHistory,
  CreatePositionDto,
  CreatePositionHistoryDto,
  PositionWithVehicle,
  LiveTracking,
  PositionFilters,
  PositionHistoryFilters,
  VehiclePositionsMap,
  TripAnalysis,
  PaginationParams,
} from '../../types';
import { AxiosResponse } from 'axios';

// ============================================================================
// 1. GESTION DES POSITIONS EN TEMPS RÉEL
// ============================================================================

/**
 * Récupérer toutes les positions récentes
 * 
 * @param params - Paramètres de pagination
 * @returns Promise avec la liste des positions
 * 
 * Endpoint: GET /positions
 * Exemple d'utilisation:
 * const positions = await positionService.getAllPositions({ page: 0, size: 50 });
 */
export const getAllPositions = async (
  params?: PaginationParams
): Promise<Position[]> => {
  try {
    const response: AxiosResponse<Position[]> = await api.get('/positions', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des positions:', error);
    throw error;
  }
};

/**
 * Récupérer la position actuelle d'un véhicule
 *
 * @param vehicleId - ID du véhicule
 * @returns Promise avec la dernière position connue
 *
 * Endpoint: GET /positions/vehicle/:vehicleId/current
 * Exemple d'utilisation:
 * const currentPosition = await positionService.getCurrentPosition(1);
 */
export const getCurrentPosition = async (
  vehicleId: number
): Promise<Position> => {
  try {
    const response: AxiosResponse<Position> = await api.get(
      `/positions/vehicle/${vehicleId}/current`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de la position actuelle du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer la dernière position connue d'un véhicule
 *
 * @param vehicleId - ID du véhicule
 * @returns Promise avec la dernière position enregistrée
 *
 * Endpoint: GET /positions/vehicle/:vehicleId/latest
 * Exemple d'utilisation:
 * const latestPosition = await positionService.getLatestPosition(1);
 *
 * Retourne:
 * {
 *   positionId: 1,
 *   coordinate: { type: "Point", coordinates: [2.3522, 48.8566] },
 *   positionDateTime: "2024-01-15T14:30:00",
 *   vehicleId: 1,
 *   vehicleName: "Renault Trafic"
 * }
 */
export const getLatestPosition = async (
  vehicleId: number
): Promise<PositionWithVehicle> => {
  try {
    const response: AxiosResponse<PositionWithVehicle> = await api.get(
      `/positions/vehicle/${vehicleId}/latest`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de la dernière position du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer l'historique des positions d'un véhicule
 * 
 * @param vehicleId - ID du véhicule
 * @param filters - Filtres (dates, limite)
 * @returns Promise avec la liste des positions
 * 
 * Endpoint: GET /positions/vehicle/:vehicleId
 * Exemple d'utilisation:
 * const history = await positionService.getVehiclePositions(1, {
 *   startDate: "2024-01-15T00:00:00Z",
 *   endDate: "2024-01-15T23:59:59Z",
 *   limit: 100
 * });
 */
export const getVehiclePositions = async (
  vehicleId: number,
  filters?: PositionFilters
): Promise<Position[]> => {
  try {
    const response: AxiosResponse<Position[]> = await api.get(
      `/positions/vehicle/${vehicleId}`,
      { params: filters }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des positions du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

/**
 * Créer/Enregistrer une nouvelle position
 * Généralement appelé par le dispositif IoT du véhicule
 * 
 * @param positionData - Coordonnées GPS et ID du véhicule
 * @returns Promise avec la position créée
 * 
 * Endpoint: POST /positions
 * Exemple d'utilisation:
 * const newPosition = await positionService.createPosition({
 *   coordinate: { type: "Point", coordinates: [3.8480, 11.5021] },
 *   vehicleId: 1
 * });
 */
export const createPosition = async (
  positionData: CreatePositionDto
): Promise<Position> => {
  try {
    const response: AxiosResponse<Position> = await api.post(
      '/positions',
      positionData
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la position:', error);
    throw error;
  }
};

/**
 * Mettre à jour la position d'un véhicule (version simplifiée)
 * 
 * @param vehicleId - ID du véhicule
 * @param latitude - Latitude
 * @param longitude - Longitude
 * @returns Promise avec la position créée
 * 
 * Endpoint: POST /positions/update
 * Exemple d'utilisation:
 * await positionService.updateVehiclePosition(1, 11.5021, 3.8480);
 */
export const updateVehiclePosition = async (
  vehicleId: number,
  latitude: number,
  longitude: number
): Promise<Position> => {
  try {
    const response: AxiosResponse<Position> = await api.post(
      '/positions/update',
      {
        vehicleId,
        coordinate: {
          type: 'Point',
          coordinates: [longitude, latitude], // GeoJSON: [lng, lat]
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de la position du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

/**
 * Supprimer les anciennes positions (nettoyage)
 * 
 * @param beforeDate - Supprimer les positions avant cette date
 * @returns Promise<void>
 * 
 * Endpoint: DELETE /positions/cleanup
 * Exemple d'utilisation:
 * await positionService.cleanupOldPositions("2024-01-01T00:00:00Z");
 */
export const cleanupOldPositions = async (beforeDate: string): Promise<void> => {
  try {
    await api.delete('/positions/cleanup', {
      params: { beforeDate },
    });
  } catch (error) {
    console.error('Erreur lors du nettoyage des anciennes positions:', error);
    throw error;
  }
};

// ============================================================================
// 2. GESTION DE L'HISTORIQUE DES POSITIONS (LineString)
// ============================================================================

/**
 * Récupérer tout l'historique des positions
 * 
 * @param params - Paramètres de pagination
 * @returns Promise avec la liste des historiques
 * 
 * Endpoint: GET /position-history
 */
export const getAllPositionHistory = async (
  params?: PaginationParams
): Promise<PositionHistory[]> => {
  try {
    const response: AxiosResponse<PositionHistory[]> = await api.get(
      '/position-history',
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique des positions:', error);
    throw error;
  }
};

/**
 * Récupérer l'historique des positions d'un véhicule
 * 
 * @param vehicleId - ID du véhicule
 * @param filters - Filtres (dates)
 * @returns Promise avec la liste des historiques (LineStrings)
 * 
 * Endpoint: GET /position-history/vehicle/:vehicleId
 * Exemple d'utilisation:
 * const history = await positionService.getVehiclePositionHistory(1, {
 *   startDate: "2024-01-15T00:00:00Z",
 *   endDate: "2024-01-15T23:59:59Z"
 * });
 */
export const getVehiclePositionHistory = async (
  vehicleId: number,
  filters?: PositionHistoryFilters
): Promise<PositionHistory[]> => {
  try {
    const response: AxiosResponse<PositionHistory[]> = await api.get(
      `/position-history/vehicle/${vehicleId}`,
      { params: filters }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l'historique du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

/**
 * Créer un nouvel enregistrement d'historique
 * Convertit une série de positions en LineString
 * 
 * @param historyData - LineString et ID du véhicule
 * @returns Promise avec l'historique créé
 * 
 * Endpoint: POST /position-history
 * Exemple d'utilisation:
 * const history = await positionService.createPositionHistory({
 *   summaryCoordinate: {
 *     type: "LineString",
 *     coordinates: [
 *       [3.8480, 11.5021],
 *       [3.8490, 11.5031],
 *       [3.8500, 11.5041]
 *     ]
 *   },
 *   vehicleId: 1
 * });
 */
export const createPositionHistory = async (
  historyData: CreatePositionHistoryDto
): Promise<PositionHistory> => {
  try {
    const response: AxiosResponse<PositionHistory> = await api.post(
      '/position-history',
      historyData
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'historique:', error);
    throw error;
  }
};

// ============================================================================
// 3. TRACKING EN TEMPS RÉEL
// ============================================================================

/**
 * Récupérer les positions de tous les véhicules (pour affichage carte)
 * 
 * @returns Promise avec une map de toutes les positions actuelles
 * 
 * Endpoint: GET /positions/all-vehicles
 * Exemple d'utilisation:
 * const vehiclesMap = await positionService.getAllVehiclesPositions();
 * // Retourne: { vehicles: { 1: {...}, 2: {...} }, totalVehicles: 2, ... }
 */
export const getAllVehiclesPositions = async (): Promise<VehiclePositionsMap> => {
  try {
    const response: AxiosResponse<VehiclePositionsMap> = await api.get(
      '/positions/all-vehicles'
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des positions de tous les véhicules:', error);
    throw error;
  }
};

/**
 * Récupérer les informations de tracking en temps réel d'un véhicule
 * Inclut position, vitesse, statut, conducteur actuel, etc.
 * 
 * @param vehicleId - ID du véhicule
 * @returns Promise avec les informations de tracking
 * 
 * Endpoint: GET /positions/vehicle/:vehicleId/live-tracking
 * Exemple d'utilisation:
 * const liveTracking = await positionService.getLiveTracking(1);
 */
export const getLiveTracking = async (
  vehicleId: number
): Promise<LiveTracking> => {
  try {
    const response: AxiosResponse<LiveTracking> = await api.get(
      `/positions/vehicle/${vehicleId}/live-tracking`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du tracking en temps réel du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer les véhicules en mouvement
 * 
 * @returns Promise avec la liste des véhicules en mouvement
 * 
 * Endpoint: GET /positions/moving-vehicles
 */
export const getMovingVehicles = async (): Promise<PositionWithVehicle[]> => {
  try {
    const response: AxiosResponse<PositionWithVehicle[]> = await api.get(
      '/positions/moving-vehicles'
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des véhicules en mouvement:', error);
    throw error;
  }
};

/**
 * Récupérer les véhicules arrêtés
 * 
 * @returns Promise avec la liste des véhicules arrêtés
 * 
 * Endpoint: GET /positions/stopped-vehicles
 */
export const getStoppedVehicles = async (): Promise<PositionWithVehicle[]> => {
  try {
    const response: AxiosResponse<PositionWithVehicle[]> = await api.get(
      '/positions/stopped-vehicles'
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des véhicules arrêtés:', error);
    throw error;
  }
};

// ============================================================================
// 4. ANALYSE ET RAPPORTS
// ============================================================================

/**
 * Analyser un trajet basé sur les positions
 * Calcule distance, durée, vitesse moyenne, arrêts, etc.
 * 
 * @param vehicleId - ID du véhicule
 * @param startDate - Date de début
 * @param endDate - Date de fin
 * @returns Promise avec l'analyse complète du trajet
 * 
 * Endpoint: GET /positions/vehicle/:vehicleId/analysis
 * Exemple d'utilisation:
 * const analysis = await positionService.analyzeTripByPositions(
 *   1,
 *   "2024-01-15T08:00:00Z",
 *   "2024-01-15T10:00:00Z"
 * );
 */
export const analyzeTripByPositions = async (
  vehicleId: number,
  startDate: string,
  endDate: string
): Promise<TripAnalysis> => {
  try {
    const response: AxiosResponse<TripAnalysis> = await api.get(
      `/positions/vehicle/${vehicleId}/analysis`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de l'analyse du trajet du véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer les positions dans une zone géographique
 * Utilise une bounding box (rectangle)
 * 
 * @param minLat - Latitude minimale
 * @param minLng - Longitude minimale
 * @param maxLat - Latitude maximale
 * @param maxLng - Longitude maximale
 * @returns Promise avec les positions dans la zone
 * 
 * Endpoint: GET /positions/in-area
 * Exemple d'utilisation:
 * const positionsInArea = await positionService.getPositionsInArea(
 *   11.50, 3.84,  // min lat, min lng
 *   11.55, 3.87   // max lat, max lng
 * );
 */
export const getPositionsInArea = async (
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number
): Promise<Position[]> => {
  try {
    const response: AxiosResponse<Position[]> = await api.get(
      '/positions/in-area',
      {
        params: { minLat, minLng, maxLat, maxLng },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des positions dans la zone:', error);
    throw error;
  }
};

/**
 * Rechercher des positions avec filtres
 * 
 * @param filters - Critères de recherche
 * @returns Promise avec la liste des positions
 * 
 * Endpoint: GET /positions/search
 */
export const searchPositions = async (
  filters: PositionFilters
): Promise<Position[]> => {
  try {
    const response: AxiosResponse<Position[]> = await api.get(
      '/positions/search',
      { params: filters }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche de positions:', error);
    throw error;
  }
};

/**
 * Compter le nombre total de positions enregistrées
 * 
 * @returns Promise avec le nombre de positions
 * 
 * Endpoint: GET /positions/count
 */
export const countPositions = async (): Promise<number> => {
  try {
    const response: AxiosResponse<{ count: number }> = await api.get(
      '/positions/count'
    );
    return response.data.count;
  } catch (error) {
    console.error('Erreur lors du comptage des positions:', error);
    throw error;
  }
};

// ============================================================================
// 5. FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Calculer la distance entre deux positions
 * Utilise la formule de Haversine
 * 
 * @param position1 - Première position
 * @param position2 - Deuxième position
 * @returns Promise avec la distance en kilomètres
 * 
 * Endpoint: POST /positions/calculate-distance
 */
export const calculateDistance = async (
  position1: { latitude: number; longitude: number },
  position2: { latitude: number; longitude: number }
): Promise<number> => {
  try {
    const response: AxiosResponse<{ distance: number }> = await api.post(
      '/positions/calculate-distance',
      { position1, position2 }
    );
    return response.data.distance;
  } catch (error) {
    console.error('Erreur lors du calcul de la distance:', error);
    throw error;
  }
};

/**
 * Vérifier si un véhicule est dans une zone définie (geofencing)
 * 
 * @param vehicleId - ID du véhicule
 * @param centerLat - Latitude du centre de la zone
 * @param centerLng - Longitude du centre de la zone
 * @param radius - Rayon de la zone en mètres
 * @returns Promise avec true si dans la zone, false sinon
 * 
 * Endpoint: GET /positions/vehicle/:vehicleId/in-zone
 * Exemple d'utilisation:
 * const isInZone = await positionService.isVehicleInZone(1, 11.5021, 3.8480, 1000);
 */
export const isVehicleInZone = async (
  vehicleId: number,
  centerLat: number,
  centerLng: number,
  radius: number
): Promise<boolean> => {
  try {
    const response: AxiosResponse<{ inZone: boolean }> = await api.get(
      `/positions/vehicle/${vehicleId}/in-zone`,
      {
        params: { centerLat, centerLng, radius },
      }
    );
    return response.data.inZone;
  } catch (error) {
    console.error(
      `Erreur lors de la vérification de la zone pour le véhicule ${vehicleId}:`,
      error
    );
    throw error;
  }
};

// ============================================================================
// 6. EXPORT D'UN OBJET SERVICE COMPLET
// ============================================================================

const positionService = {
  // Positions en temps réel
  getAllPositions,
  getCurrentPosition,
  getLatestPosition,
  getVehiclePositions,
  createPosition,
  updateVehiclePosition,
  cleanupOldPositions,

  // Historique des positions
  getAllPositionHistory,
  getVehiclePositionHistory,
  createPositionHistory,

  // Tracking en temps réel
  getAllVehiclesPositions,
  getLiveTracking,
  getMovingVehicles,
  getStoppedVehicles,

  // Analyse et rapports
  analyzeTripByPositions,
  getPositionsInArea,
  searchPositions,
  countPositions,

  // Utilitaires
  calculateDistance,
  isVehicleInZone,
};

export default positionService;