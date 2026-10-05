const express = require("express");

const RoomBuilder = require("../builders/RoomBuilder");
const RoomRepositoryBridge = require("../repositories/RoomRepositoryBridge");
const SequelizeRoomRepository = require("../repositories/SequelizeRoomRepository");
const RoomService = require("../services/RoomService");
const RoomValidator = require("../validators/RoomValidator");
const RoomController = require("../controllers/RoomController");

const authMiddleware = require(
    "../../../shared/middlewares/AuthMiddleware"
);

/**
 * @openapi
 * /api/rooms:
 *   post:
 *     summary: Criar uma sala
 *     description: Cria uma nova sala. Requer autenticação e perfil ADMIN.
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomCreate'
 *     responses:
 *       201:
 *         description: Sala criada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token não informado ou inválido.
 *       403:
 *         description: Usuário não possui permissão de administrador.
 */

/**
 * @openapi
 * /api/rooms:
 *   get:
 *     summary: Listar todas as salas
 *     description: Retorna todas as salas cadastradas. Requer autenticação.
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de salas.
 *       401:
 *         description: Token não informado ou inválido.
 *       500:
 *         description: Erro interno do servidor.
 */

/**
 * @openapi
 * /api/rooms/{id}:
 *   get:
 *     summary: Buscar uma sala pelo ID
 *     description: Retorna os dados de uma sala. Requer autenticação.
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Sala encontrada.
 *       401:
 *         description: Token não informado ou inválido.
 *       404:
 *         description: Sala não encontrada.
 */

/**
 * @openapi
 * /api/rooms/{id}:
 *   put:
 *     summary: Atualizar uma sala
 *     description: Atualiza uma sala. Requer autenticação e perfil ADMIN.
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomUpdate'
 *     responses:
 *       200:
 *         description: Sala atualizada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token não informado ou inválido.
 *       403:
 *         description: Usuário não possui permissão de administrador.
 *       404:
 *         description: Sala não encontrada.
 */

/**
 * @openapi
 * /api/rooms/{id}:
 *   delete:
 *     summary: Excluir uma sala
 *     description: Exclui uma sala. Requer autenticação e perfil ADMIN.
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       204:
 *         description: Sala excluída com sucesso.
 *       401:
 *         description: Token não informado ou inválido.
 *       403:
 *         description: Usuário não possui permissão de administrador.
 *       404:
 *         description: Sala não encontrada.
 */

class RoomRoutes {

    constructor() {
        this.router = express.Router();

        const sequelizeRoomRepository =
            new SequelizeRoomRepository();

        const roomRepository =
            new RoomRepositoryBridge(
                sequelizeRoomRepository
            );

        const roomBuilder =
            new RoomBuilder();

        const roomValidator =
            new RoomValidator();

        const roomService =
            new RoomService(
                roomRepository,
                roomBuilder,
                roomValidator
            );

        this.roomController =
            new RoomController(roomService);

        this.configureRoutes();
    }


    configureRoutes() {

        /*
        * Todas as rotas de salas exigem autenticação.
        */
        this.router.use(
            authMiddleware.authenticate
        );

        /*
        * Listar salas.
        */
        this.router.get(
            "/",
            this.roomController.findAll
        );

        /*
        * Verificar disponibilidade.
        */

        /**
         * @openapi
         * /api/rooms/{roomId}/availability:
         *   get:
         *     summary: Verificar disponibilidade de uma sala
         *     description: Verifica se uma sala está disponível no período informado.
         *     tags:
         *       - Rooms
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: roomId
         *         required: true
         *         description: ID da sala.
         *         schema:
         *           type: integer
         *           example: 1
         *
         *       - in: query
         *         name: startDate
         *         required: true
         *         description: Data e hora inicial da consulta.
         *         schema:
         *           type: string
         *           format: date-time
         *           example: "2026-10-05T10:00:00"
         *
         *       - in: query
         *         name: endDate
         *         required: true
         *         description: Data e hora final da consulta.
         *         schema:
         *           type: string
         *           format: date-time
         *           example: "2026-10-05T12:00:00"
         *
         *     responses:
         *       200:
         *         description: Disponibilidade da sala consultada.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 roomId:
         *                   type: integer
         *                   example: 1
         *                 startDate:
         *                   type: string
         *                   format: date-time
         *                   example: "2026-10-05T10:00:00.000Z"
         *                 endDate:
         *                   type: string
         *                   format: date-time
         *                   example: "2026-10-05T12:00:00.000Z"
         *                 available:
         *                   type: boolean
         *                   example: true
         *
         *       400:
         *         description: Dados da consulta inválidos.
         *
         *       401:
         *         description: Usuário não autenticado.
         *
         *       404:
         *         description: Sala não encontrada.
         */


        this.router.get(
            "/:roomId/availability",
            this.roomController.checkAvailability
        );

        /*
        * Consultar horários ocupados.
        */
    
        /**
         * @openapi
         * /api/rooms/{roomId}/reservations:
         *   get:
         *     summary: Consultar horários ocupados de uma sala
         *     description: Retorna as reservas confirmadas de uma sala, ordenadas pela data de início.
         *     tags:
         *       - Rooms
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: roomId
         *         required: true
         *         description: ID da sala.
         *         schema:
         *           type: integer
         *           example: 1
         *
         *     responses:
         *       200:
         *         description: Lista de reservas confirmadas da sala.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 roomId:
         *                   type: integer
         *                   example: 1
         *                 reservations:
         *                   type: array
         *                   items:
         *                     $ref: '#/components/schemas/Reservation'
         *
         *       401:
         *         description: Usuário não autenticado.
         *
         *       404:
         *         description: Sala não encontrada.
         */


        this.router.get(
            "/:roomId/reservations",
            this.roomController.findReservations
        );

        /*
        * Buscar uma sala específica.
        */
        this.router.get(
            "/:id",
            this.roomController.findById
        );

        /*
        * Operações administrativas.
        */
        this.router.post(
            "/",
            authMiddleware.authorizeAdmin,
            this.roomController.create
        );

        this.router.put(
            "/:id",
            authMiddleware.authorizeAdmin,
            this.roomController.update
        );

        this.router.delete(
            "/:id",
            authMiddleware.authorizeAdmin,
            this.roomController.delete
        );
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new RoomRoutes().getRouter();
