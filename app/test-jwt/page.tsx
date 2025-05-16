"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../components/AuthProvider";
import { mockAuthAPI } from "../../lib/services/mockAuth";
import { authService } from "../../lib/services/auth";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import useRefreshToken from "../../hooks/useRefreshToken";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";

export default function TestJWTPage() {
  const [email, setEmail] = useState("teste123@gmail.com");
  const [password, setPassword] = useState("senha123");
  const [testApiResponse, setTestApiResponse] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const { auth, login, logout } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const refresh = useRefreshToken();

  // Simulação de login
  const handleLogin = async () => {
    try {
      const response = await authService.login({ email, password });
      login(response.accessToken, response.refreshToken, response.user);
      setTestApiResponse("Login realizado com sucesso");
    } catch (error) {
      setTestApiResponse("Falha no login: " + (error as Error).message);
    }
  };

  // Simulação de contagem regressiva para expiração do token
  useEffect(() => {
    if (!auth.accessToken) {
      setCountdown(0);
      return;
    }

    const timer = setInterval(() => {
      const remaining = mockAuthAPI.getTokenExpirationTime();
      setCountdown(Math.ceil(remaining / 1000));

      // Quando o token expirar, atualiza a interface
      if (remaining <= 0) {
        setTestApiResponse(
          "Token expirado. Tente fazer uma chamada API para testar a atualização."
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auth.accessToken]);

  // Simulação de chamada API protegida
  const makeProtectedApiCall = async () => {
    try {
      setTestApiResponse("Fazendo chamada API protegida...");
      // Usa authService em vez de chamada axiosPrivate direta
      const response = await authService.getProtectedData();
      setTestApiResponse(
        "Chamada API protegida com sucesso: " + JSON.stringify(response)
      );
    } catch (error: any) {
      setTestApiResponse(
        "Falha na chamada API: " + (error.response?.data?.message || error.message)
      );
    }
  };

  // Forçar atualização de token
  const handleForceRefresh = async () => {
    try {
      setTestApiResponse("Atualizando token...");
      const newToken = await refresh();
      setTestApiResponse(
        "Token atualizado com sucesso: " + newToken.substring(0, 10) + "..."
      );
    } catch (error) {
      setTestApiResponse("Falha na atualização do token: " + (error as Error).message);
    }
  };

  // Buscar perfil do usuário
  const getUserProfile = async () => {
    try {
      setTestApiResponse("Buscando perfil do usuário...");
      const userData = await authService.getCurrentUser();
      setTestApiResponse("Perfil do usuário: " + JSON.stringify(userData));
    } catch (error: any) {
      setTestApiResponse(
        "Falha ao buscar perfil do usuário: " + (error.response?.data?.message || error.message)
      );
    }
  };

  // Verificar status do token
  const checkTokenExpiration = () => {
    const isExpired = mockAuthAPI.isTokenExpired();
    setTestApiResponse(`O token está ${isExpired ? "expirado" : "válido"}`);
  };

  // Verificar localStorage
  const checkLocalStorage = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const user = localStorage.getItem("user");

    setTestApiResponse(
      `LocalStorage contém:
       - Token de Acesso: ${accessToken ? "Sim" : "Não"}
       - Token de Atualização: ${refreshToken ? "Sim" : "Não"}
       - Dados do Usuário: ${user ? "Sim" : "Não"}`
    );
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Página de Testes JWT</h1>

      <Card className="p-6 max-w-xl mx-auto my-8">
        <h2 className="text-2xl font-bold mb-4">Teste de Autenticação JWT</h2>

        {!auth.accessToken ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Login para Testar</h3>
            <div>
              <label className="block mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block mb-1">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
              />
            </div>
            <Button onClick={handleLogin}>Login</Button>
            <p className="text-sm text-gray-500">
              Dica: Use teste123@gmail.com / senha123
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-card p-3 rounded">
              <p>
                <strong>Status:</strong> Autenticado
              </p>
              <p>
                <strong>Usuário:</strong> {auth.user?.name} ({auth.user?.email})
              </p>
              <p>
                <strong>Token expira em:</strong> {countdown} segundos
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={makeProtectedApiCall}>
                Fazer Chamada API Protegida
              </Button>
              <Button onClick={handleForceRefresh} variant="outline">
                Forçar Atualização de Token
              </Button>
              <Button onClick={getUserProfile} variant="outline">
                Buscar Perfil do Usuário
              </Button>
              <Button onClick={checkTokenExpiration} variant="outline">
                Verificar Status do Token
              </Button>
              <Button onClick={checkLocalStorage} variant="outline">
                Verificar localStorage
              </Button>
              <Button onClick={logout} variant="destructive">
                Logout
              </Button>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Resultados dos Testes</h3>
              <div className="bg-card p-3 rounded whitespace-pre-wrap">
                {testApiResponse || "Nenhuma chamada API realizada ainda"}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Tokens Atuais</h3>
              <details className="text-xs">
                <summary className="cursor-pointer">Token de Acesso</summary>
                <pre className="bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                  {auth.accessToken}
                </pre>
              </details>
              <details className="text-xs mt-2">
                <summary className="cursor-pointer">Token de Atualização</summary>
                <pre className="bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                  {auth.refreshToken}
                </pre>
              </details>
              <details className="text-xs mt-2">
                <summary className="cursor-pointer">Dados do Usuário</summary>
                <pre className="bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                  {JSON.stringify(auth.user, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <h3 className="font-semibold">Instruções de Teste:</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Faça login com as credenciais de teste</li>
            <li>Aguarde o token expirar (30 segundos)</li>
            <li>
              Tente fazer uma chamada API protegida - ela deve atualizar o token
              automaticamente
            </li>
            <li>Use "Forçar Atualização de Token" para atualizar manualmente</li>
            <li>Verifique o status do token e o localStorage</li>
            <li>Faça logout para limpar os tokens</li>
          </ol>
        </div>
      </Card>
    </div>
  );
}