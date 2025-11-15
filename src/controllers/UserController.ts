import {inject, injectable} from "tsyringe";
import {UserService} from "../services/UserService";
import {Request, Response} from "express";
import { z } from "zod";
import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } from "http-status-codes";
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
                .status(StatusCodes.OK)
                .json({ message: getReasonPhrase(ReasonPhrases.CREATED), newUser });
        } catch (error) {
            if(error instanceof z.ZodError) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ errors: error.issues });
            } else if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: error.message });
            }
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: getReasonPhrase(ReasonPhrases.INTERNAL_SERVER_ERROR) });
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *  get:
     *   summary: Obtém um usuário pelo ID
     *   tags: [Users]
     *   parameters:
     *     - in: path
     *       name: id
     *       required: true
     *       schema:
     *         type: integer
     *       description: ID do usuário
     *   responses:
     *     200:
     *       description: Usuário obtido com sucesso
     *     404:
     *       description: Usuário não encontrado
     *     500:
     *       description: Erro interno do servidor
     */
    getUserById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
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
                .json({ error: getReasonPhrase(ReasonPhrases.INTERNAL_SERVER_ERROR) });
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *   patch:
     *     summary: Atualiza um usuário existente
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do usuário a ser atualizado
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
     *       404:
     *         description: Usuário não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    updateUser = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const data = {...req.body};
            const updatedUser = await this.userService.updateUser(id, data);

            res
                .status(StatusCodes.OK)
                .json({ message: getReasonPhrase(ReasonPhrases.OK), updatedUser });
        } catch (error) {
            if(error instanceof z.ZodError) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ errors: error.issues });
            } else if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ error: error.message });
            }
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: getReasonPhrase(ReasonPhrases.INTERNAL_SERVER_ERROR) });
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     summary: Deleta um usuário pelo ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do usuário a ser deletado
     *     responses:
     *       200:
     *         description: Usuário deletado com sucesso
     *       400:
     *         description: Requisição inválida
     *       500:
     *         description: Erro interno do servidor
     */
    deleteUser = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const deletedUser = await this.userService.deleteUser(id);

            res
                .status(StatusCodes.OK)
                .json({message: getReasonPhrase(ReasonPhrases.OK), deletedUser});
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({error: error.message});
            }
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({error: getReasonPhrase(ReasonPhrases.INTERNAL_SERVER_ERROR)});
        }
    }

    /**
     * @swagger
     * /users/{id}/addresses:
     *  get:
     *   summary: Obtém um usuário com seus endereços pelo ID
     *   tags: [Users]
     *   parameters:
     *     - in: path
     *       name: id
     *       required: true
     *       schema:
     *         type: integer
     *       description: ID do usuário
     *   responses:
     *     200:
     *       description: Usuário obtido com sucesso
     *     404:
     *       description: Usuário não encontrado
     *     500:
     *       description: Erro interno do servidor
     */
    getUserWithAddresses = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const user = await this.userService.findUserWithAddresses(id);

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
                .json({ error: getReasonPhrase(ReasonPhrases.INTERNAL_SERVER_ERROR) });
        }
    }
}