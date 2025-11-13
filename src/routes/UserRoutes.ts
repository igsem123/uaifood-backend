import {container} from "tsyringe";
import {UserController} from "../controllers/UserController";
import {Router} from "express";

const userController = container.resolve(UserController);
const router = Router();

router.post('/users', userController.registerUser);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

export default router;