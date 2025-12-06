// ============================================================================
// FICHIER: __tests__/api-test.ts
// DESCRIPTION: Fichier de test pour vérifier tous les services API
// ============================================================================

/**
 * Ce fichier teste tous les services API avec la base de données réelle.
 * 
 * Pour exécuter ce test :
 * 1. Assure-toi que ton backend Spring Boot est démarré (localhost:9080)
 * 2. Assure-toi que ta base de données contient des données fictives
 * 3. Exécute: npx ts-node __tests__/api-test.ts
 * 
 * OU utilise ce code dans un composant React pour tester visuellement
 */

import {
  userService,
  vehicleService,
  driverService,
  tripService,
  positionService,
  maintenanceService,
  fuelRechargeService,
  notificationService,
} from '../../lib/services';

// ============================================================================
// FONCTION PRINCIPALE DE TEST
// ============================================================================

async function testAllServices() {
  console.log('\n🚀 ========================================');
  console.log('   DÉBUT DES TESTS API - FLEETMAN');
  console.log('========================================\n');

  try {
    // Test 1: Users
    await testUserService();

    // Test 2: Vehicles
    await testVehicleService();

    // Test 3: Drivers
    await testDriverService();

    // Test 4: Trips
    await testTripService();

    // Test 5: Positions
    await testPositionService();

    // Test 6: Maintenances
    await testMaintenanceService();

    // Test 7: Fuel Recharges
    await testFuelRechargeService();

    // Test 8: Notifications
    await testNotificationService();

    console.log('\n✅ ========================================');
    console.log('   TOUS LES TESTS SONT PASSÉS !');
    console.log('========================================\n');
  } catch (error) {
    console.error('\n❌ ========================================');
    console.error('   ERREUR DANS LES TESTS');
    console.error('========================================');
    console.error(error);
  }
}

// ============================================================================
// TEST 1: USER SERVICE
// ============================================================================

async function testUserService() {
  console.log('\n📝 TEST 1: USER SERVICE');
  console.log('─────────────────────────────────────────');

  try {
    // Récupérer tous les utilisateurs
    console.log('🔍 Récupération de tous les utilisateurs...');
    const users = await userService.getAllUsers();
    console.log(`✅ ${users.length} utilisateur(s) trouvé(s)`);
    
    if (users.length > 0) {
      console.log('\n👤 Premier utilisateur:');
      console.log(JSON.stringify(users[0], null, 2));

      // Récupérer un utilisateur par ID
      console.log(`\n🔍 Récupération de l'utilisateur ID: ${users[0].userId}...`);
      const user = await userService.getUserById(users[0].userId);
      console.log('✅ Utilisateur récupéré:', user.userName);

      // Compter les utilisateurs
      const count = await userService.countUsers();
      console.log(`\n📊 Nombre total d'utilisateurs: ${count}`);
    } else {
      console.log('⚠️  Aucun utilisateur dans la base de données');
    }
  } catch (error) {
    console.error('❌ Erreur dans testUserService:', error);
    throw error;
  }
}

// ============================================================================
// TEST 2: VEHICLE SERVICE
// ============================================================================

async function testVehicleService() {
  console.log('\n🚗 TEST 2: VEHICLE SERVICE');
  console.log('─────────────────────────────────────────');

  try {
    // Récupérer tous les véhicules
    console.log('🔍 Récupération de tous les véhicules...');
    const vehicles = await vehicleService.getAllVehicles();
    console.log(`✅ ${vehicles.length} véhicule(s) trouvé(s)`);

    if (vehicles.length > 0) {
      console.log('\n🚙 Premier véhicule:');
      console.log(JSON.stringify(vehicles[0], null, 2));

      // Récupérer les détails d'un véhicule
      console.log(`\n🔍 Récupération des détails du véhicule ID: ${vehicles[0].vehicleId}...`);
      const vehicleDetails = await vehicleService.getVehicleById(vehicles[0].vehicleId);
      console.log('✅ Véhicule récupéré:', vehicleDetails.vehicleName);

      // Compter les véhicules
      const count = await vehicleService.countVehicles();
      console.log(`\n📊 Nombre total de véhicules: ${count}`);

      // Récupérer les conducteurs du premier véhicule
      console.log(`\n🔍 Récupération des conducteurs du véhicule ID: ${vehicles[0].vehicleId}...`);
      try {
        const drivers = await vehicleService.getVehicleDrivers(vehicles[0].vehicleId);
        console.log(`✅ ${drivers.length} conducteur(s) assigné(s)`);
      } catch (error) {
        console.log('⚠️  Endpoint getVehicleDrivers non disponible ou aucun conducteur');
      }
    } else {
      console.log('⚠️  Aucun véhicule dans la base de données');
    }
  } catch (error) {
    console.error('❌ Erreur dans testVehicleService:', error);
    throw error;
  }
}

// ============================================================================
// TEST 3: DRIVER SERVICE
// ============================================================================

async function testDriverService() {
  console.log('\n👨‍✈️ TEST 3: DRIVER SERVICE');
  console.log('─────────────────────────────────────────');

  try {
    // Récupérer tous les conducteurs
    console.log('🔍 Récupération de tous les conducteurs...');
    const drivers = await driverService.getAllDrivers();
    console.log(`✅ ${drivers.length} conducteur(s) trouvé(s)`);

    if (drivers.length > 0) {
      console.log('\n👤 Premier conducteur:');
      console.log(JSON.stringify(drivers[0], null, 2));

      // Récupérer un conducteur par ID
      console.log(`\n🔍 Récupération du conducteur ID: ${drivers[0].driverId}...`);
      const driver = await driverService.getDriverById(drivers[0].driverId);
      console.log('✅ Conducteur récupéré:', driver.driverName);

      // Compter les conducteurs
      const count = await driverService.countDrivers();
      console.log(`\n📊 Nombre total de conducteurs: ${count}`);

      // Récupérer les véhicules du conducteur
      console.log(`\n🔍 Récupération des véhicules du conducteur ID: ${drivers[0].driverId}...`);
      try {
        const vehicles = await driverService.getDriverVehicles(drivers[0].driverId);
        console.log(`✅ ${vehicles.length} véhicule(s) assigné(s)`);
      } catch (error) {
        console.log('⚠️  Endpoint getDriverVehicles non disponible ou aucun véhicule');
      }
    } else {
      console.log('⚠️  Aucun conducteur dans la base de données');
    }
  } catch (error) {
    console.error('❌ Erreur dans testDriverService:', error);
    throw error;
  }
}

// ============================================================================
// TEST 4: TRIP SERVICE
// ============================================================================

async function testTripService() {
  console.log('\n🛣️  TEST 4: TRIP SERVICE');
  console.log('─────────────────────────────────────────');

  try {
    // Récupérer tous les trajets
    console.log('🔍 Récupération de tous les trajets...');
    const trips = await tripService.getAllTrips();
    console.log(`✅ ${trips.length} trajet(s) trouvé(s)`);

    if (trips.length > 0) {
      console.log('\n🚦 Premier trajet:');
      console.log(JSON.stringify(trips[0], null, 2));

      // Récupérer un trajet par ID
      console.log(`\n🔍 Récupération du trajet ID: ${trips[0].tripId}...`);
      const trip = await tripService.getTripById(trips[0].tripId);
      console.log('✅ Trajet récupéré - Départ:', trip.departureDateTime);

      // Compter les trajets
      const count = await tripService.countTrips();
      console.log(`\n📊 Nombre total de trajets: ${count}`);

      // Récupérer les trajets en cours
      console.log('\n🔍 Récupération des trajets en cours...');
      try {
        const ongoingTrips = await tripService.getOngoingTrips();
        console.log(`✅ ${ongoingTrips.length} trajet(s) en cours`);
      } catch (error) {
        console.log('⚠️  Endpoint getOngoingTrips non disponible');
      }
    } else {
      console.log('⚠️  Aucun trajet dans la base de données');
    }
  } catch (error) {
    console.error('❌ Erreur dans testTripService:', error);
    throw error;
  }
}

// ============================================================================
// TEST 5: POSITION SERVICE
// ============================================================================

async function testPositionService() {
  console.log('\n📍 TEST 5: POSITION SERVICE');
  console.log('─────────────────────────────────────────');

  try {
    // Récupérer toutes les positions
    console.log('🔍 Récupération de toutes les positions...');
    const positions = await positionService.getAllPositions({ page: 0, size: 10 });
    console.log(`✅ ${positions.length} position(s) trouvée(s)`);

    if (positions.length > 0) {
      console.log('\n📌 Première position:');
      console.log(JSON.stringify(positions[0], null, 2));

      // Compter les positions
      const count = await positionService.countPositions();
      console.log(`\n📊 Nombre total de positions: ${count}`);

      // Récupérer la position actuelle d'un véhicule
      console.log(`\n🔍 Récupération de la position actuelle du véhicule ID: ${positions[0].vehicleId}...`);
      try {
        const currentPosition = await positionService.getCurrentPosition(positions[0].vehicleId);
        console.log('✅ Position actuelle récupérée');
        console.log('Coordonnées:', currentPosition.coordinate.coordinates);
      } catch (error) {
        console.log('⚠️  Endpoint getCurrentPosition non disponible');
      }
    } else {
      console.log('⚠️  Aucune position dans la base de données');
    }
  } catch (error) {
    console.error('❌ Erreur dans testPositionService:', error);
    throw error;
  }
}

// ============================================================================
// TEST 6: MAINTENANCE SERVICE
// ============================================================================

async function testMaintenanceService() {
  console.log('\n🔧 TEST 6: MAINTENANCE SERVICE');
  console.log('─────────────────────────────────────────');

  try {
    // Récupérer toutes les maintenances
    console.log('🔍 Récupération de toutes les maintenances...');
    const maintenances = await maintenanceService.getAllMaintenances();
    console.log(`✅ ${maintenances.length} maintenance(s) trouvée(s)`);

    if (maintenances.length > 0) {
      console.log('\n🛠️  Première maintenance:');
      console.log(JSON.stringify(maintenances[0], null, 2));

      // Récupérer une maintenance par ID
      console.log(`\n🔍 Récupération de la maintenance ID: ${maintenances[0].maintenanceId}...`);
      const maintenance = await maintenanceService.getMaintenanceById(maintenances[0].maintenanceId);
      console.log('✅ Maintenance récupérée:', maintenance.maintenanceSubject);

      // Compter les maintenances
      const count = await maintenanceService.countMaintenances();
      console.log(`\n📊 Nombre total de maintenances: ${count}`);
    } else {
      console.log('⚠️  Aucune maintenance dans la base de données');
    }
  } catch (error) {
    console.error('❌ Erreur dans testMaintenanceService:', error);
    throw error;
  }
}

// ============================================================================
// TEST 7: FUEL RECHARGE SERVICE
// ============================================================================

async function testFuelRechargeService() {
  console.log('\n⛽ TEST 7: FUEL RECHARGE SERVICE');
  console.log('─────────────────────────────────────────');

  try {
    // Récupérer toutes les recharges
    console.log('🔍 Récupération de toutes les recharges...');
    const recharges = await fuelRechargeService.getAllFuelRecharges();
    console.log(`✅ ${recharges.length} recharge(s) trouvée(s)`);

    if (recharges.length > 0) {
      console.log('\n⛽ Première recharge:');
      console.log(JSON.stringify(recharges[0], null, 2));

      // Récupérer une recharge par ID
      console.log(`\n🔍 Récupération de la recharge ID: ${recharges[0].rechargeId}...`);
      const recharge = await fuelRechargeService.getFuelRechargeById(recharges[0].rechargeId);
      console.log('✅ Recharge récupérée - Quantité:', recharge.rechargeQuantity, 'L');

      // Compter les recharges
      const count = await fuelRechargeService.countFuelRecharges();
      console.log(`\n📊 Nombre total de recharges: ${count}`);
    } else {
      console.log('⚠️  Aucune recharge dans la base de données');
    }
  } catch (error) {
    console.error('❌ Erreur dans testFuelRechargeService:', error);
    throw error;
  }
}

// ============================================================================
// TEST 8: NOTIFICATION SERVICE
// ============================================================================

async function testNotificationService() {
  console.log('\n🔔 TEST 8: NOTIFICATION SERVICE');
  console.log('─────────────────────────────────────────');

  try {
    // Récupérer toutes les notifications
    console.log('🔍 Récupération de toutes les notifications...');
    const notifications = await notificationService.getAllNotifications();
    console.log(`✅ ${notifications.length} notification(s) trouvée(s)`);

    if (notifications.length > 0) {
      console.log('\n🔔 Première notification:');
      console.log(JSON.stringify(notifications[0], null, 2));

      // Récupérer une notification par ID
      console.log(`\n🔍 Récupération de la notification ID: ${notifications[0].notificationId}...`);
      const notification = await notificationService.getNotificationById(notifications[0].notificationId);
      console.log('✅ Notification récupérée:', notification.notificationSubject);

      // Compter les notifications
      const count = await notificationService.countNotifications();
      console.log(`\n📊 Nombre total de notifications: ${count}`);

      // Compter les notifications non lues de l'utilisateur
      if (notifications[0].userId) {
        console.log(`\n🔍 Récupération des notifications non lues de l'utilisateur ID: ${notifications[0].userId}...`);
        try {
          const unreadCount = await notificationService.countUnreadNotifications(notifications[0].userId);
          console.log(`✅ ${unreadCount} notification(s) non lue(s)`);
        } catch (error) {
          console.log('⚠️  Endpoint countUnreadNotifications non disponible');
        }
      }
    } else {
      console.log('⚠️  Aucune notification dans la base de données');
    }
  } catch (error) {
    console.error('❌ Erreur dans testNotificationService:', error);
    throw error;
  }
}

// ============================================================================
// EXPORT ET EXÉCUTION
// ============================================================================

// Si exécuté directement avec ts-node
if (require.main === module) {
  testAllServices();
}

// Export pour utilisation dans React
export { testAllServices };
export default {
  testUserService,
  testVehicleService,
  testDriverService,
  testTripService,
  testPositionService,
  testMaintenanceService,
  testFuelRechargeService,
  testNotificationService,
};