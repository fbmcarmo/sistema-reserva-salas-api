const ApplicationError = require('../../../shared/errors/ApplicationError');

class DeleteRoomService {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute(id) {
    const room = await this.roomRepository.findById(id);

    if (!room) {
      throw new ApplicationError('Sala não encontrada para exclusão.', 404);
    }

    await this.roomRepository.delete(id);
    return { message: 'Sala excluída com sucesso.' };
  }
}

module.exports = DeleteRoomService;