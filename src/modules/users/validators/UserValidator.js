const AppError = require(
    "../../../shared/errors/AppError"
);

class UserValidator {

    validateRegistration({
        name,
        email,
        password,
    }) {
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            throw new AppError(
                "Nome, e-mail e senha são obrigatórios.",
                400
            );
        }

        this.validateName(name);
        this.validateEmail(email);
        this.validatePassword(password);
    }

    validateUpdate({
        name,
        email,
        password,
    }) {
        if (
            name === undefined &&
            email === undefined &&
            password === undefined
        ) {
            throw new AppError(
                "Informe pelo menos um campo para atualização.",
                400
            );
        }

        if (name !== undefined) {
            this.validateName(name);
        }

        if (email !== undefined) {
            this.validateEmail(email);
        }

        if (password !== undefined) {
            this.validatePassword(password);
        }
    }

    validateName(name) {
        if (
            typeof name !== "string" ||
            !name.trim()
        ) {
            throw new AppError(
                "O nome é obrigatório.",
                400
            );
        }
    }

    validateEmail(email) {
        if (
            typeof email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                email
            )
        ) {
            throw new AppError(
                "Informe um e-mail válido.",
                400
            );
        }
    }

    validatePassword(password) {
        if (
            typeof password !== "string" ||
            password.length < 8
        ) {
            throw new AppError(
                "A senha deve ter pelo menos 8 caracteres.",
                400
            );
        }
    }
}

module.exports = UserValidator;
