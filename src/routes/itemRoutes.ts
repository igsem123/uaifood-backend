import {Router} from "express";
import {ItemController} from "../controllers/itemController";
import {container} from "../shared/container";
import passport from "../auth/passport";

const itemController = container.resolve(ItemController);

const router = Router();

router.post("/", passport.authenticate("jwt", { session: false }), itemController.createItem);
router.get("/", itemController.getAllItems);
router.patch("/:id", passport.authenticate("jwt", { session: false }), itemController.updateItem);
router.delete("/:id", passport.authenticate("jwt", { session: false }), itemController.deleteItem);
router.get("/:id", itemController.getItemById);

export default router;