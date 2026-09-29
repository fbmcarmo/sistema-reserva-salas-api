const AppError = require("../../../shared/errors/AppError");
const UserRepository = require("../repositories/UserRepository");
const PasswordHasher = require("../../../shared/security/PasswordHasher");
const UserValidator = require("../validators/UserValidator");

class RegisterUserService {
    constructor({
        userRepository = new UserRepository(),
        passwordHasher = new PasswordHasher(),
        userValidator = new UserValidator(),
    } = {}) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.userValidator = userValidator;
    }

    async execute({ name, email, password }) {
        this.userValidator.validateRegistration({
            name,
            email,
            password,
        });

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await this.userRepository.findByEmail(
            normalizedEmail
        );

        if (existingUser) {
            throw new AppError("Já existe um usuário com este e-mail.", 409);
        }

        const hashedPassword = await this.passwordHasher.hash(password);

        const user = await this.userRepository.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "USER",
        });

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }
}

module.exports = RegisterUserService;