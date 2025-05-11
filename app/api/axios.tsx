'use client';

import axios from 'axios';
import { mockAuthAPI } from '../../lib/services/mockAuth';

const BASE_URL = 'http://localhost:3000';

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

// Adiciona interceptores para testes sem backend
axiosPrivate.interceptors.request.use(
    async (config) => {
        // Para fins de teste, verifica a expiração do token antes de fazer requisições
        if (mockAuthAPI.isTokenExpired()) {
            // Isso será capturado pelo interceptor de resposta
            return Promise.reject({
                response: { status: 401 },
                config
            });
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Simula resposta para endpoints específicos
axiosPrivate.interceptors.response.use(
    (response) => {
        // Simula endpoints específicos da API
        if (response.config.url?.includes('/auth/me')) {
            return {
                ...response,
                data: {
                    id: '1',
                    name: 'Usuário Teste',
                    email: 'teste123@gmail.com',
                    role: 'admin'
                }
            };
        }
        
        if (response.config.url?.includes('/protected-data')) {
            return {
                ...response,
                data: {
                    success: true,
                    data: {
                        message: 'Estes são dados protegidos!',
                        timestamp: new Date().toISOString()
                    }
                }
            };
        }
        
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);