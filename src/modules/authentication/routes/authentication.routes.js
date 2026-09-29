const express = require("express");

const AuthenticationController = require("../controllers/AuthenticationController");

const router = express.Router();
const authenticationController = new AuthenticationController();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Realizar login
 *     description: Autentica um usuário e retorna um token JWT.
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
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *       401:
 *         description: E-mail ou senha inválidos.
 */
router.post("/login", authenticationController.login);
router.post("/login", authenticationController.login);

module.exports = router;