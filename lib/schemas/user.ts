import { z } from "zod";

export const UserRole = z.enum(["Admin", "User", "Guest"]); // Vai ser usado ainda

export const userSchema = z.object({ // alguns n estao sendo usados no formulario
    email: z
        .string()
        .min(4, "Email deve ter no mínimo 4 caracteres")
        .max(100, "Email deve ter no máximo 100 caracteres")
        .email("Email inválido"),
    password: z
        .string()
        .min(6, "Senha deve ter no mínimo 6 caracteres")
        .max(100, "Senha deve ter no máximo 100 caracteres"),
    firstName: z
        .string()
        .min(2, "Nome deve ter no mínimo 2 caracteres")
        .max(100, "Nome deve ter no máximo 100 caracteres"),
    lastName: z
        .string()
        .min(2, "Sobrenome deve ter no mínimo 2 caracteres")
        .max(100, "Sobrenome deve ter no máximo 100 caracteres"),
    cpf: z.string().length(11, "CPF deve ter 11 dígitos"),
    dateOfBirth: z.date().nullable(),
    profilePictureUrl: z 
        .string()
        .max(1000, "URL da foto deve ter no máximo 1000 caracteres")
        .nullable(),
    bio: z
        .string()
        .max(3000, "Biografia deve ter no máximo 3000 caracteres")
        .nullable(),
});

export type User = z.infer<typeof userSchema>;
