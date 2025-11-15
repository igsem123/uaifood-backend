import {CategoryService} from "../services/CategoryService";
import {Request, Response} from "express";
import {injectable, inject} from "tsyringe";
import {getReasonPhrase, ReasonPhrases, getStatusCode, StatusCodes} from "http-status-codes";

@injectable()
export class CategoryController {
    constructor(@inject(CategoryService) private categoryService: CategoryService) {}

    createCategory = async (req: Request, res: Response) => {
        try {
            const newCategory = await this.categoryService.createCategory(req.body);
            res
                .status(StatusCodes.CREATED)
                .json({ message: getReasonPhrase(StatusCodes.CREATED), newCategory });
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: error.message });
            }
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        }
    }

    getAllCategories = async (req: Request, res: Response) => {
        try {
            const categories = await this.categoryService.getAllCategories();
            res
                .status(StatusCodes.OK)
                .json(categories);
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        }
    }

    updateCategory = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const updatedCategory = await this.categoryService.updateCategory(id, req.body);
            res
                .status(StatusCodes.OK)
                .json({ message: getReasonPhrase(StatusCodes.OK), updatedCategory });
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: error.message });
            }
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        }
    }

    deleteCategory = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const deletedCategory = await this.categoryService.deleteCategory(id);
            res
                .status(StatusCodes.OK)
                .json({message: getReasonPhrase(StatusCodes.OK), deletedCategory});
        } catch (error) {
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({message: error.message});
            }
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)});
        }
    }
}