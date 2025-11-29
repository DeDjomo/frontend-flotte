// ============================================================================
// FICHIER: types/notification.ts
// DESCRIPTION: Types TypeScript pour l'entité Notification
// ============================================================================

import { ISODateString } from './common';

/**
 * Interface Notification - Représente une notification système
 * Correspond à la table "notification" dans PostgreSQL
 * 
 * Table SQL:
 * CREATE TABLE notification (
 *   notificationId SERIAL PRIMARY KEY,
 *   notificationSubject VARCHAR(200) NOT NULL,
 *   notificationContent TEXT NOT NULL,
 *   notificationDateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *   notificationState BOOLEAN NOT NULL DEFAULT FALSE,
 *   userId INTEGER NOT NULL
 * );
 */
export interface Notification {
  /** ID unique de la notification (auto-incrémenté) */
  notificationId: number;
  
  /** Sujet/titre de la notification */
  notificationSubject: string;
  
  /** Contenu détaillé de la notification */
  notificationContent: string;
  
  /** Date et heure de création de la notification */
  notificationDateTime: ISODateString;
  
  /** 
   * État de la notification
   * false = non lue
   * true = lue
   */
  notificationState: boolean;
  
  /** ID de l'utilisateur destinataire */
  userId: number;
}

/**
 * Type pour la création d'une nouvelle notification
 * Exclut les champs auto-générés
 * 
 * Utilisation: Pour les requêtes POST /notifications
 */
export interface CreateNotificationDto {
  notificationSubject: string;
  notificationContent: string;
  userId: number;
  /** notificationState est optionnel car il a une valeur par défaut (false) */
  notificationState?: boolean;
}

/**
 * Type pour la mise à jour d'une notification
 * Généralement utilisé pour marquer une notification comme lue
 * 
 * Utilisation: Pour les requêtes PATCH /notifications/:id
 */
export interface UpdateNotificationDto {
  notificationState?: boolean;
  notificationSubject?: string;
  notificationContent?: string;
}

/**
 * Énumération des types de notifications
 * Pour catégoriser les notifications
 */
export enum NotificationType {
  /** Alerte de maintenance */
  MAINTENANCE = 'maintenance',
  
  /** Alerte de carburant faible */
  LOW_FUEL = 'low_fuel',
  
  /** Alerte de vitesse excessive */
  SPEEDING = 'speeding',
  
  /** Notification de fin de trajet */
  TRIP_COMPLETED = 'trip_completed',
  
  /** Notification de début de trajet */
  TRIP_STARTED = 'trip_started',
  
  /** Alerte système */
  SYSTEM = 'system',
  
  /** Information générale */
  INFO = 'info',
  
  /** Avertissement */
  WARNING = 'warning',
  
  /** Erreur */
  ERROR = 'error'
}

/**
 * Type pour une notification enrichie avec des métadonnées
 * Peut inclure des informations supplémentaires selon le type
 */
export interface EnrichedNotification extends Notification {
  /** Type de notification */
  type?: NotificationType;
  
  /** Métadonnées supplémentaires (optionnel) */
  metadata?: {
    vehicleId?: number;
    driverId?: number;
    tripId?: number;
    maintenanceId?: number;
    [key: string]: any; // Permet d'ajouter d'autres propriétés
  };
  
  /** Informations de l'utilisateur */
  user?: {
    userId: number;
    userName: string;
    userEmail: string;
  };
}

/**
 * Type pour les filtres de notifications
 */
export interface NotificationFilters {
  /** Filtrer par état (lue/non lue) */
  notificationState?: boolean;
  
  /** Filtrer par utilisateur */
  userId?: number;
  
  /** Filtrer par plage de dates */
  startDate?: ISODateString;
  endDate?: ISODateString;
  
  /** Filtrer par type */
  type?: NotificationType;
}

/**
 * Type pour les statistiques de notifications
 */
export interface NotificationStats {
  /** Nombre total de notifications */
  total: number;
  
  /** Nombre de notifications non lues */
  unread: number;
  
  /** Nombre de notifications lues */
  read: number;
  
  /** Répartition par type */
  byType?: Record<NotificationType, number>;
}