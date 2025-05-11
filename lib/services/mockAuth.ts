'use client';

// Tokens JWT de exemplo (apenas para testes)
const MOCK_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNjE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
const MOCK_REFRESH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzE2MjM5MDIyfQ.dKoUjUWMmZDHnYmpdBhGNI5KqjPFLnOOxGHqNbshNyQ';

// Dados de usuário simulados
const MOCK_USER = {
  id: '1',
  name: 'Usuário Teste',
  email: 'teste123@gmail.com',
  role: 'admin'
};

// Simula o tempo de expiração para o token de acesso (30 segundos para teste)
const TOKEN_EXPIRATION_TIME = 30 * 1000; // 30 segundos em milissegundos

class MockAuthAPI {
  private accessTokenExpiration: number | null = null;
  
  constructor() {
    // Inicializa sem expiração de token
    this.accessTokenExpiration = null;
  }
  
  // Simula o endpoint de login
  async login(email: string, password: string) {
    // Simula atraso de chamada API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Validação simples
    if (email === 'teste123@gmail.com' && password === 'senha123') {
      this.setTokenExpiration();
      
      return {
        accessToken: MOCK_ACCESS_TOKEN,
        refreshToken: MOCK_REFRESH_TOKEN,
        user: MOCK_USER
      };
    }
    
    // Simula resposta de erro
    throw new Error('Credenciais inválidas');
  }
  
  // Simula o endpoint de atualização de token
  async refreshToken(token: string | null) {
    // Simula atraso de chamada API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!token) {
      throw new Error('Nenhum token de atualização fornecido');
    }
    
    // Verifica se o token de atualização é válido
    if (token === MOCK_REFRESH_TOKEN) {
      this.setTokenExpiration();
      
      return {
        accessToken: MOCK_ACCESS_TOKEN,
        refreshToken: MOCK_REFRESH_TOKEN
      };
    }
    
    throw new Error('Token de atualização inválido');
  }
  
  // Simula chamada API protegida
  async getProtectedData() {
    // Simula atraso de chamada API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!this.isTokenExpired()) {
      return {
        success: true,
        data: {
          message: 'Estes são dados protegidos!',
          timestamp: new Date().toISOString()
        }
      };
    }
    
    throw {
      response: {
        status: 401,
        data: { message: "Não autorizado - Token expirado" }
      }
    };
  }
  
  // Simula validação de token
  isTokenExpired(): boolean {
    if (!this.accessTokenExpiration) return true;
    return Date.now() >= this.accessTokenExpiration;
  }
  
  // Define o tempo de expiração para testes
  private setTokenExpiration() {
    this.accessTokenExpiration = Date.now() + TOKEN_EXPIRATION_TIME;
    console.log('O token expirará às:', new Date(this.accessTokenExpiration).toLocaleTimeString());
  }
  
  // Obtém o tempo restante
  getTokenExpirationTime(): number {
    if (!this.accessTokenExpiration) return 0;
    return Math.max(0, this.accessTokenExpiration - Date.now());
  }
}

export const mockAuthAPI = new MockAuthAPI();