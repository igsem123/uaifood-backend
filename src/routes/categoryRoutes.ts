import {Router} from "express";
import {container} from "tsyringe";
import {CategoryController} from "../controllers/categoryController";

const router = Router();
const categoryController = container.resolve(CategoryController);

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.patch('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;