import { z } from "zod";

export const postSchema = z.object({
    title: z
        .string()
        .min(2, { message: "O título deve ter pelo menos 2 caracteres" }),
    content: z.string().optional(),
    image: z.string().optional(),
});

export type Post = z.infer<typeof postSchema>;
