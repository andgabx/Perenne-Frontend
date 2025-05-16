import NextAuth, { DefaultUser, DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// Interface base do usuário
export interface User extends DefaultUser {
  email: string;
  password?: string; // Opcional pois não deve ser exposto no front
  isValidated: boolean;
  isBanned: boolean;
  firstName: string;
  lastName: string;
  cpf: string;
  role: number;
  dateOfBirth: string | null;
  phoneNumber: string | null;
  address: string | null;
  profilePictureUrl: string | null;
  bio: string | null;
  id: string;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  accessToken?: string;
  expiresIn?: number;
}

// Tipo para o token
export type AuthToken = string;

// Extensão da interface Session
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
    accessToken: AuthToken;
    expires: string;
  }

  interface User extends DefaultUser {
    accessToken?: AuthToken;
    expiresIn?: number;
    // Todos os outros campos já declarados na interface User acima
  }
}

// Extensão da interface JWT
declare module "next-auth/jwt" {
  interface JWT {
    user: User;
    accessToken: AuthToken;
    expiresIn: number;
  }
}