// ============================================================================
// FICHIER: types/index.ts
// DESCRIPTION: Point d'entrée centralisé pour tous les types TypeScript
// ============================================================================

import { ISODateString } from './common';

/**
 * Ce fichier permet d'importer tous les types depuis un seul endroit
 * 
 * Au lieu de:
 * import { User } from '@/types/user';
 * import { Vehicle } from '@/types/vehicle';
 * import { Driver } from '@/types/driver';
 * 
 * Tu peux faire:
 * import { User, Vehicle, Driver } from '@/types';
 */

// ============================================================================
// TYPES COMMUNS
// ============================================================================
export type {
  Coordinates,
  GeoJSONPoint,
  GeoJSONLineString,
  Geometry,
  ISODateString,
  PaginatedResponse,
  PaginationParams,
  ApiError,
  ApiResponse,
} from './common';

// ============================================================================
// USER
// ============================================================================
export type {
  User,
  CreateUserDto,
  UpdateUserDto,
  LoginCredentials,
  AuthResponse,
  SafeUser,
} from './user';

// ============================================================================
// DRIVER
// ============================================================================
export type {
  Driver,
  CreateDriverDto,
  UpdateDriverDto,
  DriverWithVehicles,
} from './driver';

// ============================================================================
// VEHICLE
// ============================================================================
export type {
  Vehicle,
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleWithDrivers,
  VehicleDetails,
  VehicleFilters,
} from './vehicle';

export { VehicleType } from './vehicle';

// ============================================================================
// DRIVER-VEHICLE (Many-to-Many)
// ============================================================================
export type {
  DriverVehicle,
  CreateDriverVehicleDto,
  DriverVehicleWithDriverDetails,
  DriverVehicleWithVehicleDetails,
  DriverVehicleComplete,
} from './driverVehicle';

// ============================================================================
// NOTIFICATION
// ============================================================================
export type {
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto,
  EnrichedNotification,
  NotificationFilters,
  NotificationStats,
} from './notification';

export { NotificationType } from './notification';

// ============================================================================
// FUEL RECHARGE
// ============================================================================
export type {
  FuelRecharge,
  CreateFuelRechargeDto,
  UpdateFuelRechargeDto,
  FuelRechargeWithVehicle,
  FuelRechargeStats,
  FuelRechargeFilters,
  FuelConsumptionReport,
} from './fuelRecharge';

// ============================================================================
// MAINTENANCE
// ============================================================================
export type {
  Maintenance,
  CreateMaintenanceDto,
  UpdateMaintenanceDto,
  MaintenanceWithVehicle,
  MaintenanceStats,
  MaintenanceFilters,
  MaintenanceReport,
  ScheduledMaintenance,
} from './maintenance';

export { MaintenanceType } from './maintenance';

// ============================================================================
// TRIP
// ============================================================================
export type {
  Trip,
  CreateTripDto,
  UpdateTripDto,
  StartTripDto,
  EndTripDto,
  TripWithDetails,
  TripStats,
  TripFilters,
  TripReport,
  NamedLocation,
} from './trip';

export { TripStatus } from './trip';

// ============================================================================
// POSITION
// ============================================================================
export type {
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
  PositionUpdate,
} from './position';

// ============================================================================
// TYPES UTILITAIRES SUPPLÉMENTAIRES
// ============================================================================

/**
 * Type pour les réponses de succès avec message
 */
export interface SuccessResponse {
  success: true;
  message: string;
}

/**
 * Type pour les réponses d'erreur
 */
export interface ErrorResponse {
  success: false;
  error: string;
  details?: string[];
}

/**
 * Type pour les options de tri
 */
export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * Type pour les paramètres de requête communs
 */
export interface QueryParams {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
}

/**
 * Type pour un ID générique
 */
export type ID = number | string;

/**
 * Type pour les timestamps
 */
export interface Timestamps {
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/**
 * Type helper pour rendre tous les champs optionnels sauf certains
 */
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/**
 * Type helper pour rendre tous les champs required sauf certains
 */
export type RequiredExcept<T, K extends keyof T> = Required<T> & Partial<Pick<T, K>>;