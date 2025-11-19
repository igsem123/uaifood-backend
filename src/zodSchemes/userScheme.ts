import z from "zod";

export const UserScheme = z.object({
    id: z.number().optional(),
    name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }).max(100, { message: 'Nome deve ter no máximo 100 caracteres' }),
    email: z.email({ message: 'Email inválido' }),
    password: z.string().min(8, { message: 'Senha deve ter pelo menos 8 caracteres' }).refine(validatePasswordStrength, {
        message: 'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
    }),
});

export const UserUpdateScheme = z.object({
    name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }).max(100, { message: 'Nome deve ter no máximo 100 caracteres' }).optional(),
    email: z.email({ message: 'Email inválido' }).optional(),
    password: z.string().min(8, { message: 'Senha deve ter pelo menos 8 caracteres' }).refine(validatePasswordStrength, {
        message: 'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
    }).optional()
});

function validatePasswordStrength(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}