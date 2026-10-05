const AppError = require("../../../shared/errors/AppError");

const PasswordHasher = require(
    "../../../shared/security/PasswordHasher"
);

const UserValidator = require(
    "../validators/UserValidator"
);

const UserBuilder = require(
    "../builders/UserBuilder"
);

class UserService {
    constructor({
        userRepository,
        passwordHasher = new PasswordHasher(),
        userValidator = new UserValidator(),
    }) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.userValidator = userValidator;
    }

    async register({
        name,
        email,
        password,
    }) {
        this.userValidator.validateRegistration({
            name,
            email,
            password,
        });

        const normalizedEmail =
            email.trim().toLowerCase();

        const existingUser =
            await this.userRepository.findByEmail(
                normalizedEmail
            );

        if (existingUser) {
            throw new AppError(
                "Já existe um usuário com este e-mail.",
                409
            );
        }

        const hashedPassword =
            await this.passwordHasher.hash(
                password
            );

        const user =
            new UserBuilder()
                .setName(name.trim())
                .setEmail(normalizedEmail)
                .setPassword(hashedPassword)
                .setRole("USER")
                .build();

        const createdUser =
            await this.userRepository.create(user);

        return this.removeSensitiveData(
            createdUser
        );
    }

    async findAll() {
        return this.userRepository.findAll();
    }

    async findById(id) {
        const user =
            await this.userRepository.findById(id);

        if (!user) {
            throw new AppError(
                "Usuário não encontrado.",
                404
            );
        }

        return user;
    }

    async update(id, userData) {
        const existingUser =
            await this.userRepository.findById(id);

        if (!existingUser) {
            throw new AppError(
                "Usuário não encontrado.",
                404
            );
        }

        this.userValidator.validateUpdate(
            userData
        );

        const dataToUpdate = {};

        if (userData.name !== undefined) {
            dataToUpdate.name =
                userData.name.trim();
        }

        if (userData.email !== undefined) {
            const normalizedEmail =
                userData.email
                    .trim()
                    .toLowerCase();

            const userWithEmail =
                await this.userRepository.findByEmail(
                    normalizedEmail
                );

            if (
                userWithEmail &&
                userWithEmail.id !== Number(id)
            ) {
                throw new AppError(
                    "Já existe um usuário com este e-mail.",
                    409
                );
            }

            dataToUpdate.email =
                normalizedEmail;
        }

        if (userData.password !== undefined) {
            dataToUpdate.password =
                await this.passwordHasher.hash(
                    userData.password
                );
        }

        const updatedUser =
            await this.userRepository.update(
                id,
                dataToUpdate
            );

        return updatedUser;
    }

    async delete(id) {
        const user =
            await this.userRepository.findById(id);

        if (!user) {
            throw new AppError(
                "Usuário não encontrado.",
                404
            );
        }

        await this.userRepository.delete(id);

        return {
            message: "Usuário excluído com sucesso.",
        };
    }

    removeSensitiveData(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }
}

module.exports = UserService;