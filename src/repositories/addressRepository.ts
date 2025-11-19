import { Address } from '@prisma/client';
import {prisma} from "../config/prisma";

export const AddressRepository = {
    async createAddress(data: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> {
        return prisma.address.create({
            data,
        });
    },

    async updateAddress(userId: bigint, addressId: bigint, data: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> {
        return prisma.address.update({
            where: { id: addressId },
            data: {
                ...data,
                userId: userId,
            }
        });
    },

    async deleteAddress(addressId: bigint, userId: bigint): Promise<Address> {
        return prisma.address.delete({
            where: { id: addressId, userId: userId },
        });
    }
}