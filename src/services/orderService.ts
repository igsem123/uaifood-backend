import orderRepository from "../repositories/orderRepository";
import orderItemRepository from "../repositories/orderItemRepository";
import {itemRepository} from "../repositories/itemRepository";
import {injectable} from "tsyringe";
import {Order, OrderItem} from "@prisma/client";
import {CreateOrderScheme, OrderUpdateScheme} from "../zodSchemes/orderScheme";

@injectable()
export class OrderService {
    createOrder = async (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> & { items: Omit<OrderItem, 'id' | 'orderId' | 'createdAt' | 'updatedAt'>[] }): Promise<Order> => {
        CreateOrderScheme.parse(data);
        const {items, ...orderData} = data;
        const order = await orderRepository.create(orderData);
        for (const item of items) {
            await this.addItem(order.id, item);
        }
        return order;
    }

    getOrdersPaginated = async (page: number, pageSize: number) => {
        return await orderRepository.findPaginated(page, pageSize);
    }

    getOrdersByClientId = async (clientId: number, page: number, pageSize: number) => {
        return await orderRepository.findByClientIdPaginated(clientId, page, pageSize);
    }

    getOrderById = async (id: number): Promise<Order | null> => {
        return await orderRepository.findById(id);
    }

    addItem = async(orderId: bigint, data: { itemId: bigint; quantity: number }) => {
        const item = await itemRepository.findById(Number(data.itemId));

        if (!item) throw new Error('Item not found');

        const unitPrice = item.unitPrice;
        const subtotal = unitPrice.mul(data.quantity);

        return orderItemRepository.create({
                orderId,
                itemId: data.itemId,
                quantity: data.quantity,
                unitPrice,
                subtotal,
        });
    }

    updateOrder = async (id: number, data: Partial<Omit<Order, 'id'>>): Promise<Order> => {
        OrderUpdateScheme.parse(data);
        return await orderRepository.update(id, data);
    }

    deleteOrder = async (id: number): Promise<Order> => {
        return await orderRepository.delete(id);
    }
}