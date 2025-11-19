import {inject, injectable} from "tsyringe";
import {AddressRepository} from "../repositories/addressRepository";
import {Address} from "@prisma/client";
import {CreateAddressScheme, UpdateAddressScheme} from "../zodSchemes/addressScheme";
import {UserService} from "./userService";

@injectable()
export class AddressService {
    constructor(@inject(UserService) private userService: UserService) {}
    createAddress = async (data: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> => {
        const user = await this.userService.findUserById(data.userId);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        CreateAddressScheme.parse(data);
        return await AddressRepository.createAddress(data);
    }

    updateAddress = async (userId: bigint, addressId: bigint, data: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> => {
        const user = await this.userService.findUserById(userId);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        UpdateAddressScheme.parse({userId, data});
        return await AddressRepository.updateAddress(userId, addressId, data);
    }

    deleteAddress = async (addressId: bigint, userId: bigint): Promise<Address> => {
        return await AddressRepository.deleteAddress(addressId, userId);
    }
}