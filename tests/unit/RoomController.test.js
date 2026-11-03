
const RoomController = require(
    "../../src/modules/rooms/controllers/RoomController"
);

describe("RoomController", () => {
    let controller;
    let roomService;
    let req;
    let res;
    let next;

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
        roomService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            checkAvailability: jest.fn(),
            findReservations: jest.fn(),
        };

        controller = new RoomController(roomService);

        req = {
            body: {},
            params: {},
            query: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };

        next = jest.fn();
    });

    describe("create", () => {
        test("deve criar sala e retornar 201", async () => {
            req.body = {
                nome: "Sala de Reuniões",
                capacidade: 10,
                localizacao: "Bloco A",
            };

            roomService.create.mockResolvedValue(mockRoom);

            await controller.create(req, res, next);

            expect(roomService.create).toHaveBeenCalledWith(
                req.body
            );

            expect(res.status).toHaveBeenCalledWith(201);

            expect(res.json).toHaveBeenCalledWith({
                message: "Sala criada com sucesso.",
                room: mockRoom,
            });

            expect(next).not.toHaveBeenCalled();
        });

        test("deve encaminhar erro ao middleware", async () => {
            const error = new Error("Erro ao criar sala");

            roomService.create.mockRejectedValue(error);

            const consoleSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            try {
                await controller.create(req, res, next);

                expect(next).toHaveBeenCalledWith(error);
                expect(res.status).not.toHaveBeenCalled();
                expect(res.json).not.toHaveBeenCalled();
            } finally {
                consoleSpy.mockRestore();
            }
        });
    });

    describe("findAll", () => {
        test("deve listar salas e retornar 200", async () => {
            roomService.findAll.mockResolvedValue([mockRoom]);

            await controller.findAll(req, res, next);

            expect(roomService.findAll).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([mockRoom]);
            expect(next).not.toHaveBeenCalled();
        });

        test("deve retornar lista vazia", async () => {
            roomService.findAll.mockResolvedValue([]);

            await controller.findAll(req, res, next);

            expect(res.json).toHaveBeenCalledWith([]);
        });

        test("deve encaminhar erro", async () => {
            const error = new Error("Erro ao listar salas");

            roomService.findAll.mockRejectedValue(error);

            await controller.findAll(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("findById", () => {
        test("deve buscar sala pelo ID", async () => {
            req.params.id = "1";

            roomService.findById.mockResolvedValue(mockRoom);

            await controller.findById(req, res, next);

            expect(roomService.findById).toHaveBeenCalledWith(
                "1"
            );

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockRoom);
        });

        test("deve encaminhar erro de sala inexistente", async () => {
            req.params.id = "999";

            const error = new Error("Sala não encontrada.");

            roomService.findById.mockRejectedValue(error);

            await controller.findById(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("update", () => {
        test("deve atualizar sala e retornar 200", async () => {
            req.params.id = "1";
            req.body = {
                nome: "Sala Atualizada",
            };

            const updatedRoom = {
                ...mockRoom,
                nome: "Sala Atualizada",
            };

            roomService.update.mockResolvedValue(updatedRoom);

            await controller.update(req, res, next);

            expect(roomService.update).toHaveBeenCalledWith(
                "1",
                req.body
            );

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedRoom);
        });

        test("deve encaminhar erro de atualização", async () => {
            req.params.id = "1";

            const error = new Error("Erro ao atualizar sala");

            roomService.update.mockRejectedValue(error);

            await controller.update(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("delete", () => {
        test("deve excluir sala e retornar 204", async () => {
            req.params.id = "1";

            roomService.delete.mockResolvedValue(mockRoom);

            await controller.delete(req, res, next);

            expect(roomService.delete).toHaveBeenCalledWith(
                "1"
            );

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.json).not.toHaveBeenCalled();
        });

        test("deve encaminhar erro de exclusão", async () => {
            req.params.id = "999";

            const error = new Error("Sala não encontrada.");

            roomService.delete.mockRejectedValue(error);

            await controller.delete(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("checkAvailability", () => {
        test("deve consultar disponibilidade", async () => {
            req.params.roomId = "1";

            req.query = {
                startDate: "2026-12-10T10:00:00Z",
                endDate: "2026-12-10T11:00:00Z",
            };

            const availability = {
                roomId: 1,
                startDate: new Date(req.query.startDate),
                endDate: new Date(req.query.endDate),
                available: true,
            };

            roomService.checkAvailability.mockResolvedValue(
                availability
            );

            await controller.checkAvailability(req, res, next);

            expect(
                roomService.checkAvailability
            ).toHaveBeenCalledWith(
                "1",
                req.query.startDate,
                req.query.endDate
            );

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(availability);
        });

        test("deve encaminhar erro de disponibilidade", async () => {
            req.params.roomId = "1";

            const error = new Error("Datas inválidas");

            roomService.checkAvailability.mockRejectedValue(error);

            await controller.checkAvailability(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("findReservations", () => {
        test("deve listar reservas da sala", async () => {
            req.params.roomId = "1";

            const reservations = [
                {
                    id: 10,
                    roomId: 1,
                    userId: 2,
                    status: "CONFIRMADA",
                },
            ];

            roomService.findReservations.mockResolvedValue(
                reservations
            );

            await controller.findReservations(req, res, next);

            expect(
                roomService.findReservations
            ).toHaveBeenCalledWith("1");

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                roomId: 1,
                reservations,
            });
        });

        test("deve retornar lista vazia de reservas", async () => {
            req.params.roomId = "1";

            roomService.findReservations.mockResolvedValue([]);

            await controller.findReservations(req, res, next);

            expect(res.json).toHaveBeenCalledWith({
                roomId: 1,
                reservations: [],
            });
        });

        test("deve encaminhar erro ao listar reservas", async () => {
            req.params.roomId = "1";

            const error = new Error("Erro ao buscar reservas");

            roomService.findReservations.mockRejectedValue(error);

            await controller.findReservations(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
