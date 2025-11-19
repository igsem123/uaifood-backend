import { Category } from "@prisma/client";
import {prisma} from "../config/prisma";

export const CategoryRepository = {
    async create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
        return prisma.category.create({
            data,
        });
    },
    async findAll(): Promise<Category[]> {
        return prisma.category.findMany({
            orderBy: { id: 'asc' }
        });
    },
    async findById(id: number): Promise<Category | null> {
        return prisma.category.findUnique({
            where: { id },
        });
    },
    async findByName(name: string): Promise<Category | null> {
        return prisma.category.findUnique({
            where: { name },
        });
    },
    async update(id: number, data: Omit<Category, 'id' | 'updatedAt'>): Promise<Category> {
        return prisma.category.update({
            where: { id },
            data,
        });
    },
    async delete(id: number): Promise<Category> {
        return prisma.category.delete({
            where: { id },
        });
    }
}