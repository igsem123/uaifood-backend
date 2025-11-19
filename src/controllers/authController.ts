import {Request, Response} from "express";
import {injectable, inject} from "tsyringe";
import {AuthService} from "../services/authService";
import {StatusCodes, getReasonPhrase} from "http-status-codes";
import dotenv from "dotenv";
import ms, {StringValue} from "ms";

dotenv.config();

@injectable()
export class AuthController {
    constructor(@inject(AuthService) private authService: AuthService,) {}

    /**
     * @swagger
     * tags:
     *   name: Auth
     *   description: Endpoints relacionados à autenticação
     */

    /**
     * @swagger
     * components:
     *   schemas:
     *     AuthUser:
     *       type: object
     *       properties:
     *         id:
     *           type: integer
     *         name:
     *           type: string
     *         email:
     *           type: string
     *     LoginResponse:
     *       type: object
     *       properties:
     *         message:
     *           type: string
     *         user:
     *           $ref: '#/components/schemas/AuthUser'
     *         accessToken:
     *           type: string
     *     RefreshResponse:
     *       type: object
     *       properties:
     *         message:
     *           type: string
     *         user:
     *           $ref: '#/components/schemas/AuthUser'
     *         accessToken:
     *           type: string
     */


    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Realiza o login do usuário
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Login realizado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LoginResponse'
     *       401:
     *         description: Credenciais inválidas
     */
    login = async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body;
            const {
                user,
                accessToken,
                refreshToken
            } = await this.authService.login(email, password);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: ms(process.env.REFRESH_EXPIRES_IN as StringValue),
            })

            res
                .status(StatusCodes.OK)
                .json({message: getReasonPhrase(StatusCodes.OK), user, accessToken});
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({message: error.message});
            }
            res
                .status(StatusCodes.UNAUTHORIZED)
                .json({message: getReasonPhrase(StatusCodes.UNAUTHORIZED)});
        }
    }

    /**
     * @swagger
     * /auth/refresh:
     *   post:
     *     summary: Atualiza o token de acesso usando o refresh token armazenado no cookie
     *     tags: [Auth]
     *     description: O refresh token deve ser enviado automaticamente pelo navegador via cookie HttpOnly.
     *     responses:
     *       200:
     *         description: Token atualizado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/RefreshResponse'
     *       401:
     *         description: Token de refresh inválido ou ausente
     */
    refresh = async (req: Request, res: Response) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({error: getReasonPhrase(StatusCodes.UNAUTHORIZED)});
            }

            const {user, accessToken, newRefreshToken} = await this.authService.refresh(refreshToken);

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: ms(process.env.REFRESH_EXPIRES_IN as StringValue),
            });

            res
                .status(StatusCodes.OK)
                .json({message: getReasonPhrase(StatusCodes.OK), user, accessToken});
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({message: error.message});
            }
            res
                .status(StatusCodes.UNAUTHORIZED)
                .json({message: getReasonPhrase(StatusCodes.UNAUTHORIZED)});
        }
    }

    /**
     * @swagger
     * /auth/logout:
     *   post:
     *     summary: Realiza o logout do usuário, invalidando o refresh token
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *     description: O refresh token deve estar presente no cookie.
     *     responses:
     *       204:
     *         description: Logout realizado com sucesso
     *       400:
     *         description: Token de refresh ausente
     */
    logout = async (req: Request, res: Response)=> {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({error: getReasonPhrase(StatusCodes.BAD_REQUEST)});
            }

            await this.authService.logout(refreshToken);

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });

            res.status(StatusCodes.NO_CONTENT).send();
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)});
        }
    }

    /**
     * @swagger
     * /auth/profile:
     *   get:
     *     summary: Obtém o perfil do usuário autenticado
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Perfil obtido com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 user:
     *                   $ref: '#/components/schemas/AuthUser'
     *       401:
     *         description: Token inválido ou ausente
     *       500:
     *         description: Erro interno do servidor
     */
    getProfile = async (req: Request, res: Response) => {
        try {
            const user = req.user;

            res
                .status(StatusCodes.OK)
                .json({message: getReasonPhrase(StatusCodes.OK), user});
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)});
        }
    };
}