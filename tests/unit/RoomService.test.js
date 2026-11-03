
const RoomService = require(
    "../../src/modules/rooms/services/RoomService"
);

const RoomBuilder = require(
    "../../src/modules/rooms/builders/RoomBuilder"
);

const RoomValidator = require(
    "../../src/modules/rooms/validators/RoomValidator"
);

describe("RoomService", () => {
    let roomService;
    let roomRepository;
    let roomBuilder;
    let roomValidator;

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
        roomRepository = {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            checkAvailability: jest.fn(),
            findReservations: jest.fn(),
        };

        roomBuilder = new RoomBuilder();
        roomValidator = new RoomValidator();

        roomService = new RoomService(
            roomRepository,
            roomBuilder,
            roomValidator
        );
    });

    describe("create", () => {
        test("deve criar uma sala válida", async () => {
            roomRepository.create.mockResolvedValue(mockRoom);

            const roomData = {
                nome: " Sala de Reuniões ",
                descricao: "Sala para reuniões",
                capacidade: "10",
                localizacao: " Bloco A ",
                recursos: "Projetor",
            };

            const result = await roomService.create(roomData);

            expect(roomRepository.create).toHaveBeenCalledWith({
                nome: "Sala de Reuniões",
                descricao: "Sala para reuniões",
                capacidade: 10,
                localizacao: "Bloco A",
                recursos: "Projetor",
                status: "ATIVA",
            });

            expect(result).toEqual(mockRoom);
        });

        test("deve utilizar valores padrão", async () => {
            roomRepository.create.mockResolvedValue(mockRoom);

            await roomService.create({
                nome: "Sala 01",
                capacidade: 5,
                localizacao: "Bloco B",
            });

            expect(roomRepository.create).toHaveBeenCalledWith({
                nome: "Sala 01",
                descricao: null,
                capacidade: 5,
                localizacao: "Bloco B",
                recursos: null,
                status: "ATIVA",
            });
        });

        test("deve rejeitar sala sem nome", async () => {
            await expect(
                roomService.create({
                    capacidade: 10,
                    localizacao: "Bloco A",
                })
            ).rejects.toThrow(
                "Nome, capacidade e localização são obrigatórios."
            );

            expect(roomRepository.create).not.toHaveBeenCalled();
        });

        test("deve rejeitar capacidade inválida", async () => {
            await expect(
                roomService.create({
                    nome: "Sala 01",
                    capacidade: -5,
                    localizacao: "Bloco A",
                })
            ).rejects.toThrow(
                "A capacidade deve ser um número inteiro maior que zero."
            );

            expect(roomRepository.create).not.toHaveBeenCalled();
        });
    });

    describe("findAll", () => {
        test("deve listar todas as salas", async () => {
            roomRepository.findAll.mockResolvedValue([mockRoom]);

            const result = await roomService.findAll();

            expect(result).toEqual([mockRoom]);
            expect(roomRepository.findAll).toHaveBeenCalledTimes(1);
        });

        test("deve retornar lista vazia", async () => {
            roomRepository.findAll.mockResolvedValue([]);

            const result = await roomService.findAll();

            expect(result).toEqual([]);
        });
    });

    describe("findById", () => {
        test("deve buscar sala pelo ID", async () => {
            roomRepository.findById.mockResolvedValue(mockRoom);

            const result = await roomService.findById(1);

            expect(result).toEqual(mockRoom);
            expect(roomRepository.findById).toHaveBeenCalledWith(1);
        });

        test("deve lançar erro quando sala não existe", async () => {
            roomRepository.findById.mockResolvedValue(null);

            await expect(
                roomService.findById(999)
            ).rejects.toThrow("Sala não encontrada.");
        });
    });

    describe("update", () => {
        beforeEach(() => {
            roomRepository.findById.mockResolvedValue(mockRoom);
        });

        test("deve atualizar todos os campos", async () => {
            const updateData = {
                nome: " Sala Atualizada ",
                descricao: "Nova descrição",
                capacidade: "20",
                localizacao: " Bloco C ",
                recursos: "Wi-Fi",
                status: "INATIVA",
            };

            roomRepository.update.mockResolvedValue({
                ...mockRoom,
                ...updateData,
            });

            await roomService.update(1, updateData);

            expect(roomRepository.update).toHaveBeenCalledWith(
                1,
                {
                    nome: "Sala Atualizada",
                    descricao: "Nova descrição",
                    capacidade: 20,
                    localizacao: "Bloco C",
                    recursos: "Wi-Fi",
                    status: "INATIVA",
                }
            );
        });

        test("deve atualizar apenas campos informados", async () => {
            roomRepository.update.mockResolvedValue({
                ...mockRoom,
                capacidade: 15,
            });

            await roomService.update(1, {
                capacidade: 15,
            });

            expect(roomRepository.update).toHaveBeenCalledWith(
                1,
                { capacidade: 15 }
            );
        });

        test("deve rejeitar status inválido", async () => {
            await expect(
                roomService.update(1, {
                    status: "BLOQUEADA",
                })
            ).rejects.toThrow(
                "O status deve ser ATIVA ou INATIVA."
            );

            expect(roomRepository.update).not.toHaveBeenCalled();
        });

        test("deve rejeitar atualização de sala inexistente", async () => {
            roomRepository.findById.mockResolvedValue(null);

            await expect(
                roomService.update(999, {
                    nome: "Outra sala",
                })
            ).rejects.toThrow("Sala não encontrada.");

            expect(roomRepository.update).not.toHaveBeenCalled();
        });
    });

    describe("delete", () => {
        test("deve excluir sala existente", async () => {
            roomRepository.findById.mockResolvedValue(mockRoom);
            roomRepository.delete.mockResolvedValue(1);

            const result = await roomService.delete(1);

            expect(roomRepository.delete).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockRoom);
        });

        test("não deve excluir sala inexistente", async () => {
            roomRepository.findById.mockResolvedValue(null);

            await expect(
                roomService.delete(999)
            ).rejects.toThrow("Sala não encontrada.");

            expect(roomRepository.delete).not.toHaveBeenCalled();
        });
    });

    describe("checkAvailability", () => {
        const startDate = "2026-12-10T10:00:00Z";
        const endDate = "2026-12-10T11:00:00Z";

        beforeEach(() => {
            roomRepository.findById.mockResolvedValue(mockRoom);
        });

        test("deve retornar sala disponível", async () => {
            roomRepository.checkAvailability.mockResolvedValue(true);

            const result = await roomService.checkAvailability(
                1,
                startDate,
                endDate
            );

            expect(result).toEqual({
                roomId: 1,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                available: true,
            });

            expect(
                roomRepository.checkAvailability
            ).toHaveBeenCalledWith(
                1,
                new Date(startDate),
                new Date(endDate)
            );
        });

        test("deve retornar sala indisponível", async () => {
            roomRepository.checkAvailability.mockResolvedValue(false);

            const result = await roomService.checkAvailability(
                1,
                startDate,
                endDate
            );

            expect(result.available).toBe(false);
        });

        test("deve rejeitar datas ausentes", async () => {
            await expect(
                roomService.checkAvailability(1, null, null)
            ).rejects.toThrow(
                "Data inicial e data final são obrigatórias."
            );
        });

        test("deve rejeitar datas inválidas", async () => {
            await expect(
                roomService.checkAvailability(
                    1,
                    "data-invalida",
                    endDate
                )
            ).rejects.toThrow(
                "As datas informadas são inválidas."
            );
        });

        test("deve rejeitar intervalo invertido", async () => {
            await expect(
                roomService.checkAvailability(
                    1,
                    endDate,
                    startDate
                )
            ).rejects.toThrow(
                "A data inicial deve ser anterior à data final."
            );
        });

        test("deve rejeitar datas iguais", async () => {
            await expect(
                roomService.checkAvailability(
                    1,
                    startDate,
                    startDate
                )
            ).rejects.toThrow(
                "A data inicial deve ser anterior à data final."
            );
        });

        test("deve rejeitar sala inexistente", async () => {
            roomRepository.findById.mockResolvedValue(null);

            await expect(
                roomService.checkAvailability(
                    999,
                    startDate,
                    endDate
                )
            ).rejects.toThrow("Sala não encontrada.");
        });
    });

    describe("findReservations", () => {
        test("deve listar reservas da sala", async () => {
            roomRepository.findById.mockResolvedValue(mockRoom);

            const reservations = [
                {
                    id: 1,
                    roomId: 1,
                    userId: 2,
                },
            ];

            roomRepository.findReservations.mockResolvedValue(
                reservations
            );

            const result = await roomService.findReservations(1);

            expect(result).toEqual(reservations);
            expect(
                roomRepository.findReservations
            ).toHaveBeenCalledWith(1);
        });

        test("deve rejeitar sala inexistente", async () => {
            roomRepository.findById.mockResolvedValue(null);

            await expect(
                roomService.findReservations(999)
            ).rejects.toThrow("Sala não encontrada.");

            expect(
                roomRepository.findReservations
            ).not.toHaveBeenCalled();
        });
    });
});
