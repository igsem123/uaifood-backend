import z from "zod";

export const UserScheme = z.object({
    id: z.number().optional(),
    name: z.string().min(2).max(100),
    email: z.email(),
    password: z.string().min(8).refine((password) => validatePasswordStrength(password), {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    })
});

export const UserUpdateScheme = z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.email().optional(),
    password: z.string().min(8).refine((password) => validatePasswordStrength(password), {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }).optional()
});

function validatePasswordStrength(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}