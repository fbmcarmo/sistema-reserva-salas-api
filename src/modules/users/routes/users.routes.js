const express = require("express");

const UserController = require("../controllers/UserController");
const authMiddleware = require("../../../shared/middlewares/AuthMiddleware");
const authorizationMiddleware = require(
    "../../../shared/middlewares/AuthorizationMiddleware"
);

const router = express.Router();
const userController = new UserController();

/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Cadastrar usuário
 *     description: Cria uma nova conta de usuário.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bruno Moreira
 *               email:
 *                 type: string
 *                 format: email
 *                 example: bruno@email.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       409:
 *         description: E-mail já cadastrado.
 */
router.post("/register", userController.register);

router.post("/register", userController.register);

// A partir daqui, as rotas exigem autenticação.
router.use(authMiddleware.authenticate);

// Somente ADMIN pode listar todos os usuários.
router.get(
    "/",
    authorizationMiddleware.allowRoles("ADMIN"),
    userController.findAll
);

// ADMIN pode consultar qualquer usuário.
// USER pode consultar apenas o próprio cadastro.
router.get(
    "/:id",
    (req, res, next) => {
        const isAdmin = req.auth.role === "ADMIN";
        const isOwnAccount = String(req.auth.userId) === String(req.params.id);

        if (!isAdmin && !isOwnAccount) {
            return res.status(403).json({
                message: "Você não tem permissão para consultar este usuário.",
            });
        }

        return next();
    },
    userController.findById
);

module.exports = router;