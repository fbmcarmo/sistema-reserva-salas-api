
const UserController = require(
    "../../src/modules/users/controllers/UserController"
);

describe("UserController", () => {
    let controller;
    let userService;
    let req;
    let res;
    let next;

    const mockUser = {
        id: 1,
        name: "Bruno Moreira",
        email: "bruno@email.com",
        role: "USER",
    };

    beforeEach(() => {
        userService = {
            register: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        controller = new UserController(userService);

        req = {
            body: {},
            params: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        next = jest.fn();
    });

    describe("register", () => {
        test("deve cadastrar usuário e retornar 201", async () => {
            req.body = {
                name: "Bruno Moreira",
                email: "bruno@email.com",
                password: "12345678",
            };

            userService.register.mockResolvedValue(mockUser);

            await controller.register(req, res, next);

            expect(userService.register).toHaveBeenCalledWith(
                req.body
            );

            expect(res.status).toHaveBeenCalledWith(201);

            expect(res.json).toHaveBeenCalledWith({
                message: "Usuário cadastrado com sucesso.",
                user: mockUser,
            });

            expect(next).not.toHaveBeenCalled();
        });

        test("deve encaminhar erro de cadastro", async () => {
            const error = new Error("E-mail já cadastrado");

            userService.register.mockRejectedValue(error);

            await controller.register(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("findAll", () => {
        test("deve listar usuários", async () => {
            userService.findAll.mockResolvedValue([mockUser]);

            await controller.findAll(req, res, next);

            expect(userService.findAll).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                users: [mockUser],
            });
        });

        test("deve retornar lista vazia", async () => {
            userService.findAll.mockResolvedValue([]);

            await controller.findAll(req, res, next);

            expect(res.json).toHaveBeenCalledWith({
                users: [],
            });
        });

        test("deve encaminhar erro de listagem", async () => {
            const error = new Error("Erro ao listar usuários");

            userService.findAll.mockRejectedValue(error);

            await controller.findAll(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("findById", () => {
        test("deve buscar usuário pelo ID", async () => {
            req.params.id = "1";

            userService.findById.mockResolvedValue(mockUser);

            await controller.findById(req, res, next);

            expect(userService.findById).toHaveBeenCalledWith(
                "1"
            );

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                user: mockUser,
            });
        });

        test("deve encaminhar erro de usuário inexistente", async () => {
            req.params.id = "999";

            const error = new Error("Usuário não encontrado.");

            userService.findById.mockRejectedValue(error);

            await controller.findById(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("update", () => {
        test("deve atualizar usuário", async () => {
            req.params.id = "1";

            req.body = {
                name: "Bruno Atualizado",
            };

            const updatedUser = {
                ...mockUser,
                name: "Bruno Atualizado",
            };

            userService.update.mockResolvedValue(updatedUser);

            await controller.update(req, res, next);

            expect(userService.update).toHaveBeenCalledWith(
                "1",
                req.body
            );

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                message: "Usuário atualizado com sucesso.",
                user: updatedUser,
            });
        });

        test("deve encaminhar erro de atualização", async () => {
            req.params.id = "1";

            const error = new Error("Erro ao atualizar usuário");

            userService.update.mockRejectedValue(error);

            await controller.update(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("delete", () => {
        test("deve excluir usuário", async () => {
            req.params.id = "1";

            const result = {
                message: "Usuário excluído com sucesso.",
            };

            userService.delete.mockResolvedValue(result);

            await controller.delete(req, res, next);

            expect(userService.delete).toHaveBeenCalledWith(
                "1"
            );

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(result);
        });

        test("deve encaminhar erro de exclusão", async () => {
            req.params.id = "999";

            const error = new Error("Usuário não encontrado.");

            userService.delete.mockRejectedValue(error);

            await controller.delete(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
