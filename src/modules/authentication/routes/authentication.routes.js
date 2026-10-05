const express = require("express");

const AuthenticationController = require(
    "../controllers/AuthenticationController"
);

const authMiddleware = require(
    "../../../shared/middlewares/AuthMiddleware"
);

const router = express.Router();

const authenticationController =
    new AuthenticationController();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Cadastrar usuário
 *     description: Cria uma nova conta de usuário. Não exige autenticação.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       409:
 *         description: E-mail já cadastrado.
 */
router.post(
    "/register",
    authenticationController.register
);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     description: Realiza o login e retorna um token JWT.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: bruno@email.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *       400:
 *         description: E-mail e senha são obrigatórios.
 *       401:
 *         description: E-mail ou senha inválidos.
 */
router.post(
    "/login",
    authenticationController.login
);

// A partir daqui, autenticação é obrigatória.
router.use(
    authMiddleware.authenticate
);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Consultar usuário autenticado
 *     description: Retorna os dados do usuário autenticado.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário autenticado.
 *       401:
 *         description: Token não informado ou inválido.
 *       404:
 *         description: Usuário autenticado não encontrado.
 */
router.get(
    "/me",
    authenticationController.me
);

module.exports = router;
