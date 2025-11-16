import {Router} from "express";
import {container} from "tsyringe";
import {CategoryController} from "../controllers/categoryController";
import passport from "../auth/passport";

const router = Router();
const categoryController = container.resolve(CategoryController);

router.post('/', passport.authenticate("jwt", { session: false }), categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.patch('/:id', passport.authenticate("jwt", { session: false }), categoryController.updateCategory);
router.delete('/:id', passport.authenticate("jwt", { session: false }), categoryController.deleteCategory);

export default router;