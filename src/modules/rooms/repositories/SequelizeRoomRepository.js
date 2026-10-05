const { Op } = require("sequelize");

const Room = require("../models/Room");

const Reservation = require(
    "../../reservations/models/Reservation"
);

class SequelizeRoomRepository {

    async create(roomData) {
        return Room.create(roomData);
    }

    async findAll() {
        return Room.findAll({
            order: [["id", "ASC"]],
        });
    }

    async findById(id) {
        return Room.findByPk(id);
    }

    async update(id, roomData) {
        const room = await Room.findByPk(id);

        if (!room) {
            return null;
        }

        await room.update(roomData);

        return room;
    }

    async delete(id) {
        const room = await Room.findByPk(id);

        if (!room) {
            return null;
        }

        await room.destroy();

        return room;
    }

    async checkAvailability(
        roomId,
        startDate,
        endDate
    ) {
        const conflictingReservation =
            await Reservation.findOne({
                where: {
                    roomId,
                    status: "CONFIRMADA",

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

        return !conflictingReservation;
    }

    async findReservations(roomId) {
        return Reservation.findAll({
            where: {
                roomId,
                status: "CONFIRMADA",
            },
            order: [
                ["startDate", "ASC"],
            ],
        });
    }
}

module.exports = SequelizeRoomRepository;
