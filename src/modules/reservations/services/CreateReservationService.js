const ApplicationError = require('../../../shared/errors/ApplicationError');
const CheckReservationConflictService = require('./CheckReservationConflictService');
const Room = require('../../rooms/models/Room');
const User = require('../../users/models/User');

class CreateReservationService {
  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  async execute({ user_id, room_id, data, hora_inicio, hora_fim, finalidade }) {
    // 1. Validação de preenchimento obrigatório
    if (!user_id || !room_id || !data || !hora_inicio || !hora_fim) {
      throw new ApplicationError('Todos os campos obrigatórios devem ser informados.', 400);
    }

    // 2. Validação de formato de horário (HH:mm)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(hora_inicio) || !timeRegex.test(hora_fim)) {
      throw new ApplicationError('Os horários de início e término devem estar no formato HH:mm.', 400);
    }

    // 3. BE15: Validação lógica de horários (hora_inicio deve ser menor que hora_fim)
    if (hora_inicio >= hora_fim) {
      throw new ApplicationError('O horário de término deve ser posterior ao horário de início.', 400);
    }

    // 4. Verificação de existência da sala e se está ativa
    const room = await Room.findByPk(room_id);
    if (!room) {
      throw new ApplicationError('Sala não encontrada.', 404);
    }
    if (room.status !== 'ATIVA') {
      throw new ApplicationError('Esta sala está inativa e não pode receber reservas.', 400);
    }

    // 5. Verificação de existência do utilizador
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new ApplicationError('Utilizador não encontrado.', 404);
    }

    // 6. BE16: Validação de conflito de agendamento
    const conflictService = new CheckReservationConflictService(this.reservationRepository);
    await conflictService.execute({ room_id, data, hora_inicio, hora_fim });

    // 7. BE14: Persistência da reserva
    const reservation = await this.reservationRepository.create({
      user_id,
      room_id,
      data,
      hora_inicio,
      hora_fim,
      finalidade,
      status: 'CONFIRMADA',
    });

    return reservation;
  }
}

module.exports = CreateReservationService;