import {injectable, inject} from "tsyringe";
import {UserService} from "./userService";
import bcrypt from "bcryptjs";
import {generateRefreshToken, generateAccessToken} from "../auth/jwt";
import {prisma} from "../config/prisma";
import dotenv from "dotenv";
import ms, {StringValue} from "ms";
import jwt from "jsonwebtoken";

dotenv.config();

@injectable()
export class AuthService {
    constructor(@inject(UserService) private userService: UserService) {
    }

    login = async (email: string, password: string): Promise<any> => {
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + ms(process.env.REFRESH_EXPIRES_IN as StringValue)),
            }
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    refresh = async (token: string): Promise<any> => {
        const storedToken = await prisma.refreshToken.findUnique({
            where: {token},
            include: {user: true},
        });

        if (!storedToken || storedToken.expiresAt < new Date()) {
            throw new Error('Invalid or expired refresh token');
        }

        if (!process.env.REFRESH_SECRET) {
            throw new Error('Missing refresh secret');
        }

        let payload: any;

        try {
            payload = jwt.verify(token, process.env.REFRESH_SECRET);
        } catch {
            throw new Error('Invalid or corrupted refresh token');
        }

        if (payload.id !== storedToken.userId) {
            throw new Error('Token user mismatch');
        }

        const accessToken = generateAccessToken(storedToken.user);
        const newRefreshToken = generateRefreshToken(storedToken.user);
        const expiresAt = new Date(Date.now() + (ms(process.env.REFRESH_EXPIRES_IN as StringValue)));

        await prisma.$transaction([
            prisma.refreshToken.delete({where: {token}}),
            prisma.refreshToken.create({
                data: {
                    token: newRefreshToken,
                    userId: storedToken.userId,
                    expiresAt,
                },
            }),
        ]);

        return {
            accessToken,
            newRefreshToken,
        };
    }

    logout = async (token: string): Promise<void> => {
        await prisma.refreshToken.delete({
            where: {token},
        });
    }
}