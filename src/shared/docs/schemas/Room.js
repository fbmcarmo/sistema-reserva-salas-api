/**
 * @openapi
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: Sala de Reuniões
 *         descricao:
 *           type: string
 *           nullable: true
 *           example: Sala equipada para reuniões e apresentações.
 *         capacidade:
 *           type: integer
 *           example: 20
 *         localizacao:
 *           type: string
 *           example: Bloco A - 2º andar
 *         recursos:
 *           type: string
 *           nullable: true
 *           example: Projetor, ar-condicionado, Wi-Fi
 *         status:
 *           type: string
 *           enum:
 *             - ATIVA
 *             - INATIVA
 *           example: ATIVA
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     RoomCreate:
 *       type: object
 *       required:
 *         - nome
 *         - capacidade
 *         - localizacao
 *       properties:
 *         nome:
 *           type: string
 *           example: Sala de Reuniões
 *         descricao:
 *           type: string
 *           example: Sala equipada para reuniões.
 *         capacidade:
 *           type: integer
 *           minimum: 1
 *           example: 20
 *         localizacao:
 *           type: string
 *           example: Bloco A - 2º andar
 *         recursos:
 *           type: string
 *           example: Projetor, ar-condicionado, Wi-Fi
 *         status:
 *           type: string
 *           enum:
 *             - ATIVA
 *             - INATIVA
 *           default: ATIVA
 *           example: ATIVA
 *
 *     RoomUpdate:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           example: Sala de Reuniões Principal
 *         descricao:
 *           type: string
 *           example: Sala reformada.
 *         capacidade:
 *           type: integer
 *           minimum: 1
 *           example: 30
 *         localizacao:
 *           type: string
 *           example: Bloco B - 1º andar
 *         recursos:
 *           type: string
 *           example: Projetor, Wi-Fi, ar-condicionado
 *         status:
 *           type: string
 *           enum:
 *             - ATIVA
 *             - INATIVA
 *           example: ATIVA
 */