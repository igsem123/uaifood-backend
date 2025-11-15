import {injectable, inject} from "tsyringe";
import {UserService} from "./userService";
import bcrypt from "bcryptjs";
import {generateRefreshToken, generateAccessToken} from "../auth/jwt";
import {prisma} from "../config/prisma";
import dotenv from "dotenv";
import ms from "ms";
import jwt from "jsonwebtoken";

dotenv.config();

@injectable()
export class AuthService {
    constructor(@inject(UserService) private userService: UserService) {}

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
                expiresAt: new Date(Date.now() + ms(process.env.REFRESH_EXPIRES_IN as any)),
            }
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    refresh = async (token: string): Promise<any> => {
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!storedToken || storedToken.expiresAt < new Date()) {
            throw new Error('Invalid or expired refresh token');
        }

        const accessToken = generateAccessToken(storedToken.user);
        const newRefreshToken = generateRefreshToken(storedToken.user);

        await prisma.refreshToken.delete({
            where: { token },
        });

        await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId: storedToken.userId,
                expiresAt: new Date(Date.now() + ms(process.env.REFRESH_EXPIRES_IN as any)),
            }
        });

        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }

    logout = async (token: string): Promise<void> => {
        await prisma.refreshToken.delete({
            where: { token },
        });
    }
}