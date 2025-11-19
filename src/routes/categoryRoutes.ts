import {Router} from "express";
import {container} from "tsyringe";
import {CategoryController} from "../controllers/categoryController";
import passport from "../auth/passport";
import { authorizeAdmin } from "../middlewares/authorizeAdmin";

const router = Router();
const categoryController = container.resolve(CategoryController);

router.post(
    '/',
    passport.authenticate("jwt", { session: false }),
    authorizeAdmin,
    categoryController.createCategory
);

router.patch(
    '/:id',
    passport.authenticate("jwt", { session: false }),
    authorizeAdmin,
    categoryController.updateCategory
);

router.delete(
    '/:id',
    passport.authenticate("jwt", { session: false }),
    authorizeAdmin,
    categoryController.deleteCategory
);

router.get('/', categoryController.getAllCategories);

export default router;