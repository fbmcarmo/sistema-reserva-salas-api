const express = require("express");

const ReservationController = require(
    "../controllers/ReservationController"
);

const ReservationService = require(
    "../services/ReservationService"
);

const ReservationRepositoryBridge = require(
    "../repositories/ReservationRepositoryBridge"
);

const SequelizeReservationRepository = require(
    "../repositories/SequelizeReservationRepository"
);

const UserRepositoryBridge = require(
    "../../users/repositories/UserRepositoryBridge"
);

const SequelizeUserRepository = require(
    "../../users/repositories/SequelizeUserRepository"
);

const RoomRepositoryBridge = require(
    "../../rooms/repositories/RoomRepositoryBridge"
);

const SequelizeRoomRepository = require(
    "../../rooms/repositories/SequelizeRoomRepository"
);

const ReservationValidator = require(
    "../validators/ReservationValidator"
);

const authMiddleware = require(
    "../../../shared/middlewares/AuthMiddleware"
);

const router = express.Router();

const reservationRepository =
    new ReservationRepositoryBridge(
        new SequelizeReservationRepository()
    );

const userRepository =
    new UserRepositoryBridge(
        new SequelizeUserRepository()
    );

const roomRepository =
    new RoomRepositoryBridge(
        new SequelizeRoomRepository()
    );

const reservationValidator =
    new ReservationValidator();

const reservationService =
    new ReservationService({
        reservationRepository,
        userRepository,
        roomRepository,
        reservationValidator,
    });

const reservationController =
    new ReservationController(
        reservationService
    );


/**
 * Todas as rotas de reservas exigem autenticação.
 */
router.use(
    authMiddleware.authenticate
);


/**
 * @openapi
 * /api/reservations:
 *   get:
 *     summary: Listar reservas
 *     tags:
 *       - Reservations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas.
 *       401:
 *         description: Usuário não autenticado.
 *       403:
 *         description: Acesso permitido somente para administradores.
 */
router.get(
    "/",
    authMiddleware.authorizeAdmin,
    reservationController.findAll
);


/**
 * @openapi
 * /api/reservations/my:
 *   get:
 *     summary: Listar minhas reservas
 *     tags:
 *       - Reservations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reservas do usuário autenticado.
 *       401:
 *         description: Usuário não autenticado.
 */
router.get(
    "/my",
    reservationController.findMyReservations
);


/**
 * @openapi
 * /api/reservations:
 *   post:
 *     summary: Criar uma reserva
 *     tags:
 *       - Reservations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationCreate'
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Usuário não autenticado.
 *       404:
 *         description: Sala ou usuário não encontrado.
 *       409:
 *         description: Sala já reservada no período.
 */
router.post(
    "/",
    reservationController.create
);


/**
 * @openapi
 * /api/reservations/{id}:
 *   get:
 *     summary: Buscar uma reserva
 *     tags:
 *       - Reservations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Reserva encontrada.
 *       401:
 *         description: Usuário não autenticado.
 *       404:
 *         description: Reserva não encontrada.
 */
router.get(
    "/:id",
    reservationController.findById
);


/**
 * @openapi
 * /api/reservations/{id}:
 *   put:
 *     summary: Alterar uma reserva
 *     tags:
 *       - Reservations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationUpdate'
 *     responses:
 *       200:
 *         description: Reserva atualizada com sucesso.
 *       401:
 *         description: Usuário não autenticado.
 *       403:
 *         description: Sem permissão para alterar a reserva.
 *       404:
 *         description: Reserva não encontrada.
 *       409:
 *         description: Sala já reservada no período.
 */
router.put(
    "/:id",
    reservationController.update
);


/**
 * @openapi
 * /api/reservations/{id}:
 *   delete:
 *     summary: Cancelar uma reserva
 *     tags:
 *       - Reservations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Reserva cancelada com sucesso.
 *       401:
 *         description: Usuário não autenticado.
 *       403:
 *         description: Sem permissão para cancelar a reserva.
 *       404:
 *         description: Reserva não encontrada.
 */
router.delete(
    "/:id",
    reservationController.cancel
);


module.exports = router;

