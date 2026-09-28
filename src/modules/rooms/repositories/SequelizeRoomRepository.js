const Room = require('../models/Room');

class SequelizeRoomRepository {
  async create(data) {
    return await Room.create(data);
  }

  async findAll() {
    return await Room.findAll();
  }

  async findById(id) {
    return await Room.findByPk(id);
  }

  async update(id, data) {
    const room = await this.findById(id);
    if (!room) return null;
    return await room.update(data);
  }

  async delete(id) {
    const room = await this.findById(id);
    if (!room) return null;
    return await room.destroy();
  }
}

module.exports = SequelizeRoomRepository;