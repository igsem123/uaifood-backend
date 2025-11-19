import {NotificationService} from "../services/notificationService";
import {Request, Response} from "express";
import {injectable, inject} from "tsyringe";
import {getReasonPhrase, StatusCodes} from "http-status-codes";

@injectable()
export class NotificationController {
    constructor(@inject(NotificationService) private notificationService: NotificationService) {}

    /**
     * @swagger
     * tags:
     *   name: Notifications
     *   description: Endpoints relacionados às notificações
     */

    /**
     * @swagger
     * /notifications:
     *   get:
     *     summary: Recupera todas as notificações do usuário autenticado
     *     tags: [Notifications]
     *     responses:
     *       200:
     *         description: Notificações recuperadas com sucesso
     *       401:
     *         description: Não autorizado
     *       500:
     *         description: Erro interno
     */
    getNotifications = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({ message: getReasonPhrase(StatusCodes.UNAUTHORIZED) });
            }

            const page = Number(req.query.page) || 1;
            const pageSize = Math.min(Number(req.query.pageSize ?? 20), 100);
            const skip = (page - 1) * pageSize;

            const notifications = await this.notificationService.listForUser(userId, skip, pageSize);

            res
                .status(StatusCodes.OK)
                .json({ message: getReasonPhrase(StatusCodes.OK), notifications });
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        }
    };

    /**
     * @swagger
     * /notifications/read:
     *   post:
     *     summary: Marca uma notificação como lida
     *     tags: [Notifications]
     *     responses:
     *       200:
     *         description: Notificação marcada como lida com sucesso
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Notificação não encontrada
     *       500:
     *         description: Erro interno
     */
    markAsRead = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const notificationId = BigInt(req.body.id);

            if (!userId) {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({ message: getReasonPhrase(StatusCodes.UNAUTHORIZED) });
            }

            await this.notificationService.markAsRead(userId, notificationId);

            res
                .status(StatusCodes.OK)
                .json({ message: getReasonPhrase(StatusCodes.OK) });
        } catch (error) {
            if (error instanceof Error && error.message === "Notification not found") {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ message: error.message });
            }
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        }
    };

    /**
     * @swagger
     * /notifications/mark-read-all:
     *   post:
     *     summary: Marca todas as notificações do usuário autenticado como lidas
     *     tags: [Notifications]
     *     responses:
     *       200:
     *         description: Todas as notificações marcadas como lidas com sucesso
     *       401:
     *         description: Não autorizado
     *       500:
     *         description: Erro interno
     */
    markAllAsRead = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({ message: getReasonPhrase(StatusCodes.UNAUTHORIZED) });
            }

            await this.notificationService.markAllAsRead(userId);

            res
                .status(StatusCodes.OK)
                .json({ message: getReasonPhrase(StatusCodes.OK) });
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        }
    };
}