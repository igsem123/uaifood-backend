import {Request, Response} from "express";
import {injectable, inject} from "tsyringe";
import {AuthService} from "../services/authService";
import {StatusCodes, getReasonPhrase} from "http-status-codes";
import dotenv from "dotenv";
import ms, {StringValue} from "ms";

dotenv.config();

@injectable()
export class AuthController {
    constructor(@inject(AuthService) private authService: AuthService) {
    }

    /**
     * @swagger
     * tags:
     *   name: Auth
     *   description: Endpoints relacionados à autenticação
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
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Login realizado com sucesso
     *       401:
     *         description: Credenciais inválidas
     */
    login = async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body;
            const {
                accessToken,
                refreshToken
            } = await this.authService.login(email, password);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/auth/refresh',
                maxAge: ms(process.env.REFRESH_EXPIRES_IN as StringValue),
            })

            res
                .status(StatusCodes.OK)
                .json({message: getReasonPhrase(StatusCodes.OK), accessToken});
        } catch (error) {
            res
                .status(StatusCodes.UNAUTHORIZED)
                .json({error: getReasonPhrase(StatusCodes.UNAUTHORIZED)});
        }
    }

    /**
     * @swagger
     * /auth/refresh:
     *   post:
     *     summary: Atualiza o token de acesso usando o token de refresh
     *     tags: [Auth]
     *     responses:
     *       200:
     *         description: Token atualizado com sucesso
     *       401:
     *         description: Token de refresh inválido ou expirado
     */
    refresh = async (req: Request, res: Response) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({error: getReasonPhrase(StatusCodes.UNAUTHORIZED)});
            }

            const {accessToken, newRefreshToken} = await this.authService.refresh(refreshToken);

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/auth/refresh',
                maxAge: ms(process.env.REFRESH_EXPIRES_IN as StringValue),
            });

            res
                .status(StatusCodes.OK)
                .json({message: getReasonPhrase(StatusCodes.OK), accessToken});
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({error: error.message});
            }
            res
                .status(StatusCodes.UNAUTHORIZED)
                .json({error: getReasonPhrase(StatusCodes.UNAUTHORIZED)});
        }
    }

    /**
     * @swagger
     * /auth/logout:
     *   post:
     *     summary: Realiza o logout do usuário
     *     tags: [Auth]
     *     responses:
     *       200:
     *         description: Logout realizado com sucesso
     *       400:
     *         description: Requisição inválida
     */
    async logout(req: Request, res: Response) {
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
                sameSite: 'lax',
            });

            res
                .status(StatusCodes.OK)
                .json({message: getReasonPhrase(StatusCodes.OK)});
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)});
        }
    }
}