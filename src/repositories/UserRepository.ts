import { prisma } from "../config/prisma";
import { User } from "@prisma/client";

const UserRepository = {
    async createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
        return prisma.user.create({
            data,
        });
    },

    async getUserById(id: number): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    },

    async getUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    },

    async updateUser(id: number, data: Partial<Omit<User, "id">>): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
        });
    },

    async deleteUser(id: number): Promise<User> {
        return prisma.user.delete({
            where: { id },
        });
    },

    async getUserWithAddresses(id: number): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
            include: { addresses: true },
        });
    }
}

export default UserRepository;