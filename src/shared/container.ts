import {container} from "tsyringe";
import {UserService} from "../services/UserService";
import {UserController} from "../controllers/UserController";
import {CategoryService} from "../services/CategoryService";
import {CategoryController} from "../controllers/CategoryController";
import {AddressService} from "../services/AddressService";
import {AddressController} from "../controllers/AddressController";

// User
container.registerSingleton<UserService>(UserService, UserService);
container.registerSingleton<UserController>(UserController, UserController);

// Category
container.registerSingleton<CategoryService>(CategoryService, CategoryService);
container.registerSingleton<CategoryController>(CategoryController, CategoryController);

// Address
container.registerSingleton<AddressService>(AddressService, AddressService);
container.registerSingleton<AddressController>(AddressController, AddressController);

export {container};
