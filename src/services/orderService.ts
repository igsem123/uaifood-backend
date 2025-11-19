import orderRepository from "../repositories/orderRepository";
import orderItemRepository from "../repositories/orderItemRepository";
import {itemRepository} from "../repositories/itemRepository";
import {injectable, inject} from "tsyringe";
import {Order, OrderItem} from "@prisma/client";
import {CreateOrderScheme, OrderUpdateScheme} from "../zodSchemes/orderScheme";
import {NotificationService} from "./notificationService";
import userRepository from "../repositories/userRepository";

@injectable()
export class OrderService {
    constructor(@inject(NotificationService) private notificationService: NotificationService) {}

    createOrder = async (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> & { items: Omit<OrderItem, 'id' | 'orderId' | 'createdAt' | 'updatedAt'>[] }): Promise<Order> => {
        CreateOrderScheme.parse(data);
        const {items, ...orderData} = data;

        const order = await orderRepository.create(orderData);
        for (const item of items) {
            await this.addItem(order.id, item);
        }

        const admins = await userRepository.findAdmins();
        for (const admin of admins) {
            await this.notificationService.createAndEmit(admin.id, {
                title: 'Novo Pedido Recebido',
                body: `Um novo pedido #${order.id} foi feito pelo cliente #${order.clientId}.`,
                data: {orderId: Number(order.id), clientId: Number(order.clientId)},
                userId: admin.id,
            });
        }

        return order;
    }

    getOrdersPaginated = async (page: number, pageSize: number) => {
        return await orderRepository.findPaginated(page, pageSize);
    }

    getOrdersByClientId = async (clientId: bigint, page: number, pageSize: number) => {
        return await orderRepository.findByClientIdPaginated(clientId, page, pageSize);
    }

    getOrderById = async (orderId: bigint, userId: bigint): Promise<Order | null> => {
        return await orderRepository.findById(orderId, userId);
    }

    addItem = async(orderId: bigint, data: { itemId: bigint; quantity: number }) => {
        const item = await itemRepository.findById(Number(data.itemId));

        if (!item) throw new Error('Item não encontrado');

        const unitPrice = item.unitPrice;
        const subtotal = unitPrice.mul(data.quantity);

        return orderItemRepository.create({
                orderId,
                itemId: BigInt(data.itemId),
                quantity: data.quantity,
                unitPrice,
                subtotal,
        });
    }

    updateOrder = async (orderId: bigint, data: Partial<Omit<Order, 'id'>>): Promise<Order> => {
        OrderUpdateScheme.parse(data);

        await this.notificationService.createAndEmit(BigInt(data.clientId || 0), {
            title: 'Pedido Atualizado',
            body: `Seu pedido #${orderId} foi atualizado.`,
            data: {orderId: Number(orderId)},
            userId: BigInt(data.clientId || 0),
        });

        return await orderRepository.update(orderId, data);
    }

    deleteOrder = async (id: bigint): Promise<Order> => {
        return await orderRepository.delete(id);
    }
}