import {notificationRepository} from "../repositories/notificationRepository";
import {emitToUser} from "../config/socket";
import {injectable} from "tsyringe";
import {Notification} from "@prisma/client";

@injectable()
export class NotificationService {
    createAndEmit = async (userId: bigint, payload: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<Notification> => {
        const notification = await notificationRepository.create({
            ...payload,
            userId,
        });

        // emite via WebSocket
        emitToUser(userId, 'new_notification', notification);

        // também emite contagem de unread
        const unreadCount = await notificationRepository.countUnread(userId);
        emitToUser(userId, 'unread_count', {unreadCount});

        return notification;
    };

    listForUser = async (userId: bigint, skip?: number, take?: number): Promise<Notification[]> => {
        return notificationRepository.findByUser(userId, {skip, take});
    };

    markAsRead = async (userId: bigint, notificationId: bigint): Promise<void> => {
        await notificationRepository.markAsRead(notificationId, userId);

        // atualiza contagem de unread
        const unreadCount = await notificationRepository.countUnread(userId);
        emitToUser(userId, 'unread_count', {unreadCount});
    };

    markAllAsRead = async (userId: bigint): Promise<void> => {
        await notificationRepository.markAllAsRead(userId);

        // atualiza contagem de unread
        emitToUser(userId, 'unread_count', {unreadCount: 0});
    };
}