const RegisterUserService = require("../services/RegisterUserService");
const UserRepository = require("../repositories/UserRepository");
const AppError = require("../../../shared/errors/AppError");

class UserController {
    constructor({
        registerUserService = new RegisterUserService(),
        userRepository = new UserRepository(),
    } = {}) {
        this.registerUserService = registerUserService;
        this.userRepository = userRepository;
    }

    register = async (req, res, next) => {
        try {
            const user = await this.registerUserService.execute(req.body);

            return res.status(201).json({
                message: "Usuário cadastrado com sucesso.",
                user,
            });
        } catch (error) {
            return next(error);
        }
    };

    findAll = async (req, res, next) => {
        try {
            const users = await this.userRepository.findAll();

            return res.status(200).json({ users });
        } catch (error) {
            return next(error);
        }
    };

    findById = async (req, res, next) => {
        try {
            const user = await this.userRepository.findById(req.params.id);

            if (!user) {
                throw new AppError("Usuário não encontrado.", 404);
            }

            return res.status(200).json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (error) {
            return next(error);
        }
    };
}

module.exports = UserController;