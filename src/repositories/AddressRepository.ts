import { Address } from '@prisma/client';
import {prisma} from "../config/prisma";

export const AddressRepository = {
    async createAddress(data: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> {
        return prisma.address.create({
            data,
        });
    },

    /*async updateAddress(data: Omit<Address, 'id' | 'updatedAt' | 'name'>): Promise<Address> {
        return prisma.address.update({
            where: { userId: data.id },
            data,
        });
    }*/
}