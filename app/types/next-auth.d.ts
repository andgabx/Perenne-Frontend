import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      accessToken?: string;
    } & DefaultSession["user"];
    expires: string | number;
  }

  interface User extends DefaultUser {
    id: string;
    accessToken?: string;
    expiresIn?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    accessToken?: string;
    expiresIn?: number;
  }
}

export type AuthToken = string;
