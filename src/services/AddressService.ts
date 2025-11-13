import {inject, injectable} from "tsyringe";
import {AddressRepository} from "../repositories/AddressRepository";
import {Address} from "@prisma/client";
import {CreateAddressScheme, UpdateAddressScheme} from "../zodSchemes/AddressScheme";
import {UserService} from "./UserService";

@injectable()
export class AddressService {
    constructor(@inject(UserService) private userService: UserService) {}
    createAddress = async (data: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> => {
        const user = await this.userService.findUserById(Number(data.userId));
        if (!user) {
            throw new Error('User not found');
        }
        CreateAddressScheme.parse(data);
        return await AddressRepository.createAddress(data);
    }

    updateAddress = async (data: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> => {
        const user = await this.userService.findUserById(Number(data.userId));
        if (!user) {
            throw new Error('User not found');
        }
        UpdateAddressScheme.parse(data);
        return await AddressRepository.updateAddress(data);
    }

    deleteAddress = async (id: number): Promise<Address> => {
        return await AddressRepository.deleteAddress(id);
    }
}