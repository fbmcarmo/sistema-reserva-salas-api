
const RoomRepositoryBridge = require(
    "../../src/modules/rooms/repositories/RoomRepositoryBridge"
);

describe("RoomRepositoryBridge", () => {
    let repositoryImplementation;
    let roomRepository;

    const mockRoom = {
        id: 1,
        nome: "Sala de Reuniões",
        descricao: "Sala para reuniões",
        capacidade: 10,
        localizacao: "Bloco A",
        recursos: "Projetor",
        status: "ATIVA",
    };

    beforeEach(() => {
        repositoryImplementation = {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            checkAvailability: jest.fn(),
            findReservations: jest.fn(),
        };

        roomRepository = new RoomRepositoryBridge(
            repositoryImplementation
        );
    });

    describe("create", () => {
        test("deve criar uma sala", async () => {
            repositoryImplementation.create.mockResolvedValue(
                mockRoom
            );

            const result = await roomRepository.create(mockRoom);

            expect(
                repositoryImplementation.create
            ).toHaveBeenCalledWith(mockRoom);

            expect(result).toEqual(mockRoom);
        });

        test("deve propagar erro ao criar sala", async () => {
            repositoryImplementation.create.mockRejectedValue(
                new Error("Erro ao criar sala")
            );

            await expect(
                roomRepository.create(mockRoom)
            ).rejects.toThrow("Erro ao criar sala");
        });
    });

    describe("findAll", () => {
        test("deve listar todas as salas", async () => {
            repositoryImplementation.findAll.mockResolvedValue([
                mockRoom,
            ]);

            const result = await roomRepository.findAll();

            expect(
                repositoryImplementation.findAll
            ).toHaveBeenCalledTimes(1);

            expect(result).toEqual([mockRoom]);
        });

        test("deve retornar lista vazia", async () => {
            repositoryImplementation.findAll.mockResolvedValue([]);

            expect(await roomRepository.findAll()).toEqual([]);
        });
    });

    describe("findById", () => {
        test("deve buscar sala pelo ID", async () => {
            repositoryImplementation.findById.mockResolvedValue(
                mockRoom
            );

            const result = await roomRepository.findById(1);

            expect(
                repositoryImplementation.findById
            ).toHaveBeenCalledWith(1);

            expect(result).toEqual(mockRoom);
        });

        test("deve retornar null para sala inexistente", async () => {
            repositoryImplementation.findById.mockResolvedValue(
                null
            );

            const result = await roomRepository.findById(999);

            expect(result).toBeNull();
        });
    });

    describe("update", () => {
        test("deve atualizar sala", async () => {
            const updateData = {
                nome: "Sala Atualizada",
                capacidade: 20,
            };

            repositoryImplementation.update.mockResolvedValue({
                ...mockRoom,
                ...updateData,
            });

            const result = await roomRepository.update(
                1,
                updateData
            );

            expect(
                repositoryImplementation.update
            ).toHaveBeenCalledWith(1, updateData);

            expect(result.nome).toBe("Sala Atualizada");
            expect(result.capacidade).toBe(20);
        });

        test("deve propagar erro na atualização", async () => {
            repositoryImplementation.update.mockRejectedValue(
                new Error("Erro ao atualizar sala")
            );

            await expect(
                roomRepository.update(1, {
                    nome: "Nova sala",
                })
            ).rejects.toThrow("Erro ao atualizar sala");
        });
    });

    describe("delete", () => {
        test("deve excluir sala", async () => {
            repositoryImplementation.delete.mockResolvedValue(1);

            const result = await roomRepository.delete(1);

            expect(
                repositoryImplementation.delete
            ).toHaveBeenCalledWith(1);

            expect(result).toBe(1);
        });

        test("deve propagar erro na exclusão", async () => {
            repositoryImplementation.delete.mockRejectedValue(
                new Error("Erro ao excluir sala")
            );

            await expect(
                roomRepository.delete(1)
            ).rejects.toThrow("Erro ao excluir sala");
        });
    });

    describe("checkAvailability", () => {
        const startDate = new Date(
            "2026-12-10T10:00:00Z"
        );

        const endDate = new Date(
            "2026-12-10T11:00:00Z"
        );

        test("deve retornar disponibilidade verdadeira", async () => {
            repositoryImplementation.checkAvailability
                .mockResolvedValue(true);

            const result = await roomRepository.checkAvailability(
                1,
                startDate,
                endDate
            );

            expect(
                repositoryImplementation.checkAvailability
            ).toHaveBeenCalledWith(
                1,
                startDate,
                endDate
            );

            expect(result).toBe(true);
        });

        test("deve retornar disponibilidade falsa", async () => {
            repositoryImplementation.checkAvailability
                .mockResolvedValue(false);

            const result = await roomRepository.checkAvailability(
                1,
                startDate,
                endDate
            );

            expect(result).toBe(false);
        });

        test("deve propagar erro na consulta", async () => {
            repositoryImplementation.checkAvailability
                .mockRejectedValue(
                    new Error("Erro ao consultar disponibilidade")
                );

            await expect(
                roomRepository.checkAvailability(
                    1,
                    startDate,
                    endDate
                )
            ).rejects.toThrow(
                "Erro ao consultar disponibilidade"
            );
        });
    });

    describe("findReservations", () => {
        test("deve listar reservas da sala", async () => {
            const reservations = [
                {
                    id: 1,
                    roomId: 1,
                    userId: 2,
                    status: "CONFIRMADA",
                },
            ];

            repositoryImplementation.findReservations
                .mockResolvedValue(reservations);

            const result = await roomRepository.findReservations(1);

            expect(
                repositoryImplementation.findReservations
            ).toHaveBeenCalledWith(1);

            expect(result).toEqual(reservations);
        });

        test("deve retornar lista vazia", async () => {
            repositoryImplementation.findReservations
                .mockResolvedValue([]);

            expect(
                await roomRepository.findReservations(1)
            ).toEqual([]);
        });
    });
});
