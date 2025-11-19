import {Router} from "express";
import {ItemController} from "../controllers/itemController";
import {container} from "../shared/container";
import passport from "../auth/passport";
import { authorizeAdmin } from "../middlewares/authorizeAdmin";

const itemController = container.resolve(ItemController);

const router = Router();

router.post(
    '/',
    passport.authenticate("jwt", { session: false }),
    authorizeAdmin,
    itemController.createItem
);

router.get(
    '/',
    itemController.getAllItems
);

router.patch(
    '/:id',
    passport.authenticate("jwt", { session: false }),
    authorizeAdmin,
    itemController.updateItem
);

router.delete(
    '/:id',
    passport.authenticate("jwt", { session: false }),
    authorizeAdmin,
    itemController.deleteItem
);

router.get(
    '/:id',
    itemController.getItemById
);

export default router;