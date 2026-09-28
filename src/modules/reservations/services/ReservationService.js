const ReservationRepository = require("../repositories/ReservationRepository");

class ReservationService {

    constructor() {
        this.reservationRepository = new ReservationRepository();
    }

    async create(data) {

        const conflict =
            await this.reservationRepository.findConflict(
                data.roomId,
                data.startDate,
                data.endDate
            );

        if (conflict) {
            throw new Error(
                "A sala já possui uma reserva neste período."
            );
        }

        return await this.reservationRepository.create(data);
    }

    async findAll() {
        return await this.reservationRepository.findAll();
    }

    async findById(id) {
        const reservation =
            await this.reservationRepository.findById(id);

        if (!reservation) {
            throw new Error("Reserva não encontrada.");
        }

        return reservation;
    }

    async cancel(id) {
        const reservation = await this.findById(id);

        return await this.reservationRepository.update(
            reservation.id,
            {
                status: "CANCELLED",
            }
        );
    }
}

module.exports = ReservationService;