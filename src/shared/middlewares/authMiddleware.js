const JwtTokenService = require("../security/JwtTokenService");
const AppError = require("../errors/AppError");

class AuthMiddleware {
    constructor({ jwtTokenService = new JwtTokenService() } = {}) {
        this.jwtTokenService = jwtTokenService;
    }

    authenticate = (req, res, next) => {
        try {
            const authorizationHeader = req.headers.authorization;

            if (!authorizationHeader) {
                throw new AppError("Token de autenticação não informado.", 401);
            }

            const [scheme, token] = authorizationHeader.split(" ");

            if (scheme !== "Bearer" || !token) {
                throw new AppError(
                    "Formato de token inválido. Utilize Bearer <token>.",
                    401
                );
            }

            const decodedToken = this.jwtTokenService.verifyToken(token);

            req.auth = {
                userId: decodedToken.sub,
                role: decodedToken.role,
            };

            return next();
        } catch (error) {
            return next(error);
        }
    };
}

module.exports = new AuthMiddleware();