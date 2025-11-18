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
     * /orders:
     *   post:
     *     summary: Cria um novo pedido
     *     tags: [Orders]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userId:
     *                 type: integer
     *               items:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     productId:
     *                       type: integer
     *                     quantity:
     *                       type: integer
     *               paymentMethod:
     *                 type: string
     *                 enum: [CREDIT_CARD, DEBIT_CARD, PAYPAL, CASH]
     *               totalAmount:
     *                 type: number
     *     responses:
     *       201:
     *         description: Pedido criado com sucesso
     *       500:
     *         description: Erro interno
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
     *     summary: Recupera todos os pedidos paginados
     *     tags: [Orders]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: "Número da página (padrão: 1)"
     *       - in: query
     *         name: pageSize
     *         schema:
     *           type: integer
     *         description: "Número de itens por página (padrão: 10)"
     *     responses:
     *       200:
     *         description: Lista de pedidos recuperada com sucesso
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
     *     summary: Recupera todos os pedidos de um cliente específico paginados
     *     tags: [Orders]
     *     parameters:
     *       - in: path
     *         name: clientId
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do cliente
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: "Número da página (padrão: 1)"
     *       - in: query
     *         name: pageSize
     *         schema:
     *           type: integer
     *         description: "Número de itens por página (padrão: 10)"
     *     responses:
     *       200:
     *         description: Lista de pedidos do cliente recuperada com sucesso
     *       500:
     *         description: Erro interno
     */
    getOrdersByClientId = async (req: Request, res: Response) => {
        try {
            const clientId = Number(req.params.clientId);
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
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do pedido
     *     responses:
     *       200:
     *         description: Pedido obtido com sucesso
     *       404:
     *         description: Pedido não encontrado
     *       500:
     *         description: Erro interno
     */
    getOrderById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const order = await this.orderService.getOrderById(id);

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
     *     summary: Atualiza o status de um pedido
     *     tags: [Orders]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do pedido
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               status:
     *                 type: string
     *                 enum: [PENDING, PROCESSING, COMPLETED, CANCELLED]
     *     responses:
     *       200:
     *         description: Pedido atualizado com sucesso
     *       400:
     *         description: Erro de validação
     *       500:
     *         description: Erro interno
     */
    updateOrder = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const updatedOrder = await this.orderService.updateOrder(id, req.body);
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
     *     summary: Deleta um pedido pelo ID
     *     tags: [Orders]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do pedido
     *     responses:
     *       200:
     *         description: Pedido deletado com sucesso
     *       500:
     *         description: Erro interno
     */
    deleteOrder = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
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