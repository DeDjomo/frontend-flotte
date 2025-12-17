// ============================================================================
// FICHIER: lib/services/notificationService.ts
// DESCRIPTION: Service pour gérer toutes les opérations liées aux notifications
// ============================================================================

/**
 * Ce service encapsule toutes les requêtes HTTP liées aux notifications.
 * Gère la création, la lecture et les statistiques de notifications.
 */

import api from '../api';
import {
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto,
  EnrichedNotification,
  NotificationFilters,
  NotificationStats,
  NotificationType,
  PaginatedResponse,
  PaginationParams,
} from '../../types';
import { AxiosResponse } from 'axios';

// ============================================================================
// 1. FONCTIONS CRUD DE BASE
// ============================================================================

/**
 * Récupérer toutes les notifications
 * 
 * @param params - Paramètres de pagination
 * @returns Promise avec la liste des notifications
 * 
 * Endpoint: GET /notifications
 * Exemple d'utilisation:
 * const notifications = await notificationService.getAllNotifications();
 */
export const getAllNotifications = async (
  params?: PaginationParams
): Promise<Notification[]> => {
  try {
    const response: AxiosResponse<Notification[]> = await api.get(
      '/notifications',
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    throw error;
  }
};

/**
 * Récupérer toutes les notifications avec pagination
 * 
 * @param params - Paramètres de pagination
 * @returns Promise avec la réponse paginée
 * 
 * Endpoint: GET /notifications/paginated
 */
export const getAllNotificationsPaginated = async (
  params: PaginationParams = { page: 0, size: 10 }
): Promise<PaginatedResponse<Notification>> => {
  try {
    const response: AxiosResponse<PaginatedResponse<Notification>> =
      await api.get('/notifications/paginated', { params });
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération paginée des notifications:',
      error
    );
    throw error;
  }
};

/**
 * Récupérer une notification par son ID
 * 
 * @param notificationId - ID de la notification
 * @returns Promise avec la notification
 * 
 * Endpoint: GET /notifications/:id
 * Exemple d'utilisation:
 * const notification = await notificationService.getNotificationById(1);
 */
export const getNotificationById = async (
  notificationId: number
): Promise<Notification> => {
  try {
    const response: AxiosResponse<Notification> = await api.get(
      `/notifications/${notificationId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de la notification ${notificationId}:`,
      error
    );
    throw error;
  }
};

/**
 * Créer une nouvelle notification
 * 
 * @param notificationData - Données de la notification
 * @returns Promise avec la notification créée
 * 
 * Endpoint: POST /notifications
 * Exemple d'utilisation:
 * const newNotification = await notificationService.createNotification({
 *   notificationSubject: "Alerte de maintenance",
 *   notificationContent: "Le véhicule CM-123-AB nécessite une vidange",
 *   userId: 1
 * });
 */
export const createNotification = async (
  notificationData: CreateNotificationDto
): Promise<Notification> => {
  try {
    const response: AxiosResponse<Notification> = await api.post(
      '/notifications',
      notificationData
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    throw error;
  }
};

/**
 * Mettre à jour une notification
 * Principalement pour marquer comme lue/non lue
 * 
 * @param notificationId - ID de la notification
 * @param notificationData - Données à mettre à jour
 * @returns Promise avec la notification mise à jour
 * 
 * Endpoint: PUT /notifications/:id
 */
export const updateNotification = async (
  notificationId: number,
  notificationData: UpdateNotificationDto
): Promise<Notification> => {
  try {
    const response: AxiosResponse<Notification> = await api.put(
      `/notifications/${notificationId}`,
      notificationData
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de la notification ${notificationId}:`,
      error
    );
    throw error;
  }
};

/**
 * Supprimer une notification
 * 
 * @param notificationId - ID de la notification à supprimer
 * @returns Promise<void>
 * 
 * Endpoint: DELETE /notifications/:id
 */
export const deleteNotification = async (
  notificationId: number
): Promise<void> => {
  try {
    await api.delete(`/notifications/${notificationId}`);
    console.log(`Notification ${notificationId} supprimée avec succès`);
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de la notification ${notificationId}:`,
      error
    );
    throw error;
  }
};

// ============================================================================
// 2. GESTION DE L'ÉTAT DES NOTIFICATIONS
// ============================================================================

/**
 * Marquer une notification comme lue
 *
 * @param notificationId - ID de la notification
 * @returns Promise avec la notification mise à jour
 *
 * Endpoint: PATCH /notifications/:id/read
 * Exemple d'utilisation:
 * await notificationService.markAsRead(1);
 */
export const markAsRead = async (
  notificationId: number
): Promise<Notification> => {
  try {
    const response: AxiosResponse<Notification> = await api.patch(
      `/notifications/${notificationId}/read`
    );
    console.log(`Notification ${notificationId} marquée comme lue`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors du marquage de la notification ${notificationId} comme lue:`,
      error
    );
    throw error;
  }
};

/**
 * Marquer une notification comme non lue
 * 
 * @param notificationId - ID de la notification
 * @returns Promise avec la notification mise à jour
 * 
 * Endpoint: PATCH /notifications/:id/mark-as-unread
 */
export const markAsUnread = async (
  notificationId: number
): Promise<Notification> => {
  try {
    const response: AxiosResponse<Notification> = await api.patch(
      `/notifications/${notificationId}/mark-as-unread`
    );
    console.log(`Notification ${notificationId} marquée comme non lue`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors du marquage de la notification ${notificationId} comme non lue:`,
      error
    );
    throw error;
  }
};

/**
 * Marquer toutes les notifications comme lues pour un utilisateur
 * 
 * @param userId - ID de l'utilisateur
 * @returns Promise<void>
 * 
 * Endpoint: POST /notifications/user/:userId/mark-all-as-read
 * Exemple d'utilisation:
 * await notificationService.markAllAsRead(1);
 */
export const markAllAsRead = async (userId: number): Promise<void> => {
  try {
    await api.post(`/notifications/user/${userId}/mark-all-as-read`);
    console.log(`Toutes les notifications de l'utilisateur ${userId} marquées comme lues`);
  } catch (error) {
    console.error(
      `Erreur lors du marquage de toutes les notifications de l'utilisateur ${userId} comme lues:`,
      error
    );
    throw error;
  }
};

// ============================================================================
// 3. RECHERCHE ET FILTRAGE
// ============================================================================

/**
 * Rechercher des notifications avec filtres
 * 
 * @param filters - Critères de recherche
 * @returns Promise avec la liste des notifications correspondantes
 * 
 * Endpoint: GET /notifications/search
 * Exemple d'utilisation:
 * const notifications = await notificationService.searchNotifications({
 *   userId: 1,
 *   notificationState: false, // Non lues
 *   startDate: "2024-01-01",
 *   endDate: "2024-01-31"
 * });
 */
export const searchNotifications = async (
  filters: NotificationFilters
): Promise<Notification[]> => {
  try {
    const response: AxiosResponse<Notification[]> = await api.get(
      '/notifications/search',
      { params: filters }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche de notifications:', error);
    throw error;
  }
};

/**
 * Récupérer toutes les notifications d'un utilisateur
 * 
 * @param userId - ID de l'utilisateur
 * @param params - Paramètres de pagination
 * @returns Promise avec la liste des notifications
 * 
 * Endpoint: GET /notifications/user/:userId
 * Exemple d'utilisation:
 * const userNotifications = await notificationService.getNotificationsByUser(1);
 */
export const getNotificationsByUser = async (
  userId: number,
  params?: PaginationParams
): Promise<Notification[]> => {
  try {
    const response: AxiosResponse<Notification[]> = await api.get(
      `/notifications/user/${userId}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des notifications de l'utilisateur ${userId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer les notifications non lues d'un utilisateur
 * 
 * @param userId - ID de l'utilisateur
 * @returns Promise avec la liste des notifications non lues
 * 
 * Endpoint: GET /notifications/user/:userId/unread
 * Exemple d'utilisation:
 * const unreadNotifications = await notificationService.getUnreadNotifications(1);
 */
export const getUnreadNotifications = async (
  userId: number
): Promise<Notification[]> => {
  try {
    const response: AxiosResponse<Notification[]> = await api.get(
      `/notifications/user/${userId}/unread`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des notifications non lues de l'utilisateur ${userId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer les notifications lues d'un utilisateur
 * 
 * @param userId - ID de l'utilisateur
 * @param params - Paramètres de pagination
 * @returns Promise avec la liste des notifications lues
 * 
 * Endpoint: GET /notifications/user/:userId/read
 */
export const getReadNotifications = async (
  userId: number,
  params?: PaginationParams
): Promise<Notification[]> => {
  try {
    const response: AxiosResponse<Notification[]> = await api.get(
      `/notifications/user/${userId}/read`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des notifications lues de l'utilisateur ${userId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer les notifications par type
 * 
 * @param type - Type de notification
 * @param userId - ID de l'utilisateur (optionnel)
 * @returns Promise avec la liste des notifications
 * 
 * Endpoint: GET /notifications/type/:type
 */
export const getNotificationsByType = async (
  type: NotificationType,
  userId?: number
): Promise<Notification[]> => {
  try {
    const response: AxiosResponse<Notification[]> = await api.get(
      `/notifications/type/${type}`,
      { params: { userId } }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des notifications de type ${type}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupérer les notifications récentes
 * 
 * @param userId - ID de l'utilisateur
 * @param limit - Nombre de notifications à récupérer
 * @returns Promise avec les dernières notifications
 * 
 * Endpoint: GET /notifications/user/:userId/recent
 */
export const getRecentNotifications = async (
  userId: number,
  limit: number = 10
): Promise<Notification[]> => {
  try {
    const response: AxiosResponse<Notification[]> = await api.get(
      `/notifications/user/${userId}/recent`,
      { params: { limit } }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des notifications récentes de l'utilisateur ${userId}:`,
      error
    );
    throw error;
  }
};

// ============================================================================
// 4. STATISTIQUES
// ============================================================================

/**
 * Récupérer les statistiques de notifications d'un utilisateur
 * 
 * @param userId - ID de l'utilisateur
 * @returns Promise avec les statistiques
 * 
 * Endpoint: GET /notifications/user/:userId/statistics
 * Exemple d'utilisation:
 * const stats = await notificationService.getNotificationStatistics(1);
 * // Retourne: { total, unread, read, byType }
 */
export const getNotificationStatistics = async (
  userId: number
): Promise<NotificationStats> => {
  try {
    const response: AxiosResponse<NotificationStats> = await api.get(
      `/notifications/user/${userId}/statistics`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des statistiques de l'utilisateur ${userId}:`,
      error
    );
    throw error;
  }
};

/**
 * Compter le nombre total de notifications
 * 
 * @param userId - ID de l'utilisateur (optionnel)
 * @returns Promise avec le nombre de notifications
 * 
 * Endpoint: GET /notifications/count
 */
export const countNotifications = async (userId?: number): Promise<number> => {
  try {
    const response: AxiosResponse<{ count: number }> = await api.get(
      '/notifications/count',
      { params: { userId } }
    );
    return response.data.count;
  } catch (error) {
    console.error('Erreur lors du comptage des notifications:', error);
    throw error;
  }
};

/**
 * Compter les notifications non lues d'un utilisateur
 * 
 * @param userId - ID de l'utilisateur
 * @returns Promise avec le nombre de notifications non lues
 * 
 * Endpoint: GET /notifications/user/:userId/unread/count
 * Exemple d'utilisation:
 * const unreadCount = await notificationService.countUnreadNotifications(1);
 */
export const countUnreadNotifications = async (
  userId: number
): Promise<number> => {
  try {
    const response: AxiosResponse<number> = await api.get(
      `/notifications/user/${userId}/unread/count`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors du comptage des notifications non lues de l'utilisateur ${userId}:`,
      error
    );
    throw error;
  }
};

// ============================================================================
// 5. CRÉATION DE NOTIFICATIONS SPÉCIFIQUES
// ============================================================================

/**
 * Créer une notification de maintenance
 * 
 * @param userId - ID de l'utilisateur
 * @param vehicleId - ID du véhicule
 * @param maintenanceSubject - Sujet de la maintenance
 * @returns Promise avec la notification créée
 * 
 * Endpoint: POST /notifications/create-maintenance-alert
 */
export const createMaintenanceAlert = async (
  userId: number,
  vehicleId: number,
  maintenanceSubject: string
): Promise<Notification> => {
  try {
    const response: AxiosResponse<Notification> = await api.post(
      '/notifications/create-maintenance-alert',
      {
        userId,
        vehicleId,
        maintenanceSubject,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'alerte de maintenance:', error);
    throw error;
  }
};

/**
 * Créer une notification de carburant faible
 * 
 * @param userId - ID de l'utilisateur
 * @param vehicleId - ID du véhicule
 * @param fuelLevel - Niveau de carburant actuel
 * @returns Promise avec la notification créée
 * 
 * Endpoint: POST /notifications/create-low-fuel-alert
 */
export const createLowFuelAlert = async (
  userId: number,
  vehicleId: number,
  fuelLevel: number
): Promise<Notification> => {
  try {
    const response: AxiosResponse<Notification> = await api.post(
      '/notifications/create-low-fuel-alert',
      {
        userId,
        vehicleId,
        fuelLevel,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'alerte de carburant faible:', error);
    throw error;
  }
};

/**
 * Créer une notification d'excès de vitesse
 * 
 * @param userId - ID de l'utilisateur
 * @param vehicleId - ID du véhicule
 * @param speed - Vitesse actuelle
 * @param speedLimit - Limite de vitesse
 * @returns Promise avec la notification créée
 * 
 * Endpoint: POST /notifications/create-speeding-alert
 */
export const createSpeedingAlert = async (
  userId: number,
  vehicleId: number,
  speed: number,
  speedLimit: number
): Promise<Notification> => {
  try {
    const response: AxiosResponse<Notification> = await api.post(
      '/notifications/create-speeding-alert',
      {
        userId,
        vehicleId,
        speed,
        speedLimit,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'alerte de vitesse:', error);
    throw error;
  }
};

/**
 * Créer une notification de trajet
 * 
 * @param userId - ID de l'utilisateur
 * @param tripId - ID du trajet
 * @param eventType - Type d'événement ('started' ou 'completed')
 * @returns Promise avec la notification créée
 * 
 * Endpoint: POST /notifications/create-trip-notification
 */
export const createTripNotification = async (
  userId: number,
  tripId: number,
  eventType: 'started' | 'completed'
): Promise<Notification> => {
  try {
    const response: AxiosResponse<Notification> = await api.post(
      '/notifications/create-trip-notification',
      {
        userId,
        tripId,
        eventType,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la notification de trajet:', error);
    throw error;
  }
};

// ============================================================================
// 6. GESTION EN MASSE
// ============================================================================

/**
 * Supprimer toutes les notifications lues d'un utilisateur
 * 
 * @param userId - ID de l'utilisateur
 * @returns Promise<void>
 * 
 * Endpoint: DELETE /notifications/user/:userId/delete-read
 */
export const deleteAllReadNotifications = async (
  userId: number
): Promise<void> => {
  try {
    await api.delete(`/notifications/user/${userId}/delete-read`);
    console.log(`Toutes les notifications lues de l'utilisateur ${userId} supprimées`);
  } catch (error) {
    console.error(
      `Erreur lors de la suppression des notifications lues de l'utilisateur ${userId}:`,
      error
    );
    throw error;
  }
};

/**
 * Supprimer toutes les notifications d'un utilisateur
 * 
 * @param userId - ID de l'utilisateur
 * @returns Promise<void>
 * 
 * Endpoint: DELETE /notifications/user/:userId/delete-all
 */
export const deleteAllNotifications = async (userId: number): Promise<void> => {
  try {
    await api.delete(`/notifications/user/${userId}/delete-all`);
    console.log(`Toutes les notifications de l'utilisateur ${userId} supprimées`);
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de toutes les notifications de l'utilisateur ${userId}:`,
      error
    );
    throw error;
  }
};

// ============================================================================
// 7. EXPORT D'UN OBJET SERVICE COMPLET
// ============================================================================

const notificationService = {
  // CRUD
  getAllNotifications,
  getAllNotificationsPaginated,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,

  // Gestion de l'état
  markAsRead,
  markAsUnread,
  markAllAsRead,

  // Recherche et filtrage
  searchNotifications,
  getNotificationsByUser,
  getUnreadNotifications,
  getReadNotifications,
  getNotificationsByType,
  getRecentNotifications,

  // Statistiques
  getNotificationStatistics,
  countNotifications,
  countUnreadNotifications,

  // Création de notifications spécifiques
  createMaintenanceAlert,
  createLowFuelAlert,
  createSpeedingAlert,
  createTripNotification,

  // Gestion en masse
  deleteAllReadNotifications,
  deleteAllNotifications,
};

export default notificationService;