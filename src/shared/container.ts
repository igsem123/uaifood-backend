import {container} from "tsyringe";
import {UserService} from "../services/userService";
import {UserController} from "../controllers/userController";
import {CategoryService} from "../services/categoryService";
import {CategoryController} from "../controllers/categoryController";
import {AddressService} from "../services/addressService";
import {AddressController} from "../controllers/addressController";
import {AuthService} from "../services/authService";
import {AuthController} from "../controllers/authController";

// User
container.registerSingleton<UserService>(UserService, UserService);
container.registerSingleton<UserController>(UserController, UserController);

// Category
container.registerSingleton<CategoryService>(CategoryService, CategoryService);
container.registerSingleton<CategoryController>(CategoryController, CategoryController);

// Address
container.registerSingleton<AddressService>(AddressService, AddressService);
container.registerSingleton<AddressController>(AddressController, AddressController);

// Auth
container.registerSingleton<AuthService>(AuthService, AuthService);
container.registerSingleton<AuthController>(AuthController, AuthController);

export {container};
