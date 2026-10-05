```js
/**
 * @openapi
 * components:
 *   schemas:
 *
 *     User:
 *       type: object
 *       description: Dados públicos de um usuário.
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Bruno Moreira
 *         email:
 *           type: string
 *           format: email
 *           example: bruno@email.com
 *         role:
 *           type: string
 *           enum:
 *             - USER
 *             - ADMIN
 *           example: USER
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-10-05T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-10-05T12:00:00.000Z"
 *
 *     UserCreate:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Nome completo do usuário.
 *           example: Bruno Moreira
 *         email:
 *           type: string
 *           format: email
 *           description: E-mail utilizado para autenticação.
 *           example: bruno@email.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           description: Senha do usuário.
 *           example: senha123
 *
 *     UserUpdate:
 *       type: object
 *       description: Dados que podem ser alterados no cadastro do usuário.
 *       properties:
 *         name:
 *           type: string
 *           description: Novo nome do usuário.
 *           example: Bruno Moreira Atualizado
 *         email:
 *           type: string
 *           format: email
 *           description: Novo e-mail do usuário.
 *           example: bruno.novo@email.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           description: Nova senha do usuário.
 *           example: novaSenha123
 */
```
