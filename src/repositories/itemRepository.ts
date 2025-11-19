import { prisma } from "../config/prisma";
import { Item } from "@prisma/client";

export const itemRepository = {
    async create(data: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> {
        return prisma.item.create({
            data,
        });
    },

    async findById(id: number): Promise<Item | null> {
        return prisma.item.findUnique({
            where: { id },
        });
    },

    async findAll(): Promise<Item[]> {
        return prisma.item.findMany({
                orderBy: { id: 'asc' }
            });
    },

    async update(id: number, data: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> {
        return prisma.item.update({
            where: { id },
            data,
        });
    },

    async delete(id: number): Promise<Item> {
        return prisma.item.delete({
            where: { id },
        });
    }
}