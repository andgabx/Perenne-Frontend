import { z } from "zod";

export const groupSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(1).optional(),
    userId: z.string().min(1),
});

