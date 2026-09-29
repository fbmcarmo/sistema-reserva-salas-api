const AppError = require("../../../shared/errors/AppError");

class UserValidator {
    validateRegistration({ name, email, password }) {
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            throw new AppError("Nome, e-mail e senha são obrigatórios.", 400);
        }

        if (!name.trim()) {
            throw new AppError("O nome é obrigatório.", 400);
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new AppError("Informe um e-mail válido.", 400);
        }

        if (password.length < 8) {
            throw new AppError("A senha deve ter pelo menos 8 caracteres.", 400);
        }
    }
}

module.exports = UserValidator;