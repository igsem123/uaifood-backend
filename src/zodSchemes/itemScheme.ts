import zod from 'zod';

export const ItemScheme = zod.object({
    name: zod.string().min(2).max(100),
    description: zod.string().max(255).optional(),
    unitPrice: zod.number().min(0),
    categoryId: zod.number().int().positive(),
});

export const ItemUpdateScheme = zod.object({
    name: zod.string().min(2).max(100).optional(),
    description: zod.string().max(255).optional(),
    unitPrice: zod.number().min(0).optional(),
    categoryId: zod.number().int().positive().optional(),
});