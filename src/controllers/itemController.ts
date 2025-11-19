import {injectable, inject} from "tsyringe";
import {ItemService} from "../services/itemService";
import {Request, Response} from "express";
import {getReasonPhrase, ReasonPhrases, getStatusCode, StatusCodes} from "http-status-codes";
import {ZodError} from "zod";

@injectable()
export class ItemController {
    constructor(@inject(ItemService) private itemService: ItemService) {
    }

    /**
     * @swagger
     * tags:
     *   name: Items
     *   description: Endpoints relacionados aos itens
     */

    /**
     * @swagger
     * components:
     *   schemas:
     *     Item:
     *       type: object
     *       properties:
     *         id:
     *           type: integer
     *         name:
     *           type: string
     *         description:
     *           type: string
     *         unitPrice:
     *           type: number
     *       required:
     *         - name
     *         - unitPrice
     */


    /**
     * @swagger
     * /items:
     *   post:
     *     summary: Cria um novo item (apenas ADMIN)
     *     tags: [Items]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Item'
     *           example:
     *             name: "Ração Premium"
     *             description: "Ração de alta qualidade para gado leiteiro"
     *             unitPrice: 49.90
     *     responses:
     *       201:
     *         description: Item criado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Item'
     *       400:
     *         description: Erro de validação dos dados
     *       401:
     *         description: Token não fornecido ou inválido
     *       403:
     *         description: Usuário não é ADMIN
     *       500:
     *         description: Erro interno do servidor
     */
    createItem = async (req: Request, res: Response) => {
        try {
            const newItem = await this.itemService.createItem(req.body);
            res
                .status(StatusCodes.CREATED)
                .json({message: getReasonPhrase(StatusCodes.CREATED), newItem});
        } catch (error) {
            if (error instanceof ZodError) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({errors: error.issues});
            }
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({message: error.message});
            }
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)});
        }
    };

    /**
     * @swagger
     * /items:
     *   get:
     *     summary: Obtém todos os itens (público)
     *     tags: [Items]
     *     responses:
     *       200:
     *         description: Lista de itens obtida com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Item'
     *       500:
     *         description: Erro interno
     */
    getAllItems = async (req: Request, res: Response) => {
        try {
            const items = await this.itemService.getAllItems();
            res
                .status(StatusCodes.OK)
                .json({message: getReasonPhrase(StatusCodes.OK), items});
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)});
        }
    };

    /**
     * @swagger
     * /items/{id}:
     *   get:
     *     summary: Obtém um item pelo ID (público)
     *     tags: [Items]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do item
     *     responses:
     *       200:
     *         description: Item encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Item'
     *       404:
     *         description: Item não encontrado
     *       500:
     *         description: Erro interno
     */
    getItemById = async (req: Request, res: Response) => {
        try {
            const itemId = Number(req.params.id);
            const item = await this.itemService.getItemById(itemId);
            res
                .status(StatusCodes.OK)
                .json({message: getReasonPhrase(StatusCodes.OK), item});
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({message: error.message});
            }
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)});
        }
    };

    /**
     * @swagger
     * /items/{id}:
     *   patch:
     *     summary: Atualiza um item existente (apenas ADMIN)
     *     tags: [Items]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do item
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Item'
     *           example:
     *             name: "Ração Premium Atualizada"
     *             unitPrice: 59.90
     *     responses:
     *       200:
     *         description: Item atualizado com sucesso
     *       400:
     *         description: Erro de validação
     *       401:
     *         description: Token não fornecido ou inválido
     *       403:
     *         description: Usuário não é ADMIN
     *       404:
     *         description: Item não encontrado
     *       500:
     *         description: Erro interno
     */
    updateItem = async (req: Request, res: Response) => {
        try {
            const itemId = Number(req.params.id);
            const updatedItem = await this.itemService.updateItem(itemId, req.body);
            res
                .status(StatusCodes.OK)
                .json({message: getReasonPhrase(StatusCodes.OK), updatedItem});
        } catch (error) {
            if (error instanceof ZodError) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({errors: error.issues});
            }
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({message: error.message});
            }
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)});
        }
    };


    /**
     * @swagger
     * /items/{id}:
     *   delete:
     *     summary: Deleta um item existente (apenas ADMIN)
     *     tags: [Items]
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
     *         description: Item deletado com sucesso
     *       401:
     *         description: Token não fornecido ou inválido
     *       403:
     *         description: Usuário não é ADMIN
     *       404:
     *         description: Item não encontrado
     *       500:
     *         description: Erro interno
     */
    deleteItem = async (req: Request, res: Response) => {
        try {
            const itemId = Number(req.params.id);
            await this.itemService.deleteItem(itemId);
            res
                .status(StatusCodes.OK)
                .json({message: getReasonPhrase(StatusCodes.OK)});
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)});
        }
    };
}