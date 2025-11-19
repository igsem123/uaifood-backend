import zod from 'zod';

export const ItemScheme = zod.object({
    name: zod.string({ message: 'Nome é obrigatório' })
        .min(2, { message: 'Nome deve ter ao menos 2 caracteres' })
        .max(100, { message: 'Nome deve ter no máximo 100 caracteres' }),
    description: zod.string({ message: 'Descrição deve ser uma string' })
        .max(255, { message: 'Descrição deve ter no máximo 255 caracteres' })
        .optional(),
    unitPrice: zod.number({ message: 'Preço unitário é obrigatório'})
        .min(0, { message: 'Preço unitário não pode ser negativo' }),
    categoryId: zod.number({ message: 'Categoria é obrigatória' })
        .int({ message: 'Categoria deve ser um número inteiro' })
        .positive({ message: 'Categoria deve ser um número positivo' }),
});

export const ItemUpdateScheme = zod.object({
    name: zod.string({ message: 'Nome deve ser uma string' })
        .min(2, { message: 'Nome deve ter ao menos 2 caracteres' })
        .max(100, { message: 'Nome deve ter no máximo 100 caracteres' })
        .optional(),
    description: zod.string({ message: 'Descrição deve ser uma string' })
        .max(255, { message: 'Descrição deve ter no máximo 255 caracteres' })
        .optional(),
    unitPrice: zod.number({ message: 'Preço unitário deve ser um número' })
        .min(0, { message: 'Preço unitário não pode ser negativo' })
        .optional(),
    categoryId: zod.number({ message: 'Categoria deve ser um número' })
        .int({ message: 'Categoria deve ser um número inteiro' })
        .positive({ message: 'Categoria deve ser um número positivo' })
        .optional(),
});