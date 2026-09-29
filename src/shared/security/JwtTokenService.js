const jwt = require("jsonwebtoken");
const AppError = require("../errors/AppError");

class JwtTokenService {
    constructor() {
        this.secret = process.env.JWT_SECRET;
        this.expiresIn = process.env.JWT_EXPIRES_IN || "1h";

        if (!this.secret) {
            throw new Error("A variável JWT_SECRET não foi definida.");
        }
    }

    generateToken(user) {
        return jwt.sign(
            {
                sub: String(user.id),
                role: user.role,
            },
            this.secret,
            {
                expiresIn: this.expiresIn,
                issuer: "sistema-reserva-salas-api",
            }
        );
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.secret, {
                issuer: "sistema-reserva-salas-api",
            });
        } catch (error) {
            throw new AppError("Token inválido ou expirado.", 401);
        }
    }
}

module.exports = JwtTokenService;