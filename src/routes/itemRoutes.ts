import {Router} from "express";
import {ItemController} from "../controllers/itemController";
import {container} from "../shared/container";
import passport from "../auth/passport";

const itemController = container.resolve(ItemController);

const router = Router();

router.post("/items", passport.authenticate("jwt", { session: false }), itemController.createItem);
router.get("/items", itemController.getAllItems);
router.patch("/items/:id", passport.authenticate("jwt", { session: false }), itemController.updateItem);
router.delete("/items/:id", passport.authenticate("jwt", { session: false }), itemController.deleteItem);
router.get("/items/:id", itemController.getItemById);

export default router;