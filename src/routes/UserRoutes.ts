import {container} from "tsyringe";
import {UserController} from "../controllers/UserController";
import {Router} from "express";

const userController = container.resolve(UserController);
const router = Router();

router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;