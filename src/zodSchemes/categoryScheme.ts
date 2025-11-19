import z from "zod";

export const CategoryScheme = z.object({
    name: z.string().min(2, "Nome é obrigatório").max(100),
    description: z.string().max(255, "Descrição pode ter no máximo 255 caracteres").optional(),
})

export const CategoryUpdateScheme = z.object({
    name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(100, "Nome pode ter no máximo 100 caracteres").optional(),
    description: z.string().max(255, "Descrição pode ter no máximo 255 caracteres").optional(),
})