import {Strategy as JwtStrategy, ExtractJwt, VerifiedCallback} from 'passport-jwt';
import passport from 'passport';
import {UserService} from "../services/userService";
import { User } from '@prisma/client';
import { container } from '../shared/container';
import dotenv from "dotenv";

dotenv.config();

const userService = container.resolve(UserService);
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
}

passport.use(
    new JwtStrategy(options, async (payload, done) => {
        try {
            const user: User | null = await userService.findUserById(Number(payload.id), 'addresses');

            if (!user) return done(null, user);

            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    })
);

export default passport;