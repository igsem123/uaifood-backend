import { prisma } from "../config/prisma";
import {User, UserType} from "@prisma/client";

const UserRepository = {
    async createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
        return prisma.user.create({
            data,
        });
    },

    async getUserById(id: bigint): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id }
        });
    },

    async getUserByEmail(email: string, relation?: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
            include: relation ? { [relation]: true } : undefined,
        });
    },

    async updateUser(id: bigint, data: Partial<Omit<User, "id">>): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
        });
    },

    async deleteUser(id: bigint): Promise<User> {
        return prisma.user.delete({
            where: { id },
        });
    },

    async getUserWithRelations(id: bigint, relation: string[]): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
            include: Object.fromEntries(relation.map(rel => [rel, true])),
        });
    },

    async findAdmins(): Promise<User[]> {
        return prisma.user.findMany({
            where: { type: UserType.ADMIN },
            orderBy: { id: 'asc' }
        });
    }
}

export default UserRepository;