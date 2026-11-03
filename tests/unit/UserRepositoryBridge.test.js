
const UserRepositoryBridge = require(
    "../../src/modules/users/repositories/UserRepositoryBridge"
);

describe("UserRepositoryBridge", () => {
    let repositoryImplementation;
    let userRepository;

    const mockUser = {
        id: 1,
        name: "Bruno Moreira",
        email: "bruno@email.com",
        password: "senha-hash",
        role: "USER",
    };

    beforeEach(() => {
        repositoryImplementation = {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        userRepository = new UserRepositoryBridge(
            repositoryImplementation
        );
    });

    describe("create", () => {
        test("deve criar usuário", async () => {
            repositoryImplementation.create.mockResolvedValue(
                mockUser
            );

            const result = await userRepository.create(mockUser);

            expect(
                repositoryImplementation.create
            ).toHaveBeenCalledWith(mockUser);

            expect(result).toEqual(mockUser);
        });

        test("deve propagar erro de criação", async () => {
            repositoryImplementation.create.mockRejectedValue(
                new Error("Erro ao criar usuário")
            );

            await expect(
                userRepository.create(mockUser)
            ).rejects.toThrow("Erro ao criar usuário");
        });
    });

    describe("findAll", () => {
        test("deve listar usuários", async () => {
            repositoryImplementation.findAll.mockResolvedValue([
                mockUser,
            ]);

            const result = await userRepository.findAll();

            expect(
                repositoryImplementation.findAll
            ).toHaveBeenCalledTimes(1);

            expect(result).toEqual([mockUser]);
        });

        test("deve retornar lista vazia", async () => {
            repositoryImplementation.findAll.mockResolvedValue([]);

            expect(await userRepository.findAll()).toEqual([]);
        });
    });

    describe("findById", () => {
        test("deve encontrar usuário pelo ID", async () => {
            repositoryImplementation.findById.mockResolvedValue(
                mockUser
            );

            const result = await userRepository.findById(1);

            expect(
                repositoryImplementation.findById
            ).toHaveBeenCalledWith(1);

            expect(result).toEqual(mockUser);
        });

        test("deve retornar null quando não encontrar", async () => {
            repositoryImplementation.findById.mockResolvedValue(
                null
            );

            const result = await userRepository.findById(999);

            expect(result).toBeNull();
        });
    });

    describe("findByEmail", () => {
        test("deve encontrar usuário pelo e-mail", async () => {
            repositoryImplementation.findByEmail.mockResolvedValue(
                mockUser
            );

            const result = await userRepository.findByEmail(
                "bruno@email.com"
            );

            expect(
                repositoryImplementation.findByEmail
            ).toHaveBeenCalledWith("bruno@email.com");

            expect(result).toEqual(mockUser);
        });

        test("deve retornar null para e-mail inexistente", async () => {
            repositoryImplementation.findByEmail.mockResolvedValue(
                null
            );

            const result = await userRepository.findByEmail(
                "inexistente@email.com"
            );

            expect(result).toBeNull();
        });
    });

    describe("update", () => {
        test("deve atualizar usuário", async () => {
            const updateData = {
                name: "Bruno Atualizado",
            };

            repositoryImplementation.update.mockResolvedValue({
                ...mockUser,
                ...updateData,
            });

            const result = await userRepository.update(
                1,
                updateData
            );

            expect(
                repositoryImplementation.update
            ).toHaveBeenCalledWith(
                1,
                updateData
            );

            expect(result.name).toBe("Bruno Atualizado");
        });

        test("deve propagar erro de atualização", async () => {
            repositoryImplementation.update.mockRejectedValue(
                new Error("Erro ao atualizar usuário")
            );

            await expect(
                userRepository.update(1, {
                    name: "Novo nome",
                })
            ).rejects.toThrow("Erro ao atualizar usuário");
        });
    });

    describe("delete", () => {
        test("deve excluir usuário", async () => {
            repositoryImplementation.delete.mockResolvedValue(1);

            const result = await userRepository.delete(1);

            expect(
                repositoryImplementation.delete
            ).toHaveBeenCalledWith(1);

            expect(result).toBe(1);
        });

        test("deve propagar erro de exclusão", async () => {
            repositoryImplementation.delete.mockRejectedValue(
                new Error("Erro ao excluir usuário")
            );

            await expect(
                userRepository.delete(1)
            ).rejects.toThrow("Erro ao excluir usuário");
        });
    });
});
