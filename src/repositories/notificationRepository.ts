import {prisma} from "../config/prisma";
import {Notification} from "@prisma/client";

export const notificationRepository = {

    create: async (notificationData: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
        return prisma.notification.create({
            data: {
                ...notificationData,
                data: notificationData.data || {},
            }
        });
    },

    findByUser: async (userId: bigint, opts?: { skip?: number; take?: number }) => {
        return prisma.notification.findMany({
            where: {userId},
            orderBy: {createdAt: "desc"},
            skip: opts?.skip,
            take: opts?.take ?? 50,
        })
    },

    markAsRead: async (id: bigint, userId: bigint) => {
        return prisma.notification.updateMany({
            where: {id, userId},
            data: {read: true},
        })
    },

    countUnread: async (userId: bigint) => {
        return prisma.notification.count({where: {userId, read: false}});
    },

    markAllAsRead: async (userId: bigint) => {
        return prisma.notification.updateMany({
            where: {userId, read: false},
            data: {read: true},
        })
    }
};
