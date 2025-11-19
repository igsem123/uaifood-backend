import Router from "express";
import {container} from "tsyringe";
import {OrderController} from "../controllers/orderController";
import passport from "../auth/passport";
import { authorizeAdmin } from "../middlewares/authorizeAdmin";

const router = Router();
const orderController = container.resolve(OrderController);

router.post(
    '/',
    passport.authenticate("jwt", { session: false }),
    orderController.createOrder
);

router.get(
    '/',
    passport.authenticate("jwt", { session: false }),
    authorizeAdmin,
    orderController.getOrdersPaginated
);

router.get(
    '/:id',
    passport.authenticate("jwt", { session: false }),
    orderController.getOrderById
);

router.get(
    '/client/:clientId',
    passport.authenticate("jwt", { session: false }),
    orderController.getOrdersByClientId
);

router.patch(
    '/:id',
    passport.authenticate("jwt", { session: false }),
    authorizeAdmin,
    orderController.updateOrder
);

router.delete(
    '/:id',
    passport.authenticate("jwt", { session: false }),
    authorizeAdmin,
    orderController.deleteOrder
);

export default router;