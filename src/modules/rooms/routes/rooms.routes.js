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
         * Rotas disponíveis para qualquer
         * usuário autenticado.
         */
        this.router.get(
            "/",
            this.roomController.findAll
        );

        this.router.get(
            "/:id",
            this.roomController.findById
        );

        /*
         * Rotas administrativas.
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
