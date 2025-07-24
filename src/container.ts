import { UserController } from './app/controllers/userController.js';
import { UserService } from './app/services/userService.js';
import { UserRepository } from './app/repositories/userRepository.js';
import { AuthController } from './app/controllers/authController.js';
import { AuthService } from './app/services/authService.js';
import { AuthRepository } from './app/repositories/authRepository.js';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository, userRepository);
const authController = new AuthController(authService);

export { userController, authController };
