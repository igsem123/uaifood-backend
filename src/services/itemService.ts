import {injectable} from "tsyringe";
import {itemRepository} from "../repositories/itemRepository";
import {Item} from "@prisma/client";
import {ItemScheme, ItemUpdateScheme} from "../zodSchemes/itemScheme";

@injectable()
export class ItemService {
    createItem = async (data: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> => {
        ItemScheme.parse(data);

        return await itemRepository.create(data);
    }

    getAllItems = async (): Promise<Item[]> => {
        return await itemRepository.findAll();
    }

    updateItem = async (id: number, data: Omit<Item, 'id' | 'updatedAt'>): Promise<Item> => {
        const existingItem = await itemRepository.findById(id);

        if (!existingItem) {
            throw new Error('Item not found');
        }

        ItemUpdateScheme.parse(data);
        return await itemRepository.update(id, data);
    }

    deleteItem = async (id: number): Promise<Item> => {
        const existingItem = await itemRepository.findById(id);

        if (!existingItem) {
            throw new Error('Item not found');
        }

        return await itemRepository.delete(id);
    }

    getItemById = async (id: number): Promise<Item | null> => {
        return await itemRepository.findById(id);
    }
}