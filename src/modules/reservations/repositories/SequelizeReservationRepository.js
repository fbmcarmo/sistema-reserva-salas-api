const Reservation = require("../models/Reservation");

class SequelizeReservationRepository {
    async create(reservationData) {
        return Reservation.create(reservationData);
    }

    async findAll() {
        return Reservation.findAll({
            order: [["startDate", "ASC"]],
        });
    }

    async findById(id) {
        return Reservation.findByPk(id);
    }

    async findByUserId(userId) {
        return Reservation.findAll({
            where: {
                userId,
            },
            order: [["startDate", "ASC"]],
        });
    }

    async findByRoomId(roomId) {
        return Reservation.findAll({
            where: {
                roomId,
            },
            order: [["startDate", "ASC"]],
        });
    }

    async findConflictingReservation(
        roomId,
        startDate,
        endDate,
        reservationId = null
    ) {
        const { Op } = require("sequelize");

        const where = {
            roomId,

            status: "CONFIRMADA",

            startDate: {
                [Op.lt]: endDate,
            },

            endDate: {
                [Op.gt]: startDate,
            },
        };

        if (reservationId) {
            where.id = {
                [Op.ne]: reservationId,
            };
        }

        return Reservation.findOne({
            where,
        });
    }

    async update(id, reservationData) {
        const reservation = await Reservation.findByPk(id);

        if (!reservation) {
            return null;
        }

        await reservation.update(reservationData);

        return reservation;
    }

    async cancel(id) {
        const reservation = await Reservation.findByPk(id);

        if (!reservation) {
            return null;
        }

        await reservation.update({
            status: "CANCELADA",
        });

        return reservation;
    }

    async findAvailableReservations(
        roomId,
        startDate,
        endDate
    ) {
        const { Op } = require("sequelize");

        return Reservation.findAll({
            where: {
                roomId,

                status: "CONFIRMADA",

                [Op.or]: [
                    {
                        startDate: {
                            [Op.gte]: endDate,
                        },
                    },
                    {
                        endDate: {
                            [Op.lte]: startDate,
                        },
                    },
                ],
            },

            order: [["startDate", "ASC"]],
        });
    }
}

module.exports = SequelizeReservationRepository;