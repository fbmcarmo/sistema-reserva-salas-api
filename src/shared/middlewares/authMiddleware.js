const jwt = require("jsonwebtoken");

const AppError = require("../errors/AppError");

class AuthMiddleware {

    authenticate = (req, res, next) => {
        try {
            const authorizationHeader =
                req.headers.authorization;

            if (!authorizationHeader) {
                throw new AppError(
                    "Token de autenticação não informado.",
                    401
                );
            }

            const [scheme, token] =
                authorizationHeader.split(" ");

            if (
                scheme !== "Bearer" ||
                !token
            ) {
                throw new AppError(
                    "Formato do token de autenticação inválido.",
                    401
                );
            }

            const decodedToken =
                jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );

            req.auth = decodedToken;

            return next();

        } catch (error) {

            if (error.name === "JsonWebTokenError") {
                return next(
                    new AppError(
                        "Token de autenticação inválido.",
                        401
                    )
                );
            }

            if (error.name === "TokenExpiredError") {
                return next(
                    new AppError(
                        "Token de autenticação expirado.",
                        401
                    )
                );
            }

            return next(error);
        }
    };

    authorizeAdmin = (req, res, next) => {

        if (!req.auth) {
            return next(
                new AppError(
                    "Usuário não autenticado.",
                    401
                )
            );
        }

        if (req.auth.role !== "ADMIN") {
            return next(
                new AppError(
                    "Acesso permitido somente para administradores.",
                    403
                )
            );
        }

        return next();
    };
}

module.exports = new AuthMiddleware();

