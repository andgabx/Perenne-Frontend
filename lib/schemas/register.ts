import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(1).max(100),
  secondName: z.string().min(1).max(100),
  CPF: z.string().length(11),
  email: z.string().email().min(6),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  acceptTerms: z.boolean(),
});