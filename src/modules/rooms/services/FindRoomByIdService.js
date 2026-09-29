const ApplicationError = require('../../../shared/errors/ApplicationError');

class FindRoomByIdService {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute(id) {
    const room = await this.roomRepository.findById(id);

    if (!room) {
      throw new ApplicationError('Sala não encontrada.', 404);
    }

    return room;
  }
}

module.exports = FindRoomByIdService;