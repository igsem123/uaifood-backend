import "reflect-metadata";
import express from "express";
import cors from "cors";
import {errorHandler} from "./middlewares/errorHandler";
import userRoutes from "./routes/UserRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use(errorHandler);

app.use('/api/users', userRoutes);

export default app;

