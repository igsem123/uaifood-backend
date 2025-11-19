import {inject, injectable} from "tsyringe";
import {UserService} from "../services/userService";
import {Request, Response} from "express";
import { z } from "zod";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import {UserType} from "@prisma/client";

@injectable()
export class UserController {
    constructor(@inject(UserService) private userService: UserService) {}

    /**
     * @swagger
     * tags:
     *   name: Users
     *   description: Endpoints relacionados aos usuários
     */

    /**
     * @swagger
     * components:
     *   schemas:
     *     User:
     *       type: object
     *       properties:
     *         id:
     *           type: integer
     *         name:
     *           type: string
     *         email:
     *           type: string
     *         type:
     *           type: string
     *           enum: [ADMIN, CLIENT]
     *         createdAt:
     *           type: string
     *         updatedAt:
     *           type: string
     */

    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Cria um novo usuário
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       201:
     *         description: Usuário criado com sucesso
     *       400:
     *         description: Erro de validação
     *       500:
     *         description: Erro interno
     */
    createUser = async (req: Request, res: Response) => {
        try {
            const user = {...req.body, type: UserType.CLIENT};
            const newUser = await this.userService.registerUser(user);

            res
                .status(StatusCodes.CREATED)
                .json({ message: getReasonPhrase(StatusCodes.CREATED), user: newUser });
        } catch (error) {
            console.log(error);

            if(error instanceof z.ZodError) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ errors: error.issues });
            } else if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: error.message });
            }
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Obtém um usuário pelo ID
     *     tags: [Users]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Usuário obtido com sucesso
     *       404:
     *         description: Usuário não encontrado
     *       401:
     *         description: Não autorizado (token inválido)
     */
    getUserById = async (req: Request, res: Response) => {
        try {
            const id = BigInt(req.params.id);
            const user = await this.userService.findUserById(id);

            if (!user) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: 'User not found' });
            }

            res
                .status(StatusCodes.OK)
                .json({ user });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        }
    }

    /**
     * @swagger
     * /users:
     *   patch:
     *     summary: Atualiza o usuário autenticado
     *     tags: [Users]
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Usuário atualizado com sucesso
     *       400:
     *         description: Erro de validação
     *       401:
     *         description: Não autorizado
     */
    updateUser = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({ message: getReasonPhrase(StatusCodes.UNAUTHORIZED) });
            }

            const data = {...req.body};
            const updatedUser = await this.userService.updateUser(userId, data);

            res
                .status(StatusCodes.OK)
                .json({ message: getReasonPhrase(StatusCodes.OK), user: updatedUser });
        } catch (error) {
            if(error instanceof z.ZodError) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ errors: error.issues });
            } else if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: error.message });
            }
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        }
    }

    /**
     * @swagger
     * /users:
     *   delete:
     *     summary: Deleta o usuário autenticado
     *     tags: [Users]
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Usuário deletado com sucesso
     *       401:
     *         description: Não autorizado
     *       500:
     *         description: Erro interno
     */
    deleteUser = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({ message: getReasonPhrase(StatusCodes.UNAUTHORIZED) });
            }

            const deletedUser = await this.userService.deleteUser(userId);

            res
                .status(StatusCodes.OK)
                .json({message: getReasonPhrase(StatusCodes.OK), user: deletedUser});
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({message: error.message});
            }
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)});
        }
    }

    /**
     * @swagger
     * /users/{id}/relations:
     *   get:
     *     summary: Obtém um usuário com relações especificadas
     *     tags: [Users]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *       - in: query
     *         name: include
     *         required: false
     *         schema:
     *           type: string
     *         description: "Relações separadas por vírgula (ex: 'addresses,orders')"
     *     responses:
     *       200:
     *         description: Usuário e relações retornados com sucesso
     *       404:
     *         description: Usuário não encontrado
     *       401:
     *         description: Token inválido ou ausente
     */
    getUserWithRelations = async (req: Request, res: Response) => {
        try {
            const id = BigInt(req.params.id);
            const include = req.query.include;

            const relations: string[] = typeof include === 'string'
                ? include.split(',').map(r => r.trim())
                : [];

            const user = await this.userService.findUserWithRelations(id, relations);

            if (!user) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: 'User not found' });
            }

            res
                .status(StatusCodes.OK)
                .json({ user });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        }
    }
}