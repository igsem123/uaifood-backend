import {CategoryService} from "../services/CategoryService";
import {Request, Response} from "express";
import {injectable, inject} from "tsyringe";
import {getReasonPhrase, ReasonPhrases, getStatusCode, StatusCodes} from "http-status-codes";

@injectable()
export class CategoryController {
    constructor(@inject(CategoryService) private categoryService: CategoryService) {}

    /**
     * @swagger
     * tags:
     *   name: Categories
     *   description: Endpoints relacionados às categorias
     */

    /**
     * @swagger
     * /categories:
     *   post:
     *     summary: Cria uma nova categoria
     *     tags: [Categories]
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
     *     responses:
     *       201:
     *         description: Categoria criada com sucesso
     *       400:
     *         description: Erro de validação
     *       500:
     *         description: Erro interno
     */
    createCategory = async (req: Request, res: Response) => {
        try {
            const newCategory = await this.categoryService.createCategory(req.body);
            res
                .status(StatusCodes.CREATED)
                .json({ message: getReasonPhrase(StatusCodes.CREATED), newCategory });
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: error.message });
            }
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        }
    }

    /**
     * @swagger
     * /categories:
     *   get:
     *     summary: Obtém todas as categorias
     *     tags: [Categories]
     *     responses:
     *       200:
     *         description: Lista de categorias obtida com sucesso
     *       500:
     *         description: Erro interno
     */
    getAllCategories = async (req: Request, res: Response) => {
        try {
            const categories = await this.categoryService.getAllCategories();
            res
                .status(StatusCodes.OK)
                .json(categories);
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        }
    }

    /**
     * @swagger
     * /categories/{id}:
     *   patch:
     *     summary: Atualiza uma categoria existente
     *     tags: [Categories]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID da categoria
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
     *     responses:
     *       200:
     *         description: Categoria atualizada com sucesso
     *       400:
     *         description: Erro de validação
     *       500:
     *         description: Erro interno
     */
    updateCategory = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const updatedCategory = await this.categoryService.updateCategory(id, req.body);
            res
                .status(StatusCodes.OK)
                .json({ message: getReasonPhrase(StatusCodes.OK), updatedCategory });
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: error.message });
            }
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        }
    }

    /**
     * @swagger
     * /categories/{id}:
     *   delete:
     *     summary: Deleta uma categoria existente
     *     tags: [Categories]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID da categoria
     *     responses:
     *       200:
     *         description: Categoria deletada com sucesso
     *       400:
     *         description: Erro de validação
     *       500:
     *         description: Erro interno
     */
    deleteCategory = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const deletedCategory = await this.categoryService.deleteCategory(id);
            res
                .status(StatusCodes.OK)
                .json({message: getReasonPhrase(StatusCodes.OK), deletedCategory});
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({message: error.message});
            }
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)});
        }
    }
}