import { Address } from '@prisma/client';
import {prisma} from "../config/prisma";

export const AddressRepository = {
    async createAddress(data: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> {
        return prisma.address.create({
            data,
        });
    },

    async updateAddress(data: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> {
        return prisma.address.update({
            where: { userId_street_number_zipCode: {
                    userId: data.userId,
                    street: data.street,
                    number: data.number,
                    zipCode: data.zipCode
                }
            },
            data,
        });
    },

    async deleteAddress(id: number): Promise<Address> {
        return prisma.address.delete({
            where: { id: id},
        });
    }
}