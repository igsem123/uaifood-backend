import {CategoryRepository} from "../repositories/CategoryRepository";
import {injectable} from "tsyringe";
import { Category } from "@prisma/client";
import {CategoryScheme, CategoryUpdateScheme} from "../zodSchemes/CategoryScheme";

@injectable()
export class CategoryService {
    createCategory = async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
        CategoryScheme.parse(data);

        const existingCategory = await CategoryRepository.findByName(data.name);

        if (existingCategory) {
            throw new Error('Category with this name already exists');
        }

        return await CategoryRepository.create(data);
    }

    getAllCategories = async (): Promise<Category[]> => {
        return await CategoryRepository.findAll();
    }

    updateCategory = async (id: number, data: Omit<Category, 'id' | 'updatedAt'>): Promise<Category> => {
        const existingCategory = await CategoryRepository.findById(id);

        if (!existingCategory) {
            throw new Error('Category not found');
        }

        CategoryUpdateScheme.parse(data);
        return await CategoryRepository.update(id, data);
    }

    deleteCategory = async (id: number): Promise<Category> => {
        const existingCategory = await CategoryRepository.findById(id);

        if (!existingCategory) {
            throw new Error('Category not found');
        }

        return await CategoryRepository.delete(id);
    }
}