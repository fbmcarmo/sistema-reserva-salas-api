
const UserValidator = require(
    "../../src/modules/users/validators/UserValidator"
);

describe("UserValidator", () => {
    let validator;

    const validUser = {
        name: "Bruno Moreira",
        email: "bruno@email.com",
        password: "12345678",
    };

    beforeEach(() => {
        validator = new UserValidator();
    });

    describe("validateRegistration", () => {
        test("deve aceitar cadastro válido", () => {
            expect(() => {
                validator.validateRegistration(validUser);
            }).not.toThrow();
        });

        test.each([
            ["name", { email: "bruno@email.com", password: "12345678" }],
            ["email", { name: "Bruno", password: "12345678" }],
            ["password", { name: "Bruno", email: "bruno@email.com" }],
        ])(
            "deve rejeitar ausência de %s",
            (field, data) => {
                expect(() => {
                    validator.validateRegistration(data);
                }).toThrow(
                    "Nome, e-mail e senha são obrigatórios."
                );
            }
        );

        test("deve rejeitar nome vazio", () => {
            expect(() => {
                validator.validateRegistration({
                    ...validUser,
                    name: "   ",
                });
            }).toThrow("O nome é obrigatório.");
        });

        test("deve rejeitar e-mail inválido", () => {
            expect(() => {
                validator.validateRegistration({
                    ...validUser,
                    email: "email-invalido",
                });
            }).toThrow("Informe um e-mail válido.");
        });

        test("deve rejeitar senha curta", () => {
            expect(() => {
                validator.validateRegistration({
                    ...validUser,
                    password: "123",
                });
            }).toThrow(
                "A senha deve ter pelo menos 8 caracteres."
            );
        });
    });

    describe("validateUpdate", () => {
        test("deve aceitar atualização de nome", () => {
            expect(() => {
                validator.validateUpdate({
                    name: "Novo Nome",
                });
            }).not.toThrow();
        });

        test("deve aceitar atualização de e-mail", () => {
            expect(() => {
                validator.validateUpdate({
                    email: "novo@email.com",
                });
            }).not.toThrow();
        });

        test("deve aceitar atualização de senha", () => {
            expect(() => {
                validator.validateUpdate({
                    password: "novaSenha123",
                });
            }).not.toThrow();
        });

        test("deve rejeitar atualização vazia", () => {
            expect(() => {
                validator.validateUpdate({});
            }).toThrow(
                "Informe pelo menos um campo para atualização."
            );
        });

        test("deve rejeitar nome inválido", () => {
            expect(() => {
                validator.validateUpdate({
                    name: "",
                });
            }).toThrow("O nome é obrigatório.");
        });

        test("deve rejeitar e-mail inválido", () => {
            expect(() => {
                validator.validateUpdate({
                    email: "invalido",
                });
            }).toThrow("Informe um e-mail válido.");
        });

        test("deve rejeitar senha inválida", () => {
            expect(() => {
                validator.validateUpdate({
                    password: "123",
                });
            }).toThrow(
                "A senha deve ter pelo menos 8 caracteres."
            );
        });
    });

    describe("validateName", () => {
        test.each([
            "",
            "   ",
            null,
            123,
        ])(
            "deve rejeitar nome inválido: %s",
            (name) => {
                expect(() => {
                    validator.validateName(name);
                }).toThrow("O nome é obrigatório.");
            }
        );

        test("deve aceitar nome válido", () => {
            expect(() => {
                validator.validateName("Bruno");
            }).not.toThrow();
        });
    });

    describe("validateEmail", () => {
        test.each([
            "",
            "email",
            "email@",
            "@dominio.com",
            "email@dominio",
            "email com espaco@dominio.com",
            null,
            123,
        ])(
            "deve rejeitar e-mail inválido: %s",
            (email) => {
                expect(() => {
                    validator.validateEmail(email);
                }).toThrow("Informe um e-mail válido.");
            }
        );

        test("deve aceitar e-mail válido", () => {
            expect(() => {
                validator.validateEmail("teste@email.com");
            }).not.toThrow();
        });
    });

    describe("validatePassword", () => {
        test.each([
            "",
            "123",
            "1234567",
            null,
            12345678,
        ])(
            "deve rejeitar senha inválida: %s",
            (password) => {
                expect(() => {
                    validator.validatePassword(password);
                }).toThrow(
                    "A senha deve ter pelo menos 8 caracteres."
                );
            }
        );

        test("deve aceitar senha com oito caracteres", () => {
            expect(() => {
                validator.validatePassword("12345678");
            }).not.toThrow();
        });

        test("deve aceitar senha longa", () => {
            expect(() => {
                validator.validatePassword("senhaMuitoSegura123");
            }).not.toThrow();
        });
    });
});
