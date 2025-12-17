// ============================================================================
// FICHIER: lib/services/authService.ts
// DESCRIPTION: Service pour gérer l'authentification et la session utilisateur
// ============================================================================

import api from '../api';
import { User } from '@/app/types';
import { AxiosResponse } from 'axios';

// ============================================================================
// 1. AUTHENTIFICATION
// ============================================================================

/**
 * Récupérer un utilisateur par son email
 *
 * @param email - Email de l'utilisateur
 * @returns Promise avec l'utilisateur
 *
 * Endpoint: GET /users/email/:email
 */
export const getUserByEmail = async (email: string): Promise<User> => {
  try {
    // Encoder l'email pour l'URL (remplace @ et . par leurs codes)
    const encodedEmail = encodeURIComponent(email);
    console.log('Requête getUserByEmail avec email encodé:', encodedEmail);
    const response: AxiosResponse<User> = await api.get(`/users/email/${encodedEmail}`);
    console.log('Réponse getUserByEmail:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur avec l'email ${email}:`, error);
    throw error;
  }
};

/**
 * Vérifier le mot de passe d'un utilisateur
 *
 * @param userId - ID de l'utilisateur
 * @param password - Mot de passe à vérifier
 * @returns Promise<boolean> - true si le mot de passe est correct
 *
 * Endpoint: POST /users/:userId/verify-password
 */
export const verifyPassword = async (userId: number, password: string): Promise<boolean> => {
  try {
    console.log('Requête verifyPassword - userId:', userId);
    console.log('URL complète:', `/users/${userId}/verify-password`);
    console.log('Mot de passe envoyé (string directe):', password);
    
    // IMPORTANT: Le backend Spring Boot attend une STRING directe, pas un objet { password: "..." }
    const response: AxiosResponse = await api.post(
      `/users/${userId}/verify-password`,
      password  // Envoyer directement la string, pas un objet
    );
    
    console.log('Réponse complète verifyPassword:', {
      status: response.status,
      headers: response.headers,
      data: response.data,
      dataType: typeof response.data
    });

    // Le backend peut renvoyer directement un boolean ou un objet avec un champ
    // Gérer les différents formats de réponse
    let isValid: boolean;
    
    if (typeof response.data === 'boolean') {
      isValid = response.data;
    } else if (typeof response.data === 'object' && response.data !== null) {
      // Si c'est un objet, chercher un champ comme "valid", "isValid", "result", etc.
      isValid = response.data.valid ?? response.data.isValid ?? response.data.result ?? false;
    } else if (typeof response.data === 'string') {
      // Si c'est une string "true" ou "false"
      isValid = response.data.toLowerCase() === 'true';
    } else {
      console.warn('Format de réponse inattendu:', response.data);
      isValid = false;
    }

    console.log('Résultat final de verifyPassword:', isValid);
    return isValid;
    
  } catch (error: any) {
    console.error('Erreur lors de la vérification du mot de passe:', error);
    
    if (error.response) {
      console.error('Détails de l\'erreur:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });
      
      // Si le serveur répond avec un 200 mais data=false, ce n'est pas une erreur
      if (error.response.status === 200) {
        console.log('Status 200 reçu, vérification des données...');
        return false;
      }
      
      // Pour les autres erreurs HTTP
      const serverMessage = error.response.data?.message || error.response.data || 'Erreur serveur';
      throw new Error(String(serverMessage));
    }

    // Erreur réseau
    console.error('Erreur réseau lors de la vérification du mot de passe:', error.message);
    throw new Error('Erreur de connexion au serveur');
  }
};

/**
 * Connexion d'un utilisateur
 *
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe
 * @returns Promise avec l'utilisateur si les identifiants sont corrects
 */
export const login = async (email: string, password: string): Promise<User> => {
  try {
    console.log('═══════════════════════════════════════════════');
    console.log('🔐 DÉBUT DE LA CONNEXION');
    console.log('Email:', email);
    console.log('═══════════════════════════════════════════════');

    // 1. Récupérer l'utilisateur par email
    console.log('📧 Étape 1: Récupération de l\'utilisateur par email...');
    const user = await getUserByEmail(email);

    if (!user || !user.userId) {
      console.error('❌ Utilisateur non trouvé');
      throw new Error('Utilisateur non trouvé');
    }

    console.log('✅ Utilisateur trouvé:', {
      userId: user.userId,
      userName: user.userName,
      email: user.userEmail
    });

    // 2. Vérifier le mot de passe avec l'ID récupéré
    console.log('🔑 Étape 2: Vérification du mot de passe...');
    console.log('userId utilisé:', user.userId);
    
    const isPasswordValid = await verifyPassword(user.userId, password);

    console.log('Résultat de la vérification:', isPasswordValid);

    if (!isPasswordValid) {
      console.error('❌ Mot de passe incorrect');
      throw new Error('Mot de passe incorrect');
    }

    console.log('✅ Mot de passe correct');
    console.log('═══════════════════════════════════════════════');
    console.log('🎉 CONNEXION RÉUSSIE pour:', user.userName);
    console.log('═══════════════════════════════════════════════');

    // 3. Sauvegarder la session dans localStorage
    saveSession(user);

    return user;
  } catch (error: any) {
    console.error('═══════════════════════════════════════════════');
    console.error('❌ ERREUR LORS DE LA CONNEXION');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('═══════════════════════════════════════════════');
    
    // Re-throw l'erreur avec un message plus clair
    if (error.response?.status === 404) {
      throw new Error('Utilisateur non trouvé');
    }
    throw error;
  }
};

// ============================================================================
// 2. GESTION DE SESSION
// ============================================================================

const SESSION_KEY = 'fleetman_session';

/**
 * Sauvegarder la session utilisateur dans localStorage
 */
export const saveSession = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    console.log('💾 Session sauvegardée');
  }
};

/**
 * Récupérer la session utilisateur depuis localStorage
 */
export const getSession = (): User | null => {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        return JSON.parse(session) as User;
      } catch (error) {
        console.error('Erreur lors de la lecture de la session:', error);
        return null;
      }
    }
  }
  return null;
};

/**
 * Supprimer la session utilisateur (déconnexion)
 */
export const clearSession = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
    console.log('🚪 Session supprimée');
  }
};

/**
 * Vérifier si un utilisateur est connecté
 */
export const isAuthenticated = (): boolean => {
  return getSession() !== null;
};

/**
 * Déconnexion de l'utilisateur
 */
export const logout = (): void => {
  clearSession();
  // Redirection vers la page de connexion
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

// ============================================================================
// 3. EXPORT DU SERVICE
// ============================================================================

const authService = {
  getUserByEmail,
  verifyPassword,
  login,
  logout,
  saveSession,
  getSession,
  clearSession,
  isAuthenticated,
};

export default authService;