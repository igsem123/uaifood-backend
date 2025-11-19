import {inject, injectable} from "tsyringe";
import {OrderService} from "../services/orderService";
import {Request, Response} from "express";
import {getReasonPhrase, StatusCodes} from "http-status-codes";
import {ZodError} from "zod";

@injectable()
export class OrderController {
    constructor(@inject(OrderService) private orderService: OrderService) {}

    /**
     * @swagger
     * tags:
     *   name: Orders
     *   description: Endpoints relacionados aos pedidos
     */

    /**
     * @swagger
     * components:
     *   schemas:
     *     OrderItemInput:
     *       type: object
     *       required: [productId, quantity]
     *       properties:
     *         productId:
     *           type: integer
     *         quantity:
     *           type: integer
     *
     *     OrderInput:
     *       type: object
     *       required: [items, paymentMethod, totalAmount]
     *       properties:
     *         userId:
     *           type: integer
     *         items:
     *           type: array
     *           items:
     *             $ref: '#/components/schemas/OrderItemInput'
     *         paymentMethod:
     *           type: string
     *           enum: [CREDIT_CARD, DEBIT_CARD, CASH, PIX]
     *         totalAmount:
     *           type: number
     *
     *     UpdateOrderStatusInput:
     *       type: object
     *       required: [status]
     *       properties:
     *         status:
     *           type: string
     *           enum: [PENDING, CONFIRMED, DELIVERED, CANCELLED]
     *         clientId:
     *           type: integer
     *         confirmedByUserId:
     *           type: integer
     */

    /**
     * @swagger
     * /orders:
     *   post:
     *     summary: Cria um novo pedido
     *     tags: [Orders]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/OrderInput'
     *     responses:
     *       201:
     *         description: Pedido criado com sucesso
     *       400:
     *         description: Erro de validação
     *       500:
     *         description: Erro interno no servidor
     */
    createOrder = async (req: Request, res: Response) => {
        try {
            const order = await this.orderService.createOrder(req.body);
            res
                .status(StatusCodes.CREATED)
                .json({ message: getReasonPhrase(StatusCodes.CREATED), order });
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: error.message });
            }
            if (error instanceof ZodError) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ errors: error.issues });
            }
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        }
    };

    /**
     * @swagger
     * /orders:
     *   get:
     *     summary: Recupera todos os pedidos (somente admin)
     *     tags: [Orders]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         example: 1
     *       - in: query
     *         name: pageSize
     *         schema:
     *           type: integer
     *         example: 10
     *     responses:
     *       200:
     *         description: Lista de pedidos recuperada com sucesso
     *       403:
     *         description: Acesso negado
     *       500:
     *         description: Erro interno
     */
    getOrdersPaginated = async (req: Request, res: Response) => {
        try {
            const { page, pageSize } = req.query;
            const paginatedOrders = await this.orderService.getOrdersPaginated(Number(page), Number(pageSize));
            res
                .status(StatusCodes.OK)
                .json(paginatedOrders);
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        }
    };

    /**
     * @swagger
     * /orders/client/{clientId}:
     *   get:
     *     summary: Recupera os pedidos de um cliente específico (apenas autenticado)
     *     tags: [Orders]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: clientId
     *         required: true
     *         schema:
     *           type: integer
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         example: 1
     *       - in: query
     *         name: pageSize
     *         schema:
     *           type: integer
     *         example: 10
     *     responses:
     *       200:
     *         description: Lista de pedidos do cliente
     *       403:
     *         description: Acesso negado
     *       500:
     *         description: Erro interno
     */
    getOrdersByClientId = async (req: Request, res: Response) => {
        try {
            const clientId = BigInt(req.params.clientId);
            const { page, pageSize } = req.query;
            const paginatedOrders = await this.orderService.getOrdersByClientId(clientId, Number(page), Number(pageSize));
            res
                .status(StatusCodes.OK)
                .json(paginatedOrders);
        } catch (error) {
            console.log(error);
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        }
    };

    /**
     * @swagger
     * /orders/{id}:
     *   get:
     *     summary: Obtém um pedido pelo ID
     *     tags: [Orders]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Pedido retornado com sucesso
     *       401:
     *         description: Não autenticado
     *       403:
     *         description: Você não tem permissão para acessar este pedido
     *       404:
     *         description: Pedido não encontrado
     */
    getOrderById = async (req: Request, res: Response) => {
        try {
            const orderId = BigInt(req.params.id);
            const userId = req.user?.id;

            if (!userId) {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({ message: getReasonPhrase(StatusCodes.UNAUTHORIZED) });
            }

            const order = await this.orderService.getOrderById(orderId, userId);

            if (!order) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ message: 'Order not found' });
            }

            res
                .status(StatusCodes.OK)
                .json({ order });
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        }
    };

    /**
     * @swagger
     * /orders/{id}:
     *   patch:
     *     summary: Atualiza o status de um pedido (somente admin)
     *     tags: [Orders]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateOrderStatusInput'
     *     responses:
     *       200:
     *         description: Pedido atualizado
     *       400:
     *         description: Erro de validação
     *       403:
     *         description: Acesso negado
     *       500:
     *         description: Erro interno
     */
    updateOrder = async (req: Request, res: Response) => {
        try {
            const orderId = BigInt(req.params.id);
            const updatedOrder = await this.orderService.updateOrder(orderId, req.body);

            res
                .status(StatusCodes.OK)
                .json({ message: getReasonPhrase(StatusCodes.OK), updatedOrder });
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: error.message });
            }
            if (error instanceof ZodError) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ errors: error.issues });
            }
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        }
    };

    /**
     * @swagger
     * /orders/{id}:
     *   delete:
     *     summary: Deleta um pedido (somente admin)
     *     tags: [Orders]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Pedido deletado com sucesso
     *       403:
     *         description: Acesso negado
     *       500:
     *         description: Erro interno
     */
    deleteOrder = async (req: Request, res: Response) => {
        try {
            const id = BigInt(req.params.id);
            const deletedOrder = await this.orderService.deleteOrder(id);
            res
                .status(StatusCodes.OK)
                .json({ message: getReasonPhrase(StatusCodes.OK), deletedOrder });
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        }
    };
}