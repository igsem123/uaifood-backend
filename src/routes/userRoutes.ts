import {container} from "tsyringe";
import {UserController} from "../controllers/userController";
import {Router} from "express";
import passport from "../auth/passport";

const userController = container.resolve(UserController);
const router = Router();

router.post('/', userController.createUser);
router.get('/:id', passport.authenticate("jwt", { session: false }), userController.getUserById);
router.patch('/:id', passport.authenticate("jwt", { session: false }), userController.updateUser);
router.delete('/:id', passport.authenticate("jwt", { session: false }), userController.deleteUser);
router.get('/:id/relations', passport.authenticate("jwt", { session: false }), userController.getUserWithRelations);

export default router;