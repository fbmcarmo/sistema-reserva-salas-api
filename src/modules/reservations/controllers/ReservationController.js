const SequelizeReservationRepository = require('../repositories/SequelizeReservationRepository');
const CreateReservationService = require('../services/CreateReservationService');

class ReservationController {
  async create(req, res, next) {
    try {
      const reservationRepository = new SequelizeReservationRepository();
      const service = new CreateReservationService(reservationRepository);

      const reservation = await service.execute(req.body);

      return res.status(201).json(reservation);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReservationController();