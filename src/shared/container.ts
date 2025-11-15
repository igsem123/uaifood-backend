import {container} from "tsyringe";
import {UserService} from "../services/userService";
import {UserController} from "../controllers/UserController";
import {CategoryService} from "../services/categoryService";
import {CategoryController} from "../controllers/CategoryController";
import {AddressService} from "../services/addressService";
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
