const AppError = require("../errors/AppError");

class AuthorizationMiddleware {
    allowRoles(...allowedRoles) {
        return (req, res, next) => {
            if (!req.auth) {
                return next(
                    new AppError("Autenticação necessária.", 401)
                );
            }

            if (!allowedRoles.includes(req.auth.role)) {
                return next(
                    new AppError("Você não tem permissão para acessar este recurso.", 403)
                );
            }

            return next();
        };
    }
}

module.exports = new AuthorizationMiddleware();