const Room = require('../models/Room');

class SequelizeRoomRepository {
  async create(roomData) {
    return await Room.create(roomData);
  }

  async findAll() {
    return await Room.findAll();
  }

  async findById(id) {
    return await Room.findByPk(id);
  }

  async update(id, updateData) {
    const room = await this.findById(id);
    if (!room) return null;
    return await room.update(updateData);
  }

  async delete(id) {
    const room = await this.findById(id);
    if (!room) return null;
    return await room.destroy();
  }
}

module.exports = SequelizeRoomRepository;