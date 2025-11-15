import z from "zod";

export const CategoryScheme = z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(255).optional(),
})

export const CategoryUpdateScheme = z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(255).optional(),
})