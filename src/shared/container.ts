import {container} from "tsyringe";
import {UserService} from "../services/userService";
import {UserController} from "../controllers/userController";
import {CategoryService} from "../services/categoryService";
import {CategoryController} from "../controllers/categoryController";
import {AddressService} from "../services/addressService";
import {AddressController} from "../controllers/addressController";
import {AuthService} from "../services/authService";
import {AuthController} from "../controllers/authController";
import {ItemService} from "../services/itemService";
import {ItemController} from "../controllers/itemController";
import {OrderService} from "../services/orderService";
import {OrderController} from "../controllers/orderController";
import {NotificationService} from "../services/notificationService";
import {NotificationController} from "../controllers/notificationController";

// Notification
container.registerSingleton<NotificationService>(NotificationService, NotificationService);
container.registerSingleton<NotificationController>(NotificationController, NotificationController);

// Order
container.registerSingleton<OrderService>(OrderService, OrderService);
container.registerSingleton<OrderController>(OrderController, OrderController);

// Item
container.registerSingleton<ItemService>(ItemService, ItemService);
container.registerSingleton<ItemController>(ItemController, ItemController);

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
