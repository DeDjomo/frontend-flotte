// ============================================================================
// FICHIER: lib/api.ts
// DESCRIPTION: Configuration centrale du client HTTP pour communiquer avec l'API Spring Boot
// ============================================================================

// Import d'axios - bibliothèque pour faire des requêtes HTTP
import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// ============================================================================
// 1. CONFIGURATION DE BASE
// ============================================================================

/**
 * Création d'une instance axios personnalisée
 * 
 * Au lieu d'utiliser axios directement (axios.get, axios.post...),
 * on crée notre propre instance avec une configuration par défaut.
 * 
 * Avantages:
 * - Tous les appels utiliseront automatiquement la même baseURL
 * - On peut ajouter des intercepteurs (middleware)
 * - Configuration centralisée, facile à modifier
 */
const api: AxiosInstance = axios.create({
  // baseURL: URL de base de l'API (vient du fichier .env.local)
  // Toutes les requêtes seront préfixées par cette URL
  // Exemple: api.get('/vehicles') → http://localhost:9080/api/vehicles
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9080/api',
  
  // timeout: Temps maximum d'attente pour une réponse (en millisecondes)
  // Si l'API ne répond pas après 10 secondes, la requête échoue
  timeout: 10000, // 10 secondes
  
  // headers: En-têtes HTTP envoyés avec chaque requête
  headers: {
    // Indique au serveur qu'on envoie du JSON
    'Content-Type': 'application/json',
    
    // Indique au serveur qu'on accepte du JSON en retour
    'Accept': 'application/json',
  },
});

// ============================================================================
// 2. INTERCEPTEUR DE REQUÊTES (Request Interceptor)
// ============================================================================

/**
 * Les intercepteurs sont comme des "middleware" - du code qui s'exécute
 * automatiquement avant chaque requête ou après chaque réponse.
 * 
 * INTERCEPTEUR DE REQUÊTE:
 * S'exécute AVANT que la requête soit envoyée au serveur
 * 
 * Cas d'usage typiques:
 * - Ajouter un token d'authentification
 * - Logger les requêtes pour le debug
 * - Modifier les headers
 * - Ajouter un timestamp
 */
api.interceptors.request.use(
  // Fonction appelée si la configuration de la requête est valide
  (config: InternalAxiosRequestConfig) => {
    // Log de debug pour voir quelle requête part
    // Utile pendant le développement
    console.log(`Requête ${config.method?.toUpperCase()} vers: ${config.url}`);
    
    // TODO: Quand tu ajouteras l'authentification, c'est ici que tu ajouteras le token
    // Exemple futur:
    // const token = localStorage.getItem('authToken');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    // On retourne la config (éventuellement modifiée)
    // pour que la requête continue son chemin
    return config;
  },
  
  // Fonction appelée si la configuration de la requête est invalide
  (error: AxiosError) => {
    // Log de l'erreur
    console.error('Erreur dans la configuration de la requête:', error);
    
    // Rejette la promesse pour que l'erreur soit catchable
    // dans le code qui a fait l'appel API
    return Promise.reject(error);
  }
);

// ============================================================================
// 3. INTERCEPTEUR DE RÉPONSES (Response Interceptor)
// ============================================================================

/**
 * INTERCEPTEUR DE RÉPONSE:
 * S'exécute APRÈS que le serveur ait répondu
 * 
 * Cas d'usage typiques:
 * - Gérer les erreurs de manière centralisée
 * - Logger les réponses
 * - Transformer les données
 * - Gérer le refresh de token
 * - Rediriger en cas d'erreur 401 (non authentifié)
 */
api.interceptors.response.use(
  // Fonction appelée si la réponse est un succès (status 2xx)
  (response: AxiosResponse) => {
    // Log de succès
    console.log(`Réponse reçue de: ${response.config.url}`);
    
    // On retourne la réponse telle quelle
    // Les composants recevront response.data
    return response;
  },
  
  // Fonction appelée si la réponse est une erreur (status 4xx, 5xx)
  (error: AxiosError) => {
    // Gestion centralisée des erreurs
    handleApiError(error);
    
    // Rejette la promesse pour que l'erreur soit catchable
    return Promise.reject(error);
  }
);

// ============================================================================
// 4. FONCTION DE GESTION DES ERREURS
// ============================================================================

/**
 * Fonction utilitaire pour gérer les erreurs API de manière centralisée
 * 
 * @param error - L'erreur Axios capturée
 * 
 * Cette fonction analyse l'erreur et affiche des messages appropriés.
 * Tu peux aussi l'utiliser pour:
 * - Afficher des notifications toast
 * - Logger dans un service de monitoring (Sentry, LogRocket...)
 * - Rediriger l'utilisateur
 */
function handleApiError(error: AxiosError): void {
  // error.response existe si le serveur a répondu avec un status code d'erreur
  if (error.response) {
    // Le serveur a répondu avec un status code hors de la plage 2xx
    const status = error.response.status;
    const data = error.response.data;
    
    console.error(`Erreur API [${status}]:`, data);
    
    // Gestion par code de statut HTTP
    switch (status) {
      case 400:
        // Bad Request - Données invalides
        console.error('Données envoyées invalides');
        break;
        
      case 401:
        // Unauthorized - Non authentifié
        console.error('Non authentifié - Connexion requise');
        // TODO: Rediriger vers la page de login
        // router.push('/login');
        break;
        
      case 403:
        // Forbidden - Pas les permissions
        console.error('Accès refusé - Permissions insuffisantes');
        break;
        
      case 404:
        // Not Found - Ressource introuvable
        console.error('Ressource non trouvée');
        break;
        
      case 500:
        // Internal Server Error - Erreur serveur
        console.error('Erreur serveur - Veuillez réessayer plus tard');
        break;
        
      case 503:
        // Service Unavailable - Service indisponible
        console.error('Service temporairement indisponible');
        break;
        
      default:
        console.error(`Erreur ${status}`);
    }
  } 
  // error.request existe si la requête a été envoyée mais aucune réponse reçue
  else if (error.request) {
    // Pas de réponse du serveur (timeout, problème réseau, serveur éteint...)
    console.error('Pas de réponse du serveur:', error.request);
    console.error('Le serveur ne répond pas. Vérifiez votre connexion ou que le serveur est démarré.');
  } 
  // Erreur lors de la configuration de la requête
  else {
    console.error('Erreur lors de la configuration de la requête:', error.message);
  }
}

// ============================================================================
// 5. FONCTIONS UTILITAIRES (Optionnelles mais pratiques)
// ============================================================================

/**
 * Fonction helper pour extraire les données d'une réponse
 * Simplifie l'utilisation dans les services
 * 
 * Au lieu de: const response = await api.get('/vehicles'); const data = response.data;
 * Tu peux faire: const data = await getData(api.get('/vehicles'));
 */
export async function getData<T>(promise: Promise<AxiosResponse<T>>): Promise<T> {
  const response = await promise;
  return response.data;
}

/**
 * Fonction helper pour vérifier si le serveur est accessible
 * Utile pour afficher un message d'erreur au démarrage de l'app
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    // Tente de faire une requête simple au serveur
    await api.get('/health'); // Tu devras créer ce endpoint dans Spring Boot
    console.log('Connexion au serveur réussie');
    return true;
  } catch (error) {
    console.error('Impossible de se connecter au serveur');
    return false;
  }
}

// ============================================================================
// 6. EXPORT
// ============================================================================

/**
 * Export de l'instance axios configurée
 * C'est cette instance que tous tes services utiliseront
 * 
 * Utilisation dans les services:
 * import api from '@/lib/api';
 * const response = await api.get('/vehicles');
 */
export default api;

// Export aussi des helpers
export { handleApiError };

// ============================================================================
// EXEMPLES D'UTILISATION
// ============================================================================

/**
 * EXEMPLE 1: Utilisation directe dans un composant (pas recommandé, mais possible)
 * 
 * import api from '@/lib/api';
 * 
 * async function fetchVehicles() {
 *   try {
 *     const response = await api.get('/vehicles');
 *     console.log(response.data);
 *   } catch (error) {
 *     console.error('Erreur:', error);
 *   }
 * }
 */

/**
 * EXEMPLE 2: Utilisation avec la fonction helper getData
 * 
 * import api, { getData } from '@/lib/api';
 * 
 * async function fetchVehicles() {
 *   try {
 *     const vehicles = await getData(api.get('/vehicles'));
 *     console.log(vehicles);
 *   } catch (error) {
 *     console.error('Erreur:', error);
 *   }
 * }
 */

/**
 * EXEMPLE 3: Utilisation recommandée via un service (on verra ça après)
 * 
 * import { vehicleService } from '@/lib/services/vehicleService';
 * 
 * async function fetchVehicles() {
 *   try {
 *     const vehicles = await vehicleService.getAll();
 *     console.log(vehicles);
 *   } catch (error) {
 *     console.error('Erreur:', error);
 *   }
 * }
 */