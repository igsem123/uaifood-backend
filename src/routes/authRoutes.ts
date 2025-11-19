import {Router} from "express";
import {AuthController} from "../controllers/authController";
import {container} from "../shared/container";
import passport from "../auth/passport";

const authController = container.resolve(AuthController);

const router = Router();

router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", passport.authenticate("jwt", { session: false }), authController.logout);
router.get("/profile", passport.authenticate("jwt", { session: false }), authController.getProfile);

export default router;