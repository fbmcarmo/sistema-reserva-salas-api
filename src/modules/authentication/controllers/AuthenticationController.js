const AuthenticateUserService = require("../services/AuthenticateUserService");

class AuthenticationController {
    constructor({
        authenticateUserService = new AuthenticateUserService(),
    } = {}) {
        this.authenticateUserService = authenticateUserService;
    }

    login = async (req, res, next) => {
        try {
            const result = await this.authenticateUserService.execute(req.body);

            return res.status(200).json(result);
        } catch (error) {
            return next(error);
        }
    };
}

module.exports = AuthenticationController;