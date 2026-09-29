const express = require("express");
const RoomController = require("../controllers/RoomController");

const router = express.Router();

const roomController = new RoomController();

/**
 * @openapi
 * /rooms:
 *   get:
 *     summary: Listar salas
 *     description: Retorna todas as salas cadastradas.
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de salas.
 *       401:
 *         description: Usuário não autenticado.
 */
router.get("/", roomController.findAll);

router.get("/", roomController.findAll);

/**
 * @openapi
 * /rooms/{id}:
 *   get:
 *     summary: Buscar sala por ID
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
 *         description: ID da sala.
 *     responses:
 *       200:
 *         description: Sala encontrada.
 *       404:
 *         description: Sala não encontrada.
 *       401:
 *         description: Usuário não autenticado.
 */
router.get("/:id", roomController.findById);
router.get("/:id", roomController.findById);

/**
 * @openapi
 * /rooms:
 *   post:
 *     summary: Criar uma nova sala
 *     description: Cria uma nova sala no sistema.
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sala de Reunião 01
 *               capacity:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Sala criada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Usuário não autenticado.
 *       403:
 *         description: Usuário sem permissão.
 */
router.post("/", roomController.create);

router.post("/", roomController.create);

/**
 * @openapi
 * /rooms/{id}:
 *   put:
 *     summary: Atualizar uma sala
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sala de Reunião 02
 *               capacity:
 *                 type: integer
 *                 example: 20
 *     responses:
 *       200:
 *         description: Sala atualizada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Usuário não autenticado.
 *       404:
 *         description: Sala não encontrada.
 */
router.put("/:id", roomController.update);
router.put("/:id", roomController.update);

/**
 * @openapi
 * /rooms/{id}:
 *   delete:
 *     summary: Excluir uma sala
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
 *     responses:
 *       204:
 *         description: Sala excluída com sucesso.
 *       401:
 *         description: Usuário não autenticado.
 *       404:
 *         description: Sala não encontrada.
 */
router.delete("/:id", roomController.delete);
router.delete("/:id", roomController.delete);

module.exports = router;