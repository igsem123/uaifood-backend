import userRepository from "../repositories/UserRepository";
import {User} from "@prisma/client";
import { injectable } from "tsyringe";
import { UserScheme, UserUpdateScheme } from "../zodSchemes/UserScheme";

@injectable()
export class UserService {
    registerUser = async (data: User): Promise<User> => {
        const existingUser = await userRepository.getUserByEmail(data.email);
        if (existingUser) {
            throw new Error('Email already in use');
        }

        UserScheme.parse(data);

        return await userRepository.createUser(data);
    }

    findUserById = async (id: number): Promise<User | null> => {
        return await userRepository.getUserById(id);
    }

    updateUser = async (id: number, data: Partial<Omit<User, "id">>): Promise<User> => {
        const user = await userRepository.getUserById(id);
        if (!user) {
            throw new Error('User not found');
        }

        UserUpdateScheme.parse(data);

        return await userRepository.updateUser(id, data);
    }

    deleteUser = async (id: number): Promise<User> => {
        const user = await userRepository.getUserById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return await userRepository.deleteUser(id);
    }
}