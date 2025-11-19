import "reflect-metadata";
import express from "express";
import cors from "cors";
import {errorHandler} from "./middlewares/errorHandler";
import userRoutes from "./routes/userRoutes";
import addressRoutes from "./routes/addressRoutes";
import swaggerUi from "swagger-ui-express";
import {swaggerSpec} from "./config/swagger";
import categoryRoutes from "./routes/categoryRoutes";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import passport from "./auth/passport";
import itemRoutes from "./routes/itemRoutes";
import orderRoutes from "./routes/orderRoutes";
import notificationRoutes from "./routes/notificationRoutes";

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);

export default app;
