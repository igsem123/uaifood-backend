import "reflect-metadata";
import express from "express";
import cors from "cors";
import {errorHandler} from "./middlewares/errorHandler";
import userRoutes from "./routes/UserRoutes";
import addressRoutes from "./routes/AddressRoutes";
import swaggerUi from "swagger-ui-express";
import {swaggerSpec} from "./config/swagger";
import categoryRoutes from "./routes/CategoryRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use(errorHandler);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/categories', categoryRoutes);

export default app;

