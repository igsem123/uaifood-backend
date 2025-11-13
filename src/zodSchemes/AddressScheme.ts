import z from 'zod';

export const AddressScheme = z.object({
    id: z.number().optional(),
    userId: z.number(),
    street: z.string().min(1, "Street is required"),
    number: z.string().min(1, "Number is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip Code is required"),
    country: z.string().min(1, "Country is required"),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export const CreateAddressScheme = AddressScheme.omit({ id: true, createdAt: true, updatedAt: true });

export const UpdateAddressScheme = AddressScheme.partial().omit({ id: true, createdAt: true, updatedAt: true });