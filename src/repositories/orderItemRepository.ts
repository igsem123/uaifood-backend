import {prisma} from "../config/prisma";
import {OrderItem} from "@prisma/client";

export const OrderItemRepository = {
    async create(data: Omit<OrderItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrderItem> {
        return prisma.orderItem.create({
            data,
        });
    },
    async findById(id: number): Promise<OrderItem | null> {
        return prisma.orderItem.findUnique({
            where: { id },
        });
    },
    async findByOrderId(orderId: number): Promise<OrderItem[]> {
        return prisma.orderItem.findMany({
            where: { orderId },
        });
    },
    async update(id: number, data: Partial<Omit<OrderItem, 'id'>>): Promise<OrderItem> {
        return prisma.orderItem.update({
            where: { id },
            data,
        });
    },
    async delete(id: number): Promise<OrderItem> {
        return prisma.orderItem.delete({
            where: { id },
        });
    }
};

export default OrderItemRepository;