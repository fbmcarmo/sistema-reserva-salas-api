/**
 * @openapi
 * components:
 *   schemas:
 *
 *     Reservation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *
 *         userId:
 *           type: integer
 *           example: 5
 *
 *         roomId:
 *           type: integer
 *           example: 2
 *
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2026-10-10T14:00:00.000Z"
 *
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: "2026-10-10T16:00:00.000Z"
 *
 *         status:
 *           type: string
 *           enum:
 *             - CONFIRMADA
 *             - CANCELADA
 *           example: CONFIRMADA
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ReservationCreate:
 *       type: object
 *       required:
 *         - userId
 *         - roomId
 *         - startDate
 *         - endDate
 *       properties:
 *         userId:
 *           type: integer
 *           example: 5
 *
 *         roomId:
 *           type: integer
 *           example: 2
 *
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2026-10-10T14:00:00.000Z"
 *
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: "2026-10-10T16:00:00.000Z"
 *
 *     ReservationUpdate:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *           example: 5
 *
 *         roomId:
 *           type: integer
 *           example: 3
 *
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2026-10-10T15:00:00.000Z"
 *
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: "2026-10-10T17:00:00.000Z"
 *
 *         status:
 *           type: string
 *           enum:
 *             - CONFIRMADA
 *             - CANCELADA
 *           example: CONFIRMADA
 *
 *     ReservationAvailability:
 *       type: object
 *       properties:
 *         roomId:
 *           type: integer
 *           example: 2
 *
 *         startDate:
 *           type: string
 *           format: date-time
 *
 *         endDate:
 *           type: string
 *           format: date-time
 *
 *         available:
 *           type: boolean
 *           example: true
 */