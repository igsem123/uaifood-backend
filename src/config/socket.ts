import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

type JwtPayload = {
    id: string;
    email: string;
    iat: number;
    exp: number;
};


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
        if (!token) return next(new Error("Não autorizado"));

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
            const userId = Number(payload.id);
            if (!userId) return next(new Error("Payload inválido"));
            socket.data.userId = userId;
            next();
        } catch (err) {
            next(new Error("Token inválido"));
        }
    });

    io.on("connection", (socket: Socket) => {
        const userId: number = socket.data.userId;
        onlineUsers.set(userId, socket.id);
        socket.join(`user:${userId}`);
        console.log(`user ${userId} connected socket=${socket.id}`);

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
