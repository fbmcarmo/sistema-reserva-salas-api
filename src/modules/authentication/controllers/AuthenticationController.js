const UserService = require(
    "../../users/services/UserService"
);

const UserRepositoryBridge = require(
    "../../users/repositories/UserRepositoryBridge"
);

const SequelizeUserRepository = require(
    "../../users/repositories/SequelizeUserRepository"
);

const AuthenticateUserService = require(
    "../services/AuthenticateUserService"
);

const GetAuthenticatedUserService = require(
    "../services/GetAuthenticateUserService"
);

class AuthenticationController {
    constructor({
        userService = new UserService({
            userRepository:
                new UserRepositoryBridge(
                    new SequelizeUserRepository()
                ),
        }),

        authenticateUserService =
            new AuthenticateUserService(),

        getAuthenticatedUserService =
            new GetAuthenticatedUserService(),
    } = {}) {
        this.userService = userService;

        this.authenticateUserService =
            authenticateUserService;

        this.getAuthenticatedUserService =
            getAuthenticatedUserService;
    }

    register = async (req, res, next) => {
        try {
            const user =
                await this.userService.register(
                    req.body
                );

            return res
                .status(201)
                .json({
                    message:
                        "Usuário cadastrado com sucesso.",
                    user,
                });
        } catch (error) {
            return next(error);
        }
    };

    login = async (req, res, next) => {
        try {
            const authentication =
                await this.authenticateUserService.execute(
                    req.body
                );

            return res
                .status(200)
                .json(authentication);
        } catch (error) {
            return next(error);
        }
    };

    me = async (req, res, next) => {
        try {
            const user =
                await this.getAuthenticatedUserService.execute(
                    req.auth.userId
                );

            return res
                .status(200)
                .json({
                    user,
                });
        } catch (error) {
            return next(error);
        }
    };
}

module.exports = AuthenticationController;