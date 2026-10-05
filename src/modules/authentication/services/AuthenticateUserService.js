const AppError = require("../../../shared/errors/AppError");

const PasswordHasher = require(
    "../../../shared/security/PasswordHasher"
);

const JwtTokenService = require(
    "../../../shared/security/JwtTokenService"
);

const UserRepositoryBridge = require(
    "../../users/repositories/UserRepositoryBridge"
);

const SequelizeUserRepository = require(
    "../../users/repositories/SequelizeUserRepository"
);

class AuthenticateUserService {
    constructor({
        userRepository = new UserRepositoryBridge(
            new SequelizeUserRepository()
        ),
        passwordHasher = new PasswordHasher(),
        jwtTokenService = new JwtTokenService(),
    } = {}) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.jwtTokenService = jwtTokenService;
    }

    async execute({
        email,
        password,
    }) {
        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            throw new AppError(
                "E-mail e senha são obrigatórios.",
                400
            );
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        const user =
            await this.userRepository.findByEmail(
                normalizedEmail
            );

        if (!user) {
            throw new AppError(
                "E-mail ou senha inválidos.",
                401
            );
        }

        const passwordMatches =
            await this.passwordHasher.compare(
                password,
                user.password
            );

        if (!passwordMatches) {
            throw new AppError(
                "E-mail ou senha inválidos.",
                401
            );
        }

        const token =
            this.jwtTokenService.generate({
                userId: user.id,
                role: user.role,
            });

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
}

module.exports = AuthenticateUserService;