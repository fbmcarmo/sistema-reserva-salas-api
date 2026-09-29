const ApplicationError = require('../../../shared/errors/ApplicationError');

class CheckReservationConflictService {
  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  async execute({ room_id, data, hora_inicio, hora_fim }) {
    const conflictingReservations = await this.reservationRepository.findConflicts({
      room_id,
      data,
      hora_inicio,
      hora_fim,
    });

    if (conflictingReservations.length > 0) {
      throw new ApplicationError(
        'A sala selecionada já possui uma reserva confirmada para este horário.',
        409
      );
    }

    return true;
  }
}

module.exports = CheckReservationConflictService;