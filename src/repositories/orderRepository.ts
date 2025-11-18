import {prisma} from "../config/prisma";
import {Order, OrderStatus, PaymentMethod} from "@prisma/client";
import {paginate, PaginatedResult} from "../utils/pagination";

export const OrderRepository = {

    async create(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
        return prisma.order.create({
            data,
        });
    },

    async findPaginated(page: number, pageSize: number): Promise<PaginatedResult<Order>> {
        return paginate(prisma.order, { page, pageSize });
    },

    async findById(id: number): Promise<Order | null> {
        return prisma.order.findUnique({
            where: { id },
        });
    },

    async findByClientIdPaginated(clientId: number, page: number, pageSize: number): Promise<PaginatedResult<Order>> {
        return paginate(
            prisma.order,
            { page, pageSize},
            { clientId }
        );
    },

    async update(id: number, data: Partial<Omit<Order, 'id'>>): Promise<Order> {
        return prisma.order.update({
            where: { id },
            data,
        });
    },

    async delete(id: number): Promise<Order> {
        return prisma.order.delete({
            where: { id },
        });
    }
};

export default OrderRepository;