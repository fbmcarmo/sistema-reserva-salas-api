
const UserService = require(
    "../../src/modules/users/services/UserService"
);

describe("UserService", () => {
    let userService;
    let userRepository;
    let passwordHasher;
    let userValidator;

    const mockUser = {
        id: 1,
        name: "Bruno Moreira",
        email: "bruno@email.com",
        password: "senha-hash",
        role: "USER",
    };

    beforeEach(() => {
        userRepository = {
            findByEmail: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        passwordHasher = {
            hash: jest.fn().mockResolvedValue("senha-hash"),
        };

        userValidator = {
            validateRegistration: jest.fn(),
            validateUpdate: jest.fn(),
        };

        userService = new UserService({
            userRepository,
            passwordHasher,
            userValidator,
        });
    });

    describe("register", () => {
        const registrationData = {
            name: " Bruno Moreira ",
            email: " BRUNO@EMAIL.COM ",
            password: "12345678",
        };

        test("deve cadastrar usuário com dados normalizados", async () => {
            userRepository.findByEmail.mockResolvedValue(null);
            userRepository.create.mockResolvedValue(mockUser);

            const result = await userService.register(
                registrationData
            );

            expect(
                userValidator.validateRegistration
            ).toHaveBeenCalledWith(registrationData);

            expect(
                userRepository.findByEmail
            ).toHaveBeenCalledWith("bruno@email.com");

            expect(passwordHasher.hash).toHaveBeenCalledWith(
                "12345678"
            );

            expect(userRepository.create).toHaveBeenCalledWith({
                name: "Bruno Moreira",
                email: "bruno@email.com",
                password: "senha-hash",
                role: "USER",
            });

            expect(result).toEqual({
                id: 1,
                name: "Bruno Moreira",
                email: "bruno@email.com",
                role: "USER",
            });

            expect(result).not.toHaveProperty("password");
        });

        test("deve rejeitar e-mail já cadastrado", async () => {
            userRepository.findByEmail.mockResolvedValue(mockUser);

            await expect(
                userService.register(registrationData)
            ).rejects.toThrow(
                "Já existe um usuário com este e-mail."
            );

            expect(passwordHasher.hash).not.toHaveBeenCalled();
            expect(userRepository.create).not.toHaveBeenCalled();
        });

        test("deve interromper cadastro se a validação falhar", async () => {
            userValidator.validateRegistration.mockImplementation(() => {
                throw new Error("Dados inválidos");
            });

            await expect(
                userService.register(registrationData)
            ).rejects.toThrow("Dados inválidos");

            expect(userRepository.findByEmail).not.toHaveBeenCalled();
            expect(userRepository.create).not.toHaveBeenCalled();
        });
    });

    describe("findAll", () => {
        test("deve listar usuários", async () => {
            userRepository.findAll.mockResolvedValue([mockUser]);

            const result = await userService.findAll();

            expect(result).toEqual([mockUser]);
            expect(userRepository.findAll).toHaveBeenCalledTimes(1);
        });

        test("deve retornar lista vazia", async () => {
            userRepository.findAll.mockResolvedValue([]);

            expect(await userService.findAll()).toEqual([]);
        });
    });

    describe("findById", () => {
        test("deve encontrar usuário pelo ID", async () => {
            userRepository.findById.mockResolvedValue(mockUser);

            const result = await userService.findById(1);

            expect(result).toEqual(mockUser);
            expect(userRepository.findById).toHaveBeenCalledWith(1);
        });

        test("deve rejeitar usuário inexistente", async () => {
            userRepository.findById.mockResolvedValue(null);

            await expect(
                userService.findById(999)
            ).rejects.toThrow("Usuário não encontrado.");
        });
    });

    describe("update", () => {
        beforeEach(() => {
            userRepository.findById.mockResolvedValue(mockUser);
        });

        test("deve atualizar nome, e-mail e senha", async () => {
            const data = {
                name: " Bruno Atualizado ",
                email: " NOVO@EMAIL.COM ",
                password: "novaSenha123",
            };

            userRepository.findByEmail.mockResolvedValue(null);
            userRepository.update.mockResolvedValue({
                ...mockUser,
                name: "Bruno Atualizado",
                email: "novo@email.com",
            });

            const result = await userService.update(1, data);

            expect(userValidator.validateUpdate).toHaveBeenCalledWith(
                data
            );

            expect(userRepository.findByEmail).toHaveBeenCalledWith(
                "novo@email.com"
            );

            expect(passwordHasher.hash).toHaveBeenCalledWith(
                "novaSenha123"
            );

            expect(userRepository.update).toHaveBeenCalledWith(
                1,
                {
                    name: "Bruno Atualizado",
                    email: "novo@email.com",
                    password: "senha-hash",
                }
            );

            expect(result.name).toBe("Bruno Atualizado");
        });

        test("deve atualizar apenas o nome", async () => {
            userRepository.update.mockResolvedValue({
                ...mockUser,
                name: "Novo Nome",
            });

            await userService.update(1, {
                name: " Novo Nome ",
            });

            expect(userRepository.update).toHaveBeenCalledWith(
                1,
                { name: "Novo Nome" }
            );

            expect(passwordHasher.hash).not.toHaveBeenCalled();
        });

        test("deve permitir manter o próprio e-mail", async () => {
            userRepository.findByEmail.mockResolvedValue(mockUser);
            userRepository.update.mockResolvedValue(mockUser);

            await userService.update("1", {
                email: " BRUNO@EMAIL.COM ",
            });

            expect(userRepository.update).toHaveBeenCalledWith(
                "1",
                { email: "bruno@email.com" }
            );
        });

        test("deve rejeitar e-mail de outro usuário", async () => {
            userRepository.findByEmail.mockResolvedValue({
                id: 2,
                email: "outro@email.com",
            });

            await expect(
                userService.update(1, {
                    email: "outro@email.com",
                })
            ).rejects.toThrow(
                "Já existe um usuário com este e-mail."
            );

            expect(userRepository.update).not.toHaveBeenCalled();
        });

        test("deve rejeitar usuário inexistente", async () => {
            userRepository.findById.mockResolvedValue(null);

            await expect(
                userService.update(999, {
                    name: "Novo Nome",
                })
            ).rejects.toThrow("Usuário não encontrado.");

            expect(userValidator.validateUpdate).not.toHaveBeenCalled();
            expect(userRepository.update).not.toHaveBeenCalled();
        });

        test("deve impedir atualização com dados inválidos", async () => {
            userValidator.validateUpdate.mockImplementation(() => {
                throw new Error("Atualização inválida");
            });

            await expect(
                userService.update(1, {
                    name: "",
                })
            ).rejects.toThrow("Atualização inválida");

            expect(userRepository.update).not.toHaveBeenCalled();
        });
    });

    describe("delete", () => {
        test("deve excluir usuário existente", async () => {
            userRepository.findById.mockResolvedValue(mockUser);
            userRepository.delete.mockResolvedValue(1);

            const result = await userService.delete(1);

            expect(userRepository.delete).toHaveBeenCalledWith(1);
            expect(result).toEqual({
                message: "Usuário excluído com sucesso.",
            });
        });

        test("deve rejeitar exclusão de usuário inexistente", async () => {
            userRepository.findById.mockResolvedValue(null);

            await expect(
                userService.delete(999)
            ).rejects.toThrow("Usuário não encontrado.");

            expect(userRepository.delete).not.toHaveBeenCalled();
        });
    });

    describe("removeSensitiveData", () => {
        test("deve remover senha e outros campos sensíveis", () => {
            const result = userService.removeSensitiveData({
                ...mockUser,
                token: "token-secreto",
            });

            expect(result).toEqual({
                id: 1,
                name: "Bruno Moreira",
                email: "bruno@email.com",
                role: "USER",
            });

            expect(result).not.toHaveProperty("password");
            expect(result).not.toHaveProperty("token");
        });
    });
});
