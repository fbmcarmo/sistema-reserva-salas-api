const { Room } = require("../../../shared/database/models");

class RoomRepository {

    async findAll() {
        return await Room.findAll();
    }

    async findById(id) {
        return await Room.findByPk(id);
    }

    async create(data) {
        return await Room.create(data);
    }

    async update(id, data) {
        const room = await Room.findByPk(id);

        if (!room) {
            return null;
        }

        await room.update(data);

        return room;
    }

    async delete(id) {
        const room = await Room.findByPk(id);

        if (!room) {
            return false;
        }

        await room.destroy();

        return true;
    }
}

module.exports = RoomRepository;