import z from "zod";

export const UserScheme = z.object({
    id: z.number().optional(),
    name: z.string().min(2).max(100),
    email: z.email(),
    password: z.string().min(8).refine((password) => validatePasswordStrength(password), {
        message: "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
    })
});

export const UserUpdateScheme = z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.email().optional(),
    password: z.string().min(8).refine((password) => validatePasswordStrength(password), {
        message: "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
    }).optional()
});

function validatePasswordStrength(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}