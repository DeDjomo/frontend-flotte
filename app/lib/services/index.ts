// ============================================================================
// FICHIER: lib/services/index.ts
// DESCRIPTION: Point d'entrée centralisé pour tous les services API
// ============================================================================

/**
 * Ce fichier permet d'importer tous les services depuis un seul endroit
 * 
 * Au lieu de:
 * import { userService } from '@/lib/services/userService';
 * import { vehicleService } from '@/lib/services/vehicleService';
 * import { driverService } from '@/lib/services/driverService';
 * 
 * Tu peux faire:
 * import { userService, vehicleService, driverService } from '@/lib/services';
 */

// Export des services individuels
export { default as userService } from './userService';
export { default as vehicleService } from './vehicleService';
export { default as driverService } from './driverService';
export { default as tripService } from './tripService';
export { default as positionService } from './positionService';
export { default as maintenanceService } from './maintenanceService';
export { default as fuelRechargeService } from './fuelRechargeService';
export { default as notificationService } from './notificationService';

// Export des fonctions individuelles de userService
export {
  getAllUsers,
  getAllUsersPaginated,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  patchUser,
  deleteUser,
  login,
  logout,
  register,
  getCurrentUser,
  changePassword,
  forgotPassword,
  resetPassword,
  searchUsers,
  countUsers,
} from './userService';

// Export des fonctions individuelles de vehicleService
export {
  getAllVehicles,
  getAllVehiclesPaginated,
  getVehicleById,
  getVehicleDetails,
  getVehicleByRegistration,
  createVehicle,
  updateVehicle,
  patchVehicle,
  deleteVehicle,
  getVehicleDrivers,
  assignDriver,
  removeDriver,
  searchVehicles,
  getVehiclesByUser,
  getVehiclesByType,
  getVehiclesByMake,
  countVehicles,
  getLowFuelVehicles,
  getMovingVehicles,
  updateVehicleSpeed,
  updateVehicleFuel,
  uploadVehicleImage,
  uploadVehicleDocument,
} from './vehicleService';

// Export des fonctions individuelles de driverService
export {
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
  getDriverVehicles,
  assignVehicle,
  removeVehicle,
  searchDrivers,
  getAvailableDrivers,
  getDriversOnTrip,
  countDrivers,
  getDriverStatistics,
  getDriverTrips,
  getCurrentTrip,
  updateEmergencyContact,
  updatePersonalInfo,
} from './driverService';

// Export des fonctions individuelles de tripService
export {
  getAllTrips,
  getAllTripsPaginated,
  getTripById,
  getTripDetails,
  createTrip,
  updateTrip,
  deleteTrip,
  startTrip,
  endTrip,
  cancelTrip,
  searchTrips,
  getTripsByDriver,
  getTripsByVehicle,
  getOngoingTrips,
  getCompletedTrips,
  getTripsByPeriod,
  getTripStatistics,
  getDriverTripStatistics,
  getVehicleTripStatistics,
  generateTripReport,
  countTrips,
  calculateTripDistance,
  calculateTripDuration,
} from './tripService';

// Export des fonctions individuelles de positionService
export {
  getAllPositions,
  getCurrentPosition,
  getVehiclePositions,
  createPosition,
  updateVehiclePosition,
  cleanupOldPositions,
  getAllPositionHistory,
  getVehiclePositionHistory,
  createPositionHistory,
  getAllVehiclesPositions,
  getLiveTracking,
  analyzeTripByPositions,
  getPositionsInArea,
  searchPositions,
  countPositions,
  calculateDistance,
  isVehicleInZone,
} from './positionService';

// Export des fonctions individuelles de maintenanceService
export {
  getAllMaintenances,
  getAllMaintenancesPaginated,
  getMaintenanceById,
  getMaintenanceWithVehicle,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  searchMaintenances,
  getMaintenancesByVehicle,
  getMaintenancesByType,
  getMaintenancesByPeriod,
  getRecentMaintenances,
  getMaintenanceStatistics,
  getVehicleMaintenanceStatistics,
  generateMaintenanceReport,
  calculateTotalMaintenanceCost,
  countMaintenances,
  getScheduledMaintenances,
  getVehicleScheduledMaintenances,
  createScheduledMaintenance,
  completeScheduledMaintenance,
  cancelScheduledMaintenance,
  getUpcomingMaintenances,
} from './maintenanceService';

// Export des fonctions individuelles de fuelRechargeService
export {
  getAllFuelRecharges,
  getAllFuelRechargesPaginated,
  getFuelRechargeById,
  getFuelRechargeWithVehicle,
  createFuelRecharge,
  updateFuelRecharge,
  deleteFuelRecharge,
  searchFuelRecharges,
  getFuelRechargesByVehicle,
  getFuelRechargesByPeriod,
  getRecentFuelRecharges,
  getLastFuelRecharge,
  getFuelRechargeStatistics,
  getVehicleFuelRechargeStatistics,
  generateConsumptionReport,
  calculateTotalFuelCost,
  calculateTotalFuelQuantity,
  calculateAveragePricePerLiter,
  countFuelRecharges,
  calculateAverageConsumption,
  compareFuelCosts,
  getFuelConsumptionTrends,
} from './fuelRechargeService';

// Export des fonctions individuelles de notificationService
export {
  getAllNotifications,
  getAllNotificationsPaginated,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  searchNotifications,
  getNotificationsByUser,
  getUnreadNotifications,
  getReadNotifications,
  getNotificationsByType,
  getRecentNotifications,
  getNotificationStatistics,
  countNotifications,
  countUnreadNotifications,
  createMaintenanceAlert,
  createLowFuelAlert,
  createSpeedingAlert,
  createTripNotification,
  deleteAllReadNotifications,
  deleteAllNotifications,
} from './notificationService';