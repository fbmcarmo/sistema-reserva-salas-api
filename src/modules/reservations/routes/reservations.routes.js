const express = require("express");

const ReservationBuilder = require("../builders/ReservationBuilder");

const ReservationRepositoryBridge =
    require("../repositories/ReservationRepositoryBridge");

const SequelizeReservationRepository =
    require("../repositories/SequelizeReservationRepository");

const ReservationService =
    require("../services/ReservationService");

const ReservationValidator =
    require("../validators/ReservationValidator");

const ReservationController =
    require("../controllers/ReservationController");

class ReservationRoutes {
    constructor() {
        this.router = express.Router();

        const sequelizeReservationRepository =
            new SequelizeReservationRepository();

        const reservationRepository =
            new ReservationRepositoryBridge(
                sequelizeReservationRepository
            );

        const reservationBuilder =
            new ReservationBuilder();

        const reservationValidator =
            new ReservationValidator();

        const reservationService =
            new ReservationService(
                reservationRepository,
                reservationBuilder,
                reservationValidator
            );

        this.reservationController =
            new ReservationController(
                reservationService
            );

        this.configureRoutes();
    }

    configureRoutes() {
        /**
         * @openapi
         * /reservations:
         *   post:
         *     summary: Criar uma reserva
         *     description: Cria uma nova reserva para uma sala em um determinado período. A API verifica se o horário é válido e se existe conflito com outra reserva confirmada.
         *     tags:
         *       - Reservations
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ReservationCreate'
         *     responses:
         *       201:
         *         description: Reserva criada com sucesso.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Reservation'
         *       400:
         *         description: Dados inválidos ou horário inválido.
         *       409:
         *         description: A sala já está reservada no período informado.
         */
        this.router.post(
            "/",
            this.reservationController.create
        );

        /**
         * @openapi
         * /reservations:
         *   get:
         *     summary: Listar todas as reservas
         *     description: Retorna todas as reservas cadastradas no sistema.
         *     tags:
         *       - Reservations
         *     responses:
         *       200:
         *         description: Lista de reservas.
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/Reservation'
         */
        this.router.get(
            "/",
            this.reservationController.findAll
        );

        /**
         * @openapi
         * /reservations/availability:
         *   get:
         *     summary: Consultar disponibilidade de uma sala
         *     description: Verifica se uma sala está disponível para reserva durante o período informado.
         *     tags:
         *       - Reservations
         *     parameters:
         *       - in: query
         *         name: roomId
         *         required: true
         *         description: Identificador da sala.
         *         schema:
         *           type: integer
         *         example: 2
         *
         *       - in: query
         *         name: startDate
         *         required: true
         *         description: Data e horário de início da reserva.
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2026-10-10T14:00:00.000Z"
         *
         *       - in: query
         *         name: endDate
         *         required: true
         *         description: Data e horário de término da reserva.
         *         schema:
         *           type: string
         *           format: date-time
         *         example: "2026-10-10T16:00:00.000Z"
         *
         *     responses:
         *       200:
         *         description: Disponibilidade consultada com sucesso.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ReservationAvailability'
         *       400:
         *         description: Horário inválido ou parâmetros obrigatórios não informados.
         */
        this.router.get(
            "/availability",
            this.reservationController.checkAvailability
        );

        /**
         * @openapi
         * /reservations/user/{userId}:
         *   get:
         *     summary: Listar reservas de um usuário
         *     description: Retorna todas as reservas pertencentes a um determinado usuário.
         *     tags:
         *       - Reservations
         *     parameters:
         *       - in: path
         *         name: userId
         *         required: true
         *         description: Identificador do usuário.
         *         schema:
         *           type: integer
         *         example: 1
         *     responses:
         *       200:
         *         description: Reservas do usuário.
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/Reservation'
         *       404:
         *         description: Usuário não encontrado.
         */
        this.router.get(
            "/user/:userId",
            this.reservationController.findByUserId
        );

        /**
         * @openapi
         * /reservations/room/{roomId}:
         *   get:
         *     summary: Listar reservas de uma sala
         *     description: Retorna todas as reservas cadastradas para uma determinada sala.
         *     tags:
         *       - Reservations
         *     parameters:
         *       - in: path
         *         name: roomId
         *         required: true
         *         description: Identificador da sala.
         *         schema:
         *           type: integer
         *         example: 2
         *     responses:
         *       200:
         *         description: Reservas da sala.
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/Reservation'
         *       404:
         *         description: Sala não encontrada.
         */
        this.router.get(
            "/room/:roomId",
            this.reservationController.findByRoomId
        );

        /**
         * @openapi
         * /reservations/{id}:
         *   get:
         *     summary: Buscar reserva por ID
         *     description: Retorna os dados de uma reserva específica.
         *     tags:
         *       - Reservations
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         description: Identificador da reserva.
         *         schema:
         *           type: integer
         *         example: 1
         *     responses:
         *       200:
         *         description: Reserva encontrada.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Reservation'
         *       404:
         *         description: Reserva não encontrada.
         */
        this.router.get(
            "/:id",
            this.reservationController.findById
        );

        /**
         * @openapi
         * /reservations/{id}:
         *   put:
         *     summary: Atualizar uma reserva
         *     description: Atualiza os dados de uma reserva existente. A alteração de sala ou horário também passa pela validação de conflitos.
         *     tags:
         *       - Reservations
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         description: Identificador da reserva.
         *         schema:
         *           type: integer
         *         example: 1
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ReservationUpdate'
         *     responses:
         *       200:
         *         description: Reserva atualizada com sucesso.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Reservation'
         *       400:
         *         description: Dados ou horário inválido.
         *       404:
         *         description: Reserva não encontrada.
         *       409:
         *         description: A sala já está reservada no período informado.
         */
        this.router.put(
            "/:id",
            this.reservationController.update
        );

        /**
         * @openapi
         * /reservations/{id}/cancel:
         *   patch:
         *     summary: Cancelar uma reserva
         *     description: Cancela uma reserva existente alterando seu status para CANCELADA. A reserva permanece armazenada para manter o histórico.
         *     tags:
         *       - Reservations
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         description: Identificador da reserva.
         *         schema:
         *           type: integer
         *         example: 1
         *     responses:
         *       200:
         *         description: Reserva cancelada com sucesso.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Reservation'
         *       400:
         *         description: A reserva já está cancelada.
         *       404:
         *         description: Reserva não encontrada.
         */
        this.router.patch(
            "/:id/cancel",
            this.reservationController.cancel
        );
    }

    getRouter() {
        return this.router;
    }
}

module.exports =
    new ReservationRoutes().getRouter();