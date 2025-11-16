import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

export function generateAccessToken(user: User): string {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_EXPIRES_IN } as jwt.SignOptions
    );
}

export function generateRefreshToken(user: User): string {
    return jwt.sign(
        { id: user.id },
        process.env.REFRESH_SECRET as string,
        { expiresIn: process.env.REFRESH_EXPIRES_IN } as jwt.SignOptions
    );
}
