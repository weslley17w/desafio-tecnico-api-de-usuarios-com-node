import { UserController } from './app/controllers/userController.js';
import { UserService } from './app/services/userService.js';
import { UserRepository } from './app/repositories/userRepository.js';
import { AuthController } from './app/controllers/authController.js';
import { AuthService } from './app/services/authService.js';
import { AuthRepository } from './app/repositories/authRepository.js';
import { ProductRepository } from './app/repositories/productRepository.js';
import { ProductService } from './app/services/productService.js';
import { ProductController } from './app/controllers/productController.js';
import { CacheService } from './shared/sevices/cacheService.js';
import { redisClient } from './shared/db/redis.js';

const cacheService = new CacheService(redisClient);

const userRepository = new UserRepository();
const userService = new UserService(userRepository, cacheService);
const userController = new UserController(userService);

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository, userRepository);
const authController = new AuthController(authService);

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository, cacheService);
const productController = new ProductController(productService);

export { userController, authController, productController };
