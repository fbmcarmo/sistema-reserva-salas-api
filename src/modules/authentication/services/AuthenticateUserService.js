const AppError = require("../../../shared/errors/AppError");
const UserRepository = require("../../users/repositories/UserRepository");
const PasswordHasher = require("../../../shared/security/PasswordHasher");
const JwtTokenService = require("../../../shared/security/JwtTokenService");

class AuthenticateUserService {
    constructor({
        userRepository = new UserRepository(),
        passwordHasher = new PasswordHasher(),
        jwtTokenService = new JwtTokenService(),
    } = {}) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.jwtTokenService = jwtTokenService;
    }

    async execute({ email, password }) {
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            throw new AppError("E-mail e senha são obrigatórios.", 400);
        }

        const user = await this.userRepository.findByEmail(
            email.trim().toLowerCase()
        );

        if (!user) {
            throw new AppError("E-mail ou senha inválidos.", 401);
        }

        const passwordMatches = await this.passwordHasher.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            throw new AppError("E-mail ou senha inválidos.", 401);
        }

        const token = this.jwtTokenService.generateToken(user);

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