'use client';

import { axiosPrivate } from '../../app/api/axios';
import { mockAuthAPI } from './mockAuth';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  // Adicione outros campos de registro necessários
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: any; // Substitua pelo seu tipo de usuário
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Para fins de teste, use a API simulada em vez do backend real
    return mockAuthAPI.login(credentials.email, credentials.password);
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    // Simula registro - retorna a mesma resposta que o login para testes
    await new Promise(resolve => setTimeout(resolve, 500)); // Atraso simulado
    return {
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token',
      user: {
        id: '2',
        name: userData.name,
        email: userData.email,
        role: 'user'
      }
    };
  },

  logout: async (): Promise<void> => {
    // Apenas simula um logout sem backend
    await new Promise(resolve => setTimeout(resolve, 300)); // Atraso simulado
  },

  getCurrentUser: async (): Promise<any> => {
    try {
      const response = await axiosPrivate.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Falha ao buscar perfil do usuário:', error);
      throw error;
    }
  },
  
  getProtectedData: async (): Promise<any> => {
    try {
      const response = await axiosPrivate.get('/protected-data');
      return response.data;
    } catch (error) {
      console.error('Falha ao buscar dados protegidos:', error);
      throw error;
    }
  }
};