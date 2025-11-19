import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

type JwtPayload = { sub: string; userId?: number };

let io: Server;

const onlineUsers = new Map<number, string>(); // userId -> socketId

export function initSocket(httpServer: HttpServer) {
    io = new Server(httpServer, {
        cors: { origin: process.env.FRONTEND_URL },
        pingTimeout: 30000,
    });

    // middleware de autenticação no handshake
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token as string | undefined;
        if (!token) return next(new Error("Unauthorized"));

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
            const userId = payload.userId ?? Number(payload.sub);
            if (!userId) return next(new Error("Invalid token payload"));

            socket.data.userId = userId;
            next();
        } catch (err) {
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket: Socket) => {
        const userId: number = socket.data.userId;
        // se quiser suportar múltiplas conexões por user, use Map<number, Set<string>>
        onlineUsers.set(userId, socket.id);
        socket.join(`user:${userId}`);
        console.log(`user ${userId} connected socket=${socket.id}`);

        // opcional: cliente pode pedir unread count
        socket.on("get_unread_count", async (cb) => {
            // aqui você pode chamar função para contar não-lidas e retornar
            // ex: cb({ count: await countUnread(userId) });
        });

        socket.on("disconnect", (reason) => {
            console.log(`user ${userId} disconnected ${reason}`);
            // limpar
            if (onlineUsers.get(userId) === socket.id) onlineUsers.delete(userId);
        });
    });

    return io;
}

export function emitToUser(userId: bigint, event: string, payload: any) {
    if (!io) return;
    io.to(`user:${userId}`).emit(event, payload);
}
