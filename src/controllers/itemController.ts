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
     * /items:
     *   post:
     *     summary: Cria um novo item
     *     tags: [Items]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               unitPrice:
     *                 type: number
     *     responses:
     *       201:
     *         description: Item criado com sucesso
     *       400:
     *         description: Erro de validação
     *       500:
     *         description: Erro interno
     */
    createItem = async (req: Request, res: Response) => {
        try {
            const newItem = await this.itemService.createItem(req.body);
            res
                .status(StatusCodes.CREATED)
                .json({message: getReasonPhrase(StatusCodes.CREATED), newItem});
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({message: error.message});
            }
            if (error instanceof ZodError) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({errors: error.issues});
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
     *     summary: Obtém todos os itens
     *     tags: [Items]
     *     responses:
     *       200:
     *         description: Itens obtidos com sucesso
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
     *     summary: Obtém um item pelo ID
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
     *         description: Item obtido com sucesso
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
     *     summary: Atualiza um item existente
     *     tags: [Items]
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
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               unitPrice:
     *                 type: number
     *     responses:
     *       200:
     *         description: Item atualizado com sucesso
     *       400:
     *         description: Erro de validação
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
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({message: error.message});
            }
            if (error instanceof ZodError) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({errors: error.issues});
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
     *     summary: Deleta um item existente
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
     *         description: Item deletado com sucesso
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