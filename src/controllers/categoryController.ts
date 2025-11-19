import {CategoryService} from "../services/categoryService";
import {Request, Response} from "express";
import {injectable, inject} from "tsyringe";
import {getReasonPhrase, StatusCodes} from "http-status-codes";
import {ZodError} from "zod";

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
     * components:
     *   schemas:
     *     Category:
     *       type: object
     *       properties:
     *         id:
     *           type: integer
     *         name:
     *           type: string
     *         description:
     *           type: string
     *         createdAt:
     *           type: string
     *           format: date-time
     *         updatedAt:
     *           type: string
     *           format: date-time
     *
     *     CategoryResponse:
     *       type: object
     *       properties:
     *         message:
     *           type: string
     *         category:
     *           $ref: '#/components/schemas/Category'
     *
     *     CategoryListResponse:
     *       type: object
     *       properties:
     *         message:
     *           type: string
     *         categories:
     *           type: array
     *           items:
     *             $ref: '#/components/schemas/Category'
     *
     *     ValidationError:
     *       type: object
     *       properties:
     *         message:
     *           type: string
     *
     *     ZodValidationError:
     *       type: object
     *       properties:
     *         errors:
     *           type: array
     *           items:
     *             type: object
     *             properties:
     *               path:
     *                 type: array
     *                 items:
     *                   type: string
     *               message:
     *                 type: string
     */

    /**
     * @swagger
     * /categories:
     *   post:
     *     summary: Cria uma nova categoria
     *     tags: [Categories]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *     responses:
     *       201:
     *         description: Categoria criada com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CategoryResponse'
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autenticado
     *       403:
     *         description: Sem permissão
     *       500:
     *         description: Erro interno
     */
    createCategory = async (req: Request, res: Response) => {
        try {
            const newCategory = await this.categoryService.createCategory(req.body);
            res
                .status(StatusCodes.CREATED)
                .json({ message: getReasonPhrase(StatusCodes.CREATED), category: newCategory });
        } catch (error) {
            if (error instanceof ZodError) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ errors: error.issues });
            }
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
     *     summary: Lista todas as categorias
     *     tags: [Categories]
     *     responses:
     *       200:
     *         description: Lista de categorias obtida com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CategoryListResponse'
     *       500:
     *         description: Erro interno
     */
    getAllCategories = async (req: Request, res: Response) => {
        try {
            const categories = await this.categoryService.getAllCategories();
            res
                .status(StatusCodes.OK)
                .json({ message: getReasonPhrase(StatusCodes.OK), categories });
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
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *     responses:
     *       200:
     *         description: Categoria atualizada com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CategoryResponse'
     *       400:
     *         description: Erro nos dados enviados
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/ValidationError'
     *                 - $ref: '#/components/schemas/ZodValidationError'
     *       401:
     *          description: Não autenticado
     *       403:
     *          description: Sem permissão
     *       404:
     *         description: Categoria não encontrada
     *       500:
     *         description: Erro interno
     */
    updateCategory = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const updatedCategory = await this.categoryService.updateCategory(id, req.body);
            res
                .status(StatusCodes.OK)
                .json({ message: getReasonPhrase(StatusCodes.OK), category: updatedCategory });
        } catch (error) {
            if (error instanceof ZodError) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ errors: error.issues });
            }
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
     *     security:
     *       - bearerAuth: []
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
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CategoryResponse'
     *       400:
     *         description: Erro de validação
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ValidationError'
     *       401:
     *         description: Não autenticado
     *       403:
     *         description: Sem permissão
     *       404:
     *         description: Categoria não encontrada
     *       500:
     *         description: Erro interno
     */
    deleteCategory = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const deletedCategory = await this.categoryService.deleteCategory(id);
            res
                .status(StatusCodes.OK)
                .json({message: getReasonPhrase(StatusCodes.OK), category: deletedCategory});
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