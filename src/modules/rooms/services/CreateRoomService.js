const ApplicationError = require('../../../shared/errors/ApplicationError');

class CreateRoomService {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute({ nome, descricao, capacidade, localizacao, recursos, status }) {
    if (!nome || !capacidade || !localizacao) {
      throw new ApplicationError('Nome, capacidade e localização são obrigatórios.', 400);
    }

    if (capacidade <= 0) {
      throw new ApplicationError('A capacidade da sala deve ser maior que zero.', 400);
    }

    return await this.roomRepository.create({
      nome,
      descricao,
      capacidade,
      localizacao,
      recursos,
      status: status || 'ATIVA',
    });
  }
}

module.exports = CreateRoomService;