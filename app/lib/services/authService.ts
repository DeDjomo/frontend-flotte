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
    const encodedEmail = encodeURIComponent(email);
    const response: AxiosResponse<User> = await api.get(`/users/email/${encodedEmail}`);
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
    const response: AxiosResponse = await api.post(
      `/users/${userId}/verify-password`,
      { password }
    );

    // Gérer les différents formats de réponse
    let isValid: boolean;

    if (typeof response.data === 'boolean') {
      isValid = response.data;
    } else if (typeof response.data === 'object' && response.data !== null) {
      isValid = response.data.valid ?? response.data.isValid ?? response.data.result ?? false;
    } else if (typeof response.data === 'string') {
      isValid = response.data.toLowerCase() === 'true';
    } else {
      isValid = false;
    }

    return isValid;

  } catch (error: any) {
    console.error('Erreur lors de la vérification du mot de passe:', error);

    if (error.response) {
      if (error.response.status === 200) {
        return false;
      }
      const serverMessage = error.response.data?.message || error.response.data || 'Erreur serveur';
      throw new Error(String(serverMessage));
    }

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
    const user = await getUserByEmail(email);

    if (!user || !user.userId) {
      throw new Error('Utilisateur non trouvé');
    }

    const isPasswordValid = await verifyPassword(user.userId, password);

    if (!isPasswordValid) {
      throw new Error('Mot de passe incorrect');
    }

    saveSession(user);
    return user;
  } catch (error: any) {
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