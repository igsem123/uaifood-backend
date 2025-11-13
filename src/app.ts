import "reflect-metadata";
import express from "express";
import cors from "cors";
import {errorHandler} from "./middlewares/errorHandler";
import userRoutes from "./routes/UserRoutes";
import addressRoutes from "./routes/AddressRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use(errorHandler);

app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes);

export default app;

