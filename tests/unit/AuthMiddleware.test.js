
const jwt = require("jsonwebtoken");

const AuthMiddleware = require(
    "../../src/shared/middlewares/AuthMiddleware"
);

jest.mock("jsonwebtoken");

describe("AuthMiddleware", () => {
    let req;
    let res;
    let next;

    const originalSecret = process.env.JWT_SECRET;

    beforeEach(() => {
        jest.clearAllMocks();

        process.env.JWT_SECRET = "secret-test";

        req = {
            headers: {},
            auth: undefined,
        };

        res = {};
        next = jest.fn();
    });

    afterAll(() => {
        if (originalSecret === undefined) {
            delete process.env.JWT_SECRET;
        } else {
            process.env.JWT_SECRET = originalSecret;
        }
    });

    describe("authenticate", () => {
        test("deve autenticar token válido", () => {
            req.headers.authorization = "Bearer token-valido";

            jwt.verify.mockReturnValue({
                userId: 1,
                role: "USER",
            });

            AuthMiddleware.authenticate(req, res, next);

            expect(jwt.verify).toHaveBeenCalledWith(
                "token-valido",
                "secret-test"
            );

            expect(req.auth).toEqual({
                userId: 1,
                role: "USER",
            });

            expect(next).toHaveBeenCalledWith();
        });

        test("deve rejeitar ausência de token", () => {
            AuthMiddleware.authenticate(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: "Token de autenticação não informado.",
                    statusCode: 401,
                })
            );

            expect(jwt.verify).not.toHaveBeenCalled();
        });

        test.each([
            "Basic token",
            "Bearer",
            "token",
            "bearer token",
        ])(
            "deve rejeitar formato inválido: %s",
            (authorization) => {
                req.headers.authorization = authorization;

                AuthMiddleware.authenticate(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({
                        message:
                            "Formato do token de autenticação inválido.",
                        statusCode: 401,
                    })
                );

                expect(jwt.verify).not.toHaveBeenCalled();
            }
        );

        test("deve rejeitar token JWT inválido", () => {
            req.headers.authorization = "Bearer token-invalido";

            const error = new Error("jwt malformed");
            error.name = "JsonWebTokenError";

            jwt.verify.mockImplementation(() => {
                throw error;
            });

            AuthMiddleware.authenticate(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: "Token de autenticação inválido.",
                    statusCode: 401,
                })
            );
        });

        test("deve rejeitar token expirado", () => {
            req.headers.authorization = "Bearer token-expirado";

            const error = new Error("jwt expired");
            error.name = "TokenExpiredError";

            jwt.verify.mockImplementation(() => {
                throw error;
            });

            AuthMiddleware.authenticate(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: "Token de autenticação expirado.",
                    statusCode: 401,
                })
            );
        });

        test("deve encaminhar erro inesperado", () => {
            req.headers.authorization = "Bearer token";

            const error = new Error("Erro inesperado");

            jwt.verify.mockImplementation(() => {
                throw error;
            });

            AuthMiddleware.authenticate(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("authorizeAdmin", () => {
        test("deve permitir acesso de administrador", () => {
            req.auth = {
                userId: 1,
                role: "ADMIN",
            };

            AuthMiddleware.authorizeAdmin(req, res, next);

            expect(next).toHaveBeenCalledWith();
        });

        test("deve rejeitar usuário não autenticado", () => {
            AuthMiddleware.authorizeAdmin(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: "Usuário não autenticado.",
                    statusCode: 401,
                })
            );
        });

        test("deve rejeitar usuário sem permissão administrativa", () => {
            req.auth = {
                userId: 2,
                role: "USER",
            };

            AuthMiddleware.authorizeAdmin(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    message:
                        "Acesso permitido somente para administradores.",
                    statusCode: 403,
                })
            );
        });
    });
});
