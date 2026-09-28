const { Op } = require('sequelize');
const Reservation = require('../models/Reservation');

class SequelizeReservationRepository {
  async findConflicts({ room_id, data, hora_inicio, hora_fim }) {
    return await Reservation.findAll({
      where: {
        room_id,
        data,
        status: { [Op.ne]: 'CANCELADA' },
        [Op.and]: [
          { hora_inicio: { [Op.lt]: hora_fim } },
          { hora_fim: { [Op.gt]: hora_inicio } },
        ],
      },
    });
  }

  async create(reservationData) {
    return await Reservation.create(reservationData);
  }

  async findById(id) {
    return await Reservation.findByPk(id, {
      include: ['usuario', 'sala'],
    });
  }
}

module.exports = SequelizeReservationRepository;