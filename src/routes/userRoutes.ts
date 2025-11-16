import {container} from "tsyringe";
import {UserController} from "../controllers/userController";
import {Router} from "express";

const userController = container.resolve(UserController);
const router = Router();

router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/:id/addresses', userController.getUserWithAddresses);

export default router;