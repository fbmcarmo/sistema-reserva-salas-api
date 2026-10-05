const express = require("express");

const RoomBuilder = require("../builders/RoomBuilder");
const RoomRepositoryBridge = require("../repositories/RoomRepositoryBridge");
const SequelizeRoomRepository = require("../repositories/SequelizeRoomRepository");
const RoomService = require("../services/RoomService");
const RoomValidator = require("../validators/RoomValidator");
const RoomController = require("../controllers/RoomController");

/**
 * @openapi
 * /rooms:
 *   post:
 *     summary: Criar uma sala
 *     tags:
 *       - Rooms
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
 */
 
/**
 * @openapi
 * /rooms:
 *   get:
 *     summary: Listar todas as salas
 *     tags:
 *       - Rooms
 *     responses:
 *       200:
 *         description: Lista de salas.
 *       500:
 *         description: Erro interno do servidor.
 */

/**
 * @openapi
 * /rooms/{id}:
 *   get:
 *     summary: Buscar uma sala pelo ID
 *     tags:
 *       - Rooms
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
 *       404:
 *         description: Sala não encontrada.
 */

/**
 * @openapi
 * /rooms/{id}:
 *   put:
 *     summary: Atualizar uma sala
 *     tags:
 *       - Rooms
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
 *       404:
 *         description: Sala não encontrada.
 */

/**
 * @openapi
 * /rooms/{id}:
 *   delete:
 *     summary: Excluir uma sala
 *     tags:
 *       - Rooms
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
        this.router.post(
            "/",
            this.roomController.create
        );

        this.router.get(
            "/",
            this.roomController.findAll
        );

        this.router.get(
            "/:id",
            this.roomController.findById
        );

        this.router.put(
            "/:id",
            this.roomController.update
        );

        this.router.delete(
            "/:id",
            this.roomController.delete
        );
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new RoomRoutes().getRouter();