import zod from "zod";
import {OrderStatus, PaymentMethod} from "@prisma/client";

export const CreateOrderScheme = zod.object({
    clientId: zod.number({ message: 'Identificador do cliente é obrigatório' }).int().positive(),
    addressId: zod.number({ message: 'Identificador do endereço é obrigatório' }).int().positive(),
    items: zod.array(
        zod.object({
            itemId: zod.number('Identificador do item é obrigatória').int().positive(),
            quantity: zod.number('Quantidade de itens é obrigatória').int().positive(),
        })
    ).min(1, 'Ao menos um item é obrigatório'),
    paymentMethod: zod.enum(PaymentMethod, 'Método de pagamento é obrigatório'),
});

export const OrderUpdateScheme = zod.object({
    confirmedByUserId: zod.number('Identificador do usuário administrador é obrigatório').int().positive(),
    status: zod.enum(OrderStatus, 'Status do pedido é obrigatório'),
});