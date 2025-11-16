import {Router} from "express";
import {AuthController} from "../controllers/authController";
import {container} from "../shared/container";

const authController = container.resolve(AuthController);

const router = Router();

router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

export default router;