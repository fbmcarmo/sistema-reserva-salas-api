
const ReservationController = require(
    "../../src/modules/reservations/controllers/ReservationController"
);

describe("ReservationController", () => {
    let controller;
    let reservationService;
    let req;
    let res;
    let next;

    const mockReservation = {
        id: 1,
        userId: 5,
        roomId: 2,
        startDate: "2026-12-10T10:00:00Z",
        endDate: "2026-12-10T11:00:00Z",
        status: "CONFIRMADA",
    };

    beforeEach(() => {
        reservationService = {
            findAll: jest.fn(),
            findById: jest.fn(),
            findMyReservations: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            cancel: jest.fn(),
        };

        controller = new ReservationController(
            reservationService
        );

        req = {
            params: {},
            body: {},
            auth: {
                userId: 5,
                role: "USER",
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        next = jest.fn();
    });

    describe("findAll", () => {
        test("deve listar todas as reservas", async () => {
            reservationService.findAll.mockResolvedValue([
                mockReservation,
            ]);

            await controller.findAll(req, res, next);

            expect(
                reservationService.findAll
            ).toHaveBeenCalledTimes(1);

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                reservations: [mockReservation],
            });
        });

        test("deve retornar lista vazia", async () => {
            reservationService.findAll.mockResolvedValue([]);

            await controller.findAll(req, res, next);

            expect(res.json).toHaveBeenCalledWith({
                reservations: [],
            });
        });

        test("deve encaminhar erro de listagem", async () => {
            const error = new Error("Erro ao listar reservas");

            reservationService.findAll.mockRejectedValue(error);

            await controller.findAll(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("findById", () => {
        test("deve buscar reserva pelo ID", async () => {
            req.params.id = "1";

            reservationService.findById.mockResolvedValue(
                mockReservation
            );

            await controller.findById(req, res, next);

            expect(
                reservationService.findById
            ).toHaveBeenCalledWith("1");

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                reservation: mockReservation,
            });
        });

        test("deve encaminhar erro de busca", async () => {
            req.params.id = "999";

            const error = new Error("Reserva não encontrada.");

            reservationService.findById.mockRejectedValue(error);

            await controller.findById(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("findMyReservations", () => {
        test("deve listar reservas do usuário autenticado", async () => {
            reservationService.findMyReservations
                .mockResolvedValue([mockReservation]);

            await controller.findMyReservations(req, res, next);

            expect(
                reservationService.findMyReservations
            ).toHaveBeenCalledWith(5);

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                reservations: [mockReservation],
            });
        });

        test("deve encaminhar erro", async () => {
            const error = new Error("Erro ao buscar reservas");

            reservationService.findMyReservations
                .mockRejectedValue(error);

            await controller.findMyReservations(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("create", () => {
        test("deve criar reserva usando usuário autenticado", async () => {
            req.body = {
                userId: 999,
                roomId: 2,
                startDate: "2026-12-10T10:00:00Z",
                endDate: "2026-12-10T11:00:00Z",
            };

            reservationService.create.mockResolvedValue(
                mockReservation
            );

            await controller.create(req, res, next);

            expect(
                reservationService.create
            ).toHaveBeenCalledWith({
                userId: 5,
                roomId: 2,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
            });

            expect(res.status).toHaveBeenCalledWith(201);

            expect(res.json).toHaveBeenCalledWith({
                message: "Reserva criada com sucesso.",
                reservation: mockReservation,
            });
        });

        test("deve encaminhar erro de criação", async () => {
            const error = new Error("Sala indisponível");

            reservationService.create.mockRejectedValue(error);

            await controller.create(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("update", () => {
        test("deve atualizar reserva com dados de autenticação", async () => {
            req.params.id = "1";

            req.body = {
                startDate: "2026-12-10T12:00:00Z",
                endDate: "2026-12-10T13:00:00Z",
            };

            const updatedReservation = {
                ...mockReservation,
                ...req.body,
            };

            reservationService.update.mockResolvedValue(
                updatedReservation
            );

            await controller.update(req, res, next);

            expect(
                reservationService.update
            ).toHaveBeenCalledWith(
                "1",
                5,
                "USER",
                req.body
            );

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                message: "Reserva atualizada com sucesso.",
                reservation: updatedReservation,
            });
        });

        test("deve encaminhar erro de atualização", async () => {
            req.params.id = "1";

            const error = new Error("Erro ao atualizar reserva");

            reservationService.update.mockRejectedValue(error);

            await controller.update(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("cancel", () => {
        test("deve cancelar reserva", async () => {
            req.params.id = "1";

            const result = {
                message: "Reserva cancelada com sucesso.",
            };

            reservationService.cancel.mockResolvedValue(result);

            await controller.cancel(req, res, next);

            expect(
                reservationService.cancel
            ).toHaveBeenCalledWith(
                "1",
                5,
                "USER"
            );

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(result);
        });

        test("deve encaminhar erro de cancelamento", async () => {
            req.params.id = "999";

            const error = new Error("Reserva não encontrada.");

            reservationService.cancel.mockRejectedValue(error);

            await controller.cancel(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
