import { PrismaClient } from '@prisma/client';

// Adiciona suporte a BigInt na serialização JSON
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export const prisma = new PrismaClient();