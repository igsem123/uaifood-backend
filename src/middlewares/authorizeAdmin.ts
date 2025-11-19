import { Request, Response, NextFunction } from 'express';

export function authorizeAdmin(req: Request, res: Response, next: NextFunction) {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    if (user.type !== "ADMIN") {
        return res.status(403).json({ message: "Ação permitida apenas para administradores" });
    }

    next();
}
