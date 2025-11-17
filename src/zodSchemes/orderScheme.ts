import zod from "zod";
import {OrderStatus, PaymentMethod} from "@prisma/client";

export const CreateOrderScheme = zod.object({
    clientId: zod.number().int().positive(),
    items: zod.array(
        zod.object({
            itemId: zod.number().int().positive(),
            quantity: zod.number().int().positive(),
        })
    ).min(1),
    paymentMethod: zod.enum(PaymentMethod),
});

export const OrderUpdateScheme = zod.object({
    status: zod.enum(OrderStatus).optional(),
});