
const ErrorHandlerMiddleware = require(
    "../../src/shared/middlewares/ErrorHandlerMiddleware"
);

const AppError = require(
    "../../src/shared/errors/AppError"
);

describe("ErrorHandlerMiddleware", () => {
    let req;
    let res;
    let next;
    let consoleSpy;

    beforeEach(() => {
        req = {};
        next = jest.fn();

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        consoleSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    test("deve tratar erro 400", () => {
        const error = new AppError("Dados inválidos.", 400);

        ErrorHandlerMiddleware.handle(
            error,
            req,
            res,
            next
        );

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            message: "Dados inválidos.",
        });

        expect(consoleSpy).not.toHaveBeenCalled();
    });

    test("deve tratar erro 401", () => {
        const error = new AppError(
            "Usuário não autenticado.",
            401
        );

        ErrorHandlerMiddleware.handle(
            error,
            req,
            res,
            next
        );

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            message: "Usuário não autenticado.",
        });
    });

    test("deve tratar erro 403", () => {
        const error = new AppError(
            "Acesso negado.",
            403
        );

        ErrorHandlerMiddleware.handle(
            error,
            req,
            res,
            next
        );

        expect(res.status).toHaveBeenCalledWith(403);

        expect(res.json).toHaveBeenCalledWith({
            message: "Acesso negado.",
        });
    });

    test("deve tratar erro 404", () => {
        const error = new AppError(
            "Recurso não encontrado.",
            404
        );

        ErrorHandlerMiddleware.handle(
            error,
            req,
            res,
            next
        );

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({
            message: "Recurso não encontrado.",
        });
    });

    test("deve ocultar detalhes de erro interno", () => {
        const error = new Error(
            "Falha interna no banco de dados"
        );

        ErrorHandlerMiddleware.handle(
            error,
            req,
            res,
            next
        );

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            message: "Erro interno do servidor.",
        });

        expect(consoleSpy).toHaveBeenCalledWith(error);
    });

    test("deve ocultar detalhes de erro com status 500", () => {
        const error = new AppError(
            "Detalhes internos",
            500
        );

        ErrorHandlerMiddleware.handle(
            error,
            req,
            res,
            next
        );

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            message: "Erro interno do servidor.",
        });

        expect(consoleSpy).toHaveBeenCalledWith(error);
    });

    test("deve retornar resposta do Express", () => {
        const error = new AppError("Erro de validação.", 400);

        const result = ErrorHandlerMiddleware.handle(
            error,
            req,
            res,
            next
        );

        expect(result).toBe(res);
    });
});
