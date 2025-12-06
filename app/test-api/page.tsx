// ============================================================================
// FICHIER: app/test-api/page.tsx
// DESCRIPTION: Page de test visuel pour tous les services API
// ============================================================================

'use client';

import { useState } from 'react';
import {
  userService,
  vehicleService,
  driverService,
  tripService,
  positionService,
  maintenanceService,
  fuelRechargeService,
  notificationService,
} from '../lib/services';

export default function TestApiPage() {
  const [results, setResults] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [activeTest, setActiveTest] = useState<string>('');

  // Fonction pour ajouter un résultat
  const addResult = (message: string) => {
    setResults((prev) => prev + message + '\n');
  };

  // Fonction pour nettoyer les résultats
  const clearResults = () => {
    setResults('');
  };

  // ============================================================================
  // TEST 1: USER SERVICE
  // ============================================================================
  const testUserService = async () => {
    setActiveTest('users');
    setLoading(true);
    clearResults();

    try {
      addResult('========================================');
      addResult('📝 TEST USER SERVICE');
      addResult('========================================\n');

      // Récupérer tous les utilisateurs
      addResult('🔍 Récupération de tous les utilisateurs...');
      const users = await userService.getAllUsers();
      addResult(`✅ ${users.length} utilisateur(s) trouvé(s)\n`);

      if (users.length > 0) {
        addResult('👤 Premier utilisateur:');
        addResult(JSON.stringify(users[0], null, 2));
        addResult('');

        // Compter les utilisateurs
        const count = await userService.countUsers();
        addResult(`📊 Nombre total d'utilisateurs: ${count}`);
      } else {
        addResult('⚠️  Aucun utilisateur dans la base de données');
      }

      addResult('\n✅ Test terminé avec succès !');
    } catch (error: any) {
      addResult(`\n❌ ERREUR: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // TEST 2: VEHICLE SERVICE
  // ============================================================================
  const testVehicleService = async () => {
    setActiveTest('vehicles');
    setLoading(true);
    clearResults();

    try {
      addResult('========================================');
      addResult('🚗 TEST VEHICLE SERVICE');
      addResult('========================================\n');

      addResult('🔍 Récupération de tous les véhicules...');
      const vehicles = await vehicleService.getAllVehicles();
      addResult(`✅ ${vehicles.length} véhicule(s) trouvé(s)\n`);

      if (vehicles.length > 0) {
        addResult('🚙 Premier véhicule:');
        addResult(JSON.stringify(vehicles[0], null, 2));
        addResult('');

        const count = await vehicleService.countVehicles();
        addResult(`📊 Nombre total de véhicules: ${count}`);
      } else {
        addResult('⚠️  Aucun véhicule dans la base de données');
      }

      addResult('\n✅ Test terminé avec succès !');
    } catch (error: any) {
      addResult(`\n❌ ERREUR: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // TEST 3: DRIVER SERVICE
  // ============================================================================
  const testDriverService = async () => {
    setActiveTest('drivers');
    setLoading(true);
    clearResults();

    try {
      addResult('========================================');
      addResult('👨‍✈️ TEST DRIVER SERVICE');
      addResult('========================================\n');

      addResult('🔍 Récupération de tous les conducteurs...');
      const drivers = await driverService.getAllDrivers();
      addResult(`✅ ${drivers.length} conducteur(s) trouvé(s)\n`);

      if (drivers.length > 0) {
        addResult('👤 Premier conducteur:');
        addResult(JSON.stringify(drivers[0], null, 2));
        addResult('');

        const count = await driverService.countDrivers();
        addResult(`📊 Nombre total de conducteurs: ${count}`);
      } else {
        addResult('⚠️  Aucun conducteur dans la base de données');
      }

      addResult('\n✅ Test terminé avec succès !');
    } catch (error: any) {
      addResult(`\n❌ ERREUR: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // TEST 4: TRIP SERVICE
  // ============================================================================
  const testTripService = async () => {
    setActiveTest('trips');
    setLoading(true);
    clearResults();

    try {
      addResult('========================================');
      addResult('🛣️  TEST TRIP SERVICE');
      addResult('========================================\n');

      addResult('🔍 Récupération de tous les trajets...');
      const trips = await tripService.getAllTrips();
      addResult(`✅ ${trips.length} trajet(s) trouvé(s)\n`);

      if (trips.length > 0) {
        addResult('🚦 Premier trajet:');
        addResult(JSON.stringify(trips[0], null, 2));
        addResult('');

        const count = await tripService.countTrips();
        addResult(`📊 Nombre total de trajets: ${count}`);
      } else {
        addResult('⚠️  Aucun trajet dans la base de données');
      }

      addResult('\n✅ Test terminé avec succès !');
    } catch (error: any) {
      addResult(`\n❌ ERREUR: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // TEST 5: POSITION SERVICE
  // ============================================================================
  const testPositionService = async () => {
    setActiveTest('positions');
    setLoading(true);
    clearResults();

    try {
      addResult('========================================');
      addResult('📍 TEST POSITION SERVICE');
      addResult('========================================\n');

      addResult('🔍 Récupération de toutes les positions...');
      const positions = await positionService.getAllPositions({ page: 0, size: 10 });
      addResult(`✅ ${positions.length} position(s) trouvée(s)\n`);

      if (positions.length > 0) {
        addResult('📌 Première position:');
        addResult(JSON.stringify(positions[0], null, 2));
        addResult('');

        const count = await positionService.countPositions();
        addResult(`📊 Nombre total de positions: ${count}`);
      } else {
        addResult('⚠️  Aucune position dans la base de données');
      }

      addResult('\n✅ Test terminé avec succès !');
    } catch (error: any) {
      addResult(`\n❌ ERREUR: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // TEST 6: MAINTENANCE SERVICE
  // ============================================================================
  const testMaintenanceService = async () => {
    setActiveTest('maintenances');
    setLoading(true);
    clearResults();

    try {
      addResult('========================================');
      addResult('🔧 TEST MAINTENANCE SERVICE');
      addResult('========================================\n');

      addResult('🔍 Récupération de toutes les maintenances...');
      const maintenances = await maintenanceService.getAllMaintenances();
      addResult(`✅ ${maintenances.length} maintenance(s) trouvée(s)\n`);

      if (maintenances.length > 0) {
        addResult('🛠️  Première maintenance:');
        addResult(JSON.stringify(maintenances[0], null, 2));
        addResult('');

        const count = await maintenanceService.countMaintenances();
        addResult(`📊 Nombre total de maintenances: ${count}`);
      } else {
        addResult('⚠️  Aucune maintenance dans la base de données');
      }

      addResult('\n✅ Test terminé avec succès !');
    } catch (error: any) {
      addResult(`\n❌ ERREUR: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // TEST 7: FUEL RECHARGE SERVICE
  // ============================================================================
  const testFuelRechargeService = async () => {
    setActiveTest('fuelRecharges');
    setLoading(true);
    clearResults();

    try {
      addResult('========================================');
      addResult('⛽ TEST FUEL RECHARGE SERVICE');
      addResult('========================================\n');

      addResult('🔍 Récupération de toutes les recharges...');
      const recharges = await fuelRechargeService.getAllFuelRecharges();
      addResult(`✅ ${recharges.length} recharge(s) trouvée(s)\n`);

      if (recharges.length > 0) {
        addResult('⛽ Première recharge:');
        addResult(JSON.stringify(recharges[0], null, 2));
        addResult('');

        const count = await fuelRechargeService.countFuelRecharges();
        addResult(`📊 Nombre total de recharges: ${count}`);
      } else {
        addResult('⚠️  Aucune recharge dans la base de données');
      }

      addResult('\n✅ Test terminé avec succès !');
    } catch (error: any) {
      addResult(`\n❌ ERREUR: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // TEST 8: NOTIFICATION SERVICE
  // ============================================================================
  const testNotificationService = async () => {
    setActiveTest('notifications');
    setLoading(true);
    clearResults();

    try {
      addResult('========================================');
      addResult('🔔 TEST NOTIFICATION SERVICE');
      addResult('========================================\n');

      addResult('🔍 Récupération de toutes les notifications...');
      const notifications = await notificationService.getAllNotifications();
      addResult(`✅ ${notifications.length} notification(s) trouvée(s)\n`);

      if (notifications.length > 0) {
        addResult('🔔 Première notification:');
        addResult(JSON.stringify(notifications[0], null, 2));
        addResult('');

        const count = await notificationService.countNotifications();
        addResult(`📊 Nombre total de notifications: ${count}`);
      } else {
        addResult('⚠️  Aucune notification dans la base de données');
      }

      addResult('\n✅ Test terminé avec succès !');
    } catch (error: any) {
      addResult(`\n❌ ERREUR: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // TEST ALL
  // ============================================================================
  const testAll = async () => {
    setActiveTest('all');
    setLoading(true);
    clearResults();

    try {
      await testUserService();
      await testVehicleService();
      await testDriverService();
      await testTripService();
      await testPositionService();
      await testMaintenanceService();
      await testFuelRechargeService();
      await testNotificationService();

      addResult('\n\n========================================');
      addResult('✅ TOUS LES TESTS SONT TERMINÉS !');
      addResult('========================================');
    } catch (error: any) {
      addResult(`\n❌ ERREUR GLOBALE: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1 style={{ marginBottom: '20px' }}>🧪 Test API FleetMan</h1>

      {/* Boutons de test */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={testUserService}
          disabled={loading}
          style={{
            padding: '10px 15px',
            backgroundColor: activeTest === 'users' ? '#4CAF50' : '#008CBA',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          📝 Test Users
        </button>

        <button
          onClick={testVehicleService}
          disabled={loading}
          style={{
            padding: '10px 15px',
            backgroundColor: activeTest === 'vehicles' ? '#4CAF50' : '#008CBA',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          🚗 Test Vehicles
        </button>

        <button
          onClick={testDriverService}
          disabled={loading}
          style={{
            padding: '10px 15px',
            backgroundColor: activeTest === 'drivers' ? '#4CAF50' : '#008CBA',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          👨‍✈️ Test Drivers
        </button>

        <button
          onClick={testTripService}
          disabled={loading}
          style={{
            padding: '10px 15px',
            backgroundColor: activeTest === 'trips' ? '#4CAF50' : '#008CBA',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          🛣️  Test Trips
        </button>

        <button
          onClick={testPositionService}
          disabled={loading}
          style={{
            padding: '10px 15px',
            backgroundColor: activeTest === 'positions' ? '#4CAF50' : '#008CBA',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          📍 Test Positions
        </button>

        <button
          onClick={testMaintenanceService}
          disabled={loading}
          style={{
            padding: '10px 15px',
            backgroundColor: activeTest === 'maintenances' ? '#4CAF50' : '#008CBA',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          🔧 Test Maintenances
        </button>

        <button
          onClick={testFuelRechargeService}
          disabled={loading}
          style={{
            padding: '10px 15px',
            backgroundColor: activeTest === 'fuelRecharges' ? '#4CAF50' : '#008CBA',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          ⛽ Test Fuel Recharges
        </button>

        <button
          onClick={testNotificationService}
          disabled={loading}
          style={{
            padding: '10px 15px',
            backgroundColor: activeTest === 'notifications' ? '#4CAF50' : '#008CBA',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          🔔 Test Notifications
        </button>

        <button
          onClick={clearResults}
          disabled={loading}
          style={{
            padding: '10px 15px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          🗑️  Clear
        </button>
      </div>

      {/* Résultats */}
      <div
        style={{
          backgroundColor: '#1e1e1e',
          color: '#d4d4d4',
          padding: '20px',
          borderRadius: '8px',
          minHeight: '400px',
          maxHeight: '600px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          fontFamily: 'Consolas, Monaco, monospace',
          fontSize: '14px',
        }}
      >
        {loading && <div>⏳ Chargement en cours...</div>}
        {results || 'Cliquez sur un bouton pour tester un service...'}
      </div>
    </div>
  );
}