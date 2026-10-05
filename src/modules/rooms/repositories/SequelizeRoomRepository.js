const Room = require("../models/Room");

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
}

module.exports = SequelizeRoomRepository;