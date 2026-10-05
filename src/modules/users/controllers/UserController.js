class UserController {
    constructor(userService) {
        this.userService = userService;
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

    findAll = async (req, res, next) => {
        try {
            const users =
                await this.userService.findAll();

            return res
                .status(200)
                .json({
                    users,
                });
        } catch (error) {
            return next(error);
        }
    };

    findById = async (req, res, next) => {
        try {
            const user =
                await this.userService.findById(
                    req.params.id
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

    update = async (req, res, next) => {
        try {
            const user =
                await this.userService.update(
                    req.params.id,
                    req.body
                );

            return res
                .status(200)
                .json({
                    message:
                        "Usuário atualizado com sucesso.",
                    user,
                });
        } catch (error) {
            return next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            const result =
                await this.userService.delete(
                    req.params.id
                );

            return res
                .status(200)
                .json(result);
        } catch (error) {
            return next(error);
        }
    };
}

module.exports = UserController;