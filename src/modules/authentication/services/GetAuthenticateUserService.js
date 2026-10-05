const AppError = require("../../../shared/errors/AppError");

const UserRepositoryBridge = require(
    "../../users/repositories/UserRepositoryBridge"
);

const SequelizeUserRepository = require(
    "../../users/repositories/SequelizeUserRepository"
);

class GetAuthenticatedUserService {
    constructor({
        userRepository = new UserRepositoryBridge(
            new SequelizeUserRepository()
        ),
    } = {}) {
        this.userRepository = userRepository;
    }

    async execute(userId) {
        const user =
            await this.userRepository.findById(
                userId
            );

        if (!user) {
            throw new AppError(
                "Usuário autenticado não encontrado.",
                404
            );
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }
}

module.exports = GetAuthenticatedUserService;