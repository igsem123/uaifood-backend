import z from 'zod';

export const CreateAddressScheme = z.object({
    userId: z.bigint({message: "ID do usuário é obrigatório"}),
    street: z.string().min(1, "Rua é obrigatória"),
    number: z.string().min(1, "Número é obrigatório"),
    district: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(1, "Estado é obrigatório"),
    zipCode: z.string().min(1, "CEP é obrigatório"),
});

export const UpdateAddressScheme = CreateAddressScheme.partial().extend({
    userId: z.bigint(),
});