const { Op } = require("sequelize");
const { Reservation } = require("../../../shared/database/models");

class ReservationRepository {

    async findConflict(roomId, startDate, endDate) {

        return await Reservation.findOne({
            where: {
                roomId,

                status: "ACTIVE",

                [Op.and]: [
                    {
                        startDate: {
                            [Op.lt]: endDate,
                        },
                    },
                    {
                        endDate: {
                            [Op.gt]: startDate,
                        },
                    },
                ],
            },
        });
    }

    async findAll() {
        return await Reservation.findAll();
    }

    async findById(id) {
        return await Reservation.findByPk(id);
    }

    async create(data) {
        return await Reservation.create(data);
    }

    async update(id, data) {

        const reservation =
            await Reservation.findByPk(id);

        if (!reservation) {
            return null;
        }

        await reservation.update(data);

        return reservation;
    }
}

module.exports = ReservationRepository;