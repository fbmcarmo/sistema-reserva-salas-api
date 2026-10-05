const express = require("express");

const UserController = require(
    "../controllers/UserController"
);

const UserService = require(
    "../services/UserService"
);

const UserRepositoryBridge = require(
    "../repositories/UserRepositoryBridge"
);

const SequelizeUserRepository = require(
    "../repositories/SequelizeUserRepository"
);

const authMiddleware = require(
    "../../../shared/middlewares/AuthMiddleware"
);

const authorizationMiddleware = require(
    "../../../shared/middlewares/AuthorizationMiddleware"
);

const sequelizeUserRepository =
    new SequelizeUserRepository();

const userRepository =
    new UserRepositoryBridge(
        sequelizeUserRepository
    );

const userService =
    new UserService({
        userRepository,
    });

const userController =
    new UserController(
        userService
    );

const router = express.Router();

// Todas as rotas de gerenciamento de usuários
// exigem autenticação.
router.use(
    authMiddleware.authenticate
);

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Listar usuários
 *     description: Retorna todos os usuários cadastrados. Somente administradores possuem acesso.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários.
 *       401:
 *         description: Token não informado ou inválido.
 *       403:
 *         description: Usuário sem permissão.
 */
router.get(
    "/users",
    authorizationMiddleware.allowRoles(
        "ADMIN"
    ),
    userController.findAll
);

/**
 * @openapi
 * /api/user/{id}:
 *   get:
 *     summary: Buscar usuário
 *     description: Administradores podem consultar qualquer usuário. Usuários comuns podem consultar apenas o próprio cadastro.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador do usuário.
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuário encontrado.
 *       401:
 *         description: Não autenticado.
 *       403:
 *         description: Sem permissão para consultar este usuário.
 *       404:
 *         description: Usuário não encontrado.
 */
router.get(
    "/user/:id",
    (req, res, next) => {
        const isAdmin =
            req.auth.role === "ADMIN";

        const isOwnAccount =
            String(req.auth.userId) ===
            String(req.params.id);

        if (
            !isAdmin &&
            !isOwnAccount
        ) {
            return res.status(403).json({
                message:
                    "Você não tem permissão para consultar este usuário.",
            });
        }

        return next();
    },
    userController.findById
);

/**
 * @openapi
 * /api/user/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     description: Atualiza os dados de um usuário. Administradores podem atualizar qualquer usuário e usuários comuns podem atualizar apenas o próprio cadastro.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador do usuário.
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autenticado.
 *       403:
 *         description: Sem permissão para atualizar este usuário.
 *       404:
 *         description: Usuário não encontrado.
 *       409:
 *         description: E-mail já utilizado.
 */
router.put(
    "/user/:id",
    (req, res, next) => {
        const isAdmin =
            req.auth.role === "ADMIN";

        const isOwnAccount =
            String(req.auth.userId) ===
            String(req.params.id);

        if (
            !isAdmin &&
            !isOwnAccount
        ) {
            return res.status(403).json({
                message:
                    "Você não tem permissão para atualizar este usuário.",
            });
        }

        return next();
    },
    userController.update
);

/**
 * @openapi
 * /api/user/{id}:
 *   delete:
 *     summary: Excluir usuário
 *     description: Exclui permanentemente um usuário. Administradores podem excluir qualquer usuário e usuários comuns podem excluir apenas o próprio cadastro.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador do usuário.
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso.
 *       401:
 *         description: Não autenticado.
 *       403:
 *         description: Sem permissão para excluir este usuário.
 *       404:
 *         description: Usuário não encontrado.
 */
router.delete(
    "/user/:id",
    (req, res, next) => {
        const isAdmin =
            req.auth.role === "ADMIN";

        const isOwnAccount =
            String(req.auth.userId) ===
            String(req.params.id);

        if (
            !isAdmin &&
            !isOwnAccount
        ) {
            return res.status(403).json({
                message:
                    "Você não tem permissão para excluir este usuário.",
            });
        }

        return next();
    },
    userController.delete
);

module.exports = router;
