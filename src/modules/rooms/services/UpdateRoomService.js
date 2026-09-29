const ApplicationError = require('../../../shared/errors/ApplicationError');

class UpdateRoomService {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute(id, updateData) {
    const room = await this.roomRepository.findById(id);

    if (!room) {
      throw new ApplicationError('Sala não encontrada para atualização.', 404);
    }

    if (updateData.capacidade !== undefined && updateData.capacidade <= 0) {
      throw new ApplicationError('A capacidade da sala deve ser maior que zero.', 400);
    }

    return await this.roomRepository.update(id, updateData);
  }
}

module.exports = UpdateRoomService;