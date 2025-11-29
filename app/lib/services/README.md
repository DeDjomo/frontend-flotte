# Services API - FleetMan

Documentation complète de tous les services API pour l'application FleetMan.

## Structure des Services

```
lib/services/
├── index.ts                    # Export centralisé
├── userService.ts             # Gestion des utilisateurs
├── vehicleService.ts          # Gestion des véhicules
├── driverService.ts           # Gestion des conducteurs
├── tripService.ts             # Gestion des trajets
├── positionService.ts         # Tracking GPS
├── maintenanceService.ts      # Gestion des maintenances
├── fuelRechargeService.ts     # Gestion du carburant
└── notificationService.ts     # Gestion des notifications
```

## Installation et Import

### Import depuis le point centralisé (Recommandé)

```typescript
import { 
  userService, 
  vehicleService, 
  driverService,
  tripService,
  positionService,
  maintenanceService,
  fuelRechargeService,
  notificationService
} from '@/lib/services';
```

### Import des fonctions individuelles

```typescript
import { 
  getAllVehicles, 
  createVehicle, 
  updateVehicleFuel 
} from '@/lib/services';
```

### Import d'un service spécifique

```typescript
import { vehicleService } from '@/lib/services/vehicleService';
```

## Guide d'Utilisation

### UserService - Gestion des Utilisateurs

#### CRUD de base
```typescript
// Récupérer tous les utilisateurs
const users = await userService.getAllUsers();
const paginatedUsers = await userService.getAllUsersPaginated({ page: 0, size: 20 });

// Récupérer un utilisateur
const user = await userService.getUserById(1);
const userByEmail = await userService.getUserByEmail('user@example.com');

// Créer un utilisateur
const newUser = await userService.createUser({
  userName: "John Doe",
  userEmail: "john@example.com",
  userPassword: "securePassword123",
  userPhoneNumber: "+237600000000"
});

// Mettre à jour
const updated = await userService.updateUser(1, {
  userName: "New Name"
});

// Supprimer
await userService.deleteUser(1);
```

#### Authentification
```typescript
// Connexion
const authData = await userService.login({
  userEmail: "user@example.com",
  userPassword: "password123"
});
// Stocker le token: localStorage.setItem('authToken', authData.token);

// Inscription
const newAccount = await userService.register({
  userName: "New User",
  userEmail: "newuser@example.com",
  userPassword: "securePassword123",
  userPhoneNumber: "+237600000000"
});

// Récupérer le profil actuel
const currentUser = await userService.getCurrentUser();

// Déconnexion
await userService.logout();
```

---

###  VehicleService - Gestion des Véhicules

#### CRUD de base
```typescript
// Récupérer tous les véhicules
const vehicles = await vehicleService.getAllVehicles();

// Récupérer un véhicule
const vehicle = await vehicleService.getVehicleById(1);
const vehicleDetails = await vehicleService.getVehicleDetails(1);
const vehicleByPlate = await vehicleService.getVehicleByRegistration('CM-123-AB');

// Créer un véhicule
const newVehicle = await vehicleService.createVehicle({
  vehicleMake: "Toyota",
  vehicleName: "Corolla",
  vehicleRegistrationNumber: "CM-123-AB",
  vehicleType: "Berline",
  vehicleNumberPassengers: 5,
  userId: 1
});

// Mettre à jour
await vehicleService.updateVehicle(1, {
  vehicleFuelLevel: 75.5
});
```

#### Gestion des conducteurs
```typescript
// Récupérer les conducteurs d'un véhicule
const drivers = await vehicleService.getVehicleDrivers(1);

// Assigner un conducteur
await vehicleService.assignDriver(vehicleId, driverId);

// Retirer un conducteur
await vehicleService.removeDriver(vehicleId, driverId);
```

#### Recherche et filtres
```typescript
// Rechercher avec filtres
const vehicles = await vehicleService.searchVehicles({
  vehicleType: "Berline",
  minFuelLevel: 50
});

// Par propriétaire
const myVehicles = await vehicleService.getVehiclesByUser(userId);

// Par type
const suvs = await vehicleService.getVehiclesByType('SUV');

// Carburant faible
const lowFuel = await vehicleService.getLowFuelVehicles(20);
```

#### Temps réel (IoT)
```typescript
// Mettre à jour la vitesse
await vehicleService.updateVehicleSpeed(vehicleId, 85.5);

// Mettre à jour le carburant
await vehicleService.updateVehicleFuel(vehicleId, 45.8);

// Véhicules en mouvement
const moving = await vehicleService.getMovingVehicles();
```

#### Documents
```typescript
// Upload image
const imageUrl = await vehicleService.uploadVehicleImage(vehicleId, imageFile);

// Upload document
const docUrl = await vehicleService.uploadVehicleDocument(vehicleId, documentFile);
```

---

### DriverService - Gestion des Conducteurs

#### CRUD de base
```typescript
// Récupérer tous les conducteurs
const drivers = await driverService.getAllDrivers();

// Récupérer un conducteur
const driver = await driverService.getDriverById(1);
const driverWithVehicles = await driverService.getDriverWithVehicles(1);

// Créer un conducteur
const newDriver = await driverService.createDriver({
  driverName: "Jean Dupont",
  driverEmail: "jean@example.com",
  driverPhoneNumber: "+237600000000",
  emergencyContactName: "Marie Dupont",
  emergencyContact: "+237611111111"
});

// Mettre à jour
await driverService.updateDriver(1, {
  driverPhoneNumber: "+237622222222"
});
```

#### Disponibilité
```typescript
// Conducteurs disponibles
const available = await driverService.getAvailableDrivers();

// Conducteurs en trajet
const onTrip = await driverService.getDriversOnTrip();

// Trajet actuel
const currentTrip = await driverService.getCurrentTrip(driverId);
```

#### Statistiques
```typescript
// Statistiques d'un conducteur
const stats = await driverService.getDriverStatistics(driverId);

// Historique des trajets
const trips = await driverService.getDriverTrips(driverId);
```

---

### TripService - Gestion des Trajets

#### Démarrer/Arrêter un trajet
```typescript
// Démarrer un trajet
const trip = await tripService.startTrip({
  departurePoint: { type: "Point", coordinates: [3.8480, 11.5021] },
  driverId: 1,
  vehicleId: 1
});

// Terminer un trajet
const completedTrip = await tripService.endTrip({
  tripId: 1,
  arrivalPoint: { type: "Point", coordinates: [3.8680, 11.5321] }
});

// Annuler un trajet
await tripService.cancelTrip(tripId);
```

#### Recherche
```typescript
// Trajets en cours
const ongoing = await tripService.getOngoingTrips();

// Trajets terminés
const completed = await tripService.getCompletedTrips();

// Par conducteur
const driverTrips = await tripService.getTripsByDriver(driverId);

// Par véhicule
const vehicleTrips = await tripService.getTripsByVehicle(vehicleId);

// Par période
const trips = await tripService.getTripsByPeriod(
  "2024-01-01T00:00:00Z",
  "2024-01-31T23:59:59Z"
);
```

#### Statistiques et rapports
```typescript
// Statistiques globales
const stats = await tripService.getTripStatistics();

// Rapport complet
const report = await tripService.generateTripReport(
  "2024-01-01T00:00:00Z",
  "2024-12-31T23:59:59Z",
  driverId // optionnel
);

// Distance d'un trajet
const distance = await tripService.calculateTripDistance(tripId);
```

---

### PositionService - Tracking GPS

#### Positions en temps réel
```typescript
// Position actuelle d'un véhicule
const currentPosition = await positionService.getCurrentPosition(vehicleId);

// Historique des positions
const history = await positionService.getVehiclePositions(vehicleId, {
  startDate: "2024-01-15T00:00:00Z",
  endDate: "2024-01-15T23:59:59Z"
});

// Créer une position (IoT)
await positionService.createPosition({
  coordinate: { type: "Point", coordinates: [3.8480, 11.5021] },
  vehicleId: 1
});

// Mise à jour simplifiée
await positionService.updateVehiclePosition(vehicleId, 11.5021, 3.8480);
```

#### Tracking en temps réel
```typescript
// Toutes les positions actuelles
const allPositions = await positionService.getAllVehiclesPositions();

// Live tracking d'un véhicule
const liveTracking = await positionService.getLiveTracking(vehicleId);

// Véhicules en mouvement
const moving = await positionService.getMovingVehicles();
```

#### Analyse
```typescript
// Analyser un trajet
const analysis = await positionService.analyzeTripByPositions(
  vehicleId,
  "2024-01-15T08:00:00Z",
  "2024-01-15T10:00:00Z"
);

// Geofencing
const isInZone = await positionService.isVehicleInZone(
  vehicleId,
  11.5021,  // centerLat
  3.8480,   // centerLng
  1000      // radius en mètres
);
```

---

### MaintenanceService - Gestion des Maintenances

#### CRUD de base
```typescript
// Créer une maintenance
const maintenance = await maintenanceService.createMaintenance({
  maintenanceSubject: "Vidange",
  maintenanceCost: 25000,
  vehicleId: 1,
  maintenancePoint: { type: "Point", coordinates: [3.8480, 11.5021] }
});

// Récupérer les maintenances d'un véhicule
const maintenances = await maintenanceService.getMaintenancesByVehicle(vehicleId);

// Par type
const vidanges = await maintenanceService.getMaintenancesByType('Vidange');
```

#### Statistiques
```typescript
// Statistiques d'un véhicule
const stats = await maintenanceService.getVehicleMaintenanceStatistics(vehicleId);

// Rapport complet
const report = await maintenanceService.generateMaintenanceReport(
  vehicleId,
  "2024-01-01T00:00:00Z",
  "2024-12-31T23:59:59Z"
);
```

#### Maintenance planifiée
```typescript
// Créer une maintenance planifiée
const scheduled = await maintenanceService.createScheduledMaintenance({
  scheduledDate: "2024-02-15T10:00:00Z",
  maintenanceSubject: "Révision 10000 km",
  vehicleId: 1,
  estimatedCost: 50000,
  status: "pending"
});

// Maintenances à venir
const upcoming = await maintenanceService.getUpcomingMaintenances(7);

// Compléter une maintenance planifiée
await maintenanceService.completeScheduledMaintenance(
  scheduledId,
  actualMaintenanceData
);
```

---

### FuelRechargeService - Gestion du Carburant

#### CRUD de base
```typescript
// Créer une recharge
const recharge = await fuelRechargeService.createFuelRecharge({
  rechargeQuantity: 45.5,
  rechargePrice: 22750,
  vehicleId: 1,
  rechargePoint: { type: "Point", coordinates: [3.8480, 11.5021] }
});

// Recharges d'un véhicule
const recharges = await fuelRechargeService.getFuelRechargesByVehicle(vehicleId);

// Dernière recharge
const lastRecharge = await fuelRechargeService.getLastFuelRecharge(vehicleId);
```

#### Statistiques
```typescript
// Statistiques d'un véhicule
const stats = await fuelRechargeService.getVehicleFuelRechargeStatistics(vehicleId);

// Rapport de consommation
const report = await fuelRechargeService.generateConsumptionReport(
  vehicleId,
  "2024-01-01T00:00:00Z",
  "2024-12-31T23:59:59Z"
);

// Coût total
const totalCost = await fuelRechargeService.calculateTotalFuelCost(
  vehicleId,
  "2024-01-01T00:00:00Z",
  "2024-12-31T23:59:59Z"
);
```

#### Analyse
```typescript
// Consommation moyenne (L/100km)
const avgConsumption = await fuelRechargeService.calculateAverageConsumption(
  vehicleId,
  "2024-01-01T00:00:00Z",
  "2024-01-31T23:59:59Z"
);

// Tendances
const trends = await fuelRechargeService.getFuelConsumptionTrends(
  vehicleId,
  "2024-01-01T00:00:00Z",
  "2024-12-31T23:59:59Z",
  'day' // ou 'week', 'month'
);
```

---

### NotificationService - Gestion des Notifications

#### Récupération
```typescript
// Notifications d'un utilisateur
const notifications = await notificationService.getNotificationsByUser(userId);

// Non lues
const unread = await notificationService.getUnreadNotifications(userId);

// Récentes
const recent = await notificationService.getRecentNotifications(userId, 10);

// Par type
const maintenance = await notificationService.getNotificationsByType(
  NotificationType.MAINTENANCE,
  userId
);
```

#### Gestion de l'état
```typescript
// Marquer comme lue
await notificationService.markAsRead(notificationId);

// Marquer toutes comme lues
await notificationService.markAllAsRead(userId);

// Compter les non lues
const unreadCount = await notificationService.countUnreadNotifications(userId);
```

#### Création de notifications
```typescript
// Notification générique
await notificationService.createNotification({
  notificationSubject: "Alerte",
  notificationContent: "Message de l'alerte",
  userId: 1
});

// Alertes spécifiques
await notificationService.createMaintenanceAlert(userId, vehicleId, "Vidange");
await notificationService.createLowFuelAlert(userId, vehicleId, 15);
await notificationService.createSpeedingAlert(userId, vehicleId, 120, 90);
await notificationService.createTripNotification(userId, tripId, 'completed');
```

#### Statistiques
```typescript
// Statistiques
const stats = await notificationService.getNotificationStatistics(userId);
// Retourne: { total, unread, read, byType }
```

---

## Bonnes Pratiques

### 1. Gestion des erreurs
```typescript
try {
  const vehicle = await vehicleService.getVehicleById(1);
  console.log(vehicle);
} catch (error) {
  console.error('Erreur:', error);
  // Afficher un message à l'utilisateur
}
```

### 2. Utilisation avec React (useState/useEffect)
```typescript
import { useState, useEffect } from 'react';
import { vehicleService } from '@/lib/services';

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const data = await vehicleService.getAllVehicles();
        setVehicles(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchVehicles();
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <ul>
      {vehicles.map(v => (
        <li key={v.vehicleId}>{v.vehicleName}</li>
      ))}
    </ul>
  );
}
```

### 3. Pagination
```typescript
const [page, setPage] = useState(0);
const vehicles = await vehicleService.getAllVehiclesPaginated({ 
  page, 
  size: 20 
});
```

### 4. Filtres
```typescript
const vehicles = await vehicleService.searchVehicles({
  vehicleType: "SUV",
  minFuelLevel: 50,
  userId: currentUser.userId
});
```

---

## Notes Importantes

1. **Tous les endpoints sont supposés** - Ajuste-les selon ton API Spring Boot réelle
2. **Token d'authentification** - Pas encore géré automatiquement dans `api.ts`
3. **Gestion des erreurs** - Centralisée dans `api.ts` mais aussi dans chaque service
4. **Types TypeScript** - Tous typés grâce aux types créés précédemment

---

## Prochaines Étapes

1. Créer des **hooks personnalisés** React pour simplifier l'utilisation
2. Ajouter la **gestion automatique des tokens** dans `api.ts`
3. Implémenter le **WebSocket** pour les mises à jour en temps réel
4. Créer des **composants React** réutilisables

---

## Support

Pour toute question ou problème, consulte la documentation Spring Boot de ton API ou contacte l'équipe backend.