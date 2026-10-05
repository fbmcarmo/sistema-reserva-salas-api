const AppError = require("../../../shared/errors/AppError");

class ReservationService {
    constructor(
        reservationRepository,
        reservationBuilder,
        reservationValidator
    ) {
        this.reservationRepository =
            reservationRepository;

        this.reservationBuilder =
            reservationBuilder;

        this.reservationValidator =
            reservationValidator;
    }

    async create(reservationData) {
        this.reservationValidator.validateCreate(
            reservationData
        );

        const {
            userId,
            roomId,
            startDate,
            endDate,
        } = reservationData;

        const start = new Date(startDate);
        const end = new Date(endDate);

        const conflictingReservation =
            await this.reservationRepository.findConflictingReservation(
                roomId,
                start,
                end
            );

        if (conflictingReservation) {
            throw new AppError(
                "A sala já está reservada nesse período.",
                409
            );
        }

        const reservation =
            this.reservationBuilder
                .setUserId(Number(userId))
                .setRoomId(Number(roomId))
                .setStartDate(start)
                .setEndDate(end)
                .setStatus("CONFIRMADA")
                .build();

        return this.reservationRepository.create(
            reservation
        );
    }

    async findAll() {
        return this.reservationRepository.findAll();
    }

    async findById(id) {
        const reservation =
            await this.reservationRepository.findById(id);

        if (!reservation) {
            throw new AppError(
                "Reserva não encontrada.",
                404
            );
        }

        return reservation;
    }

    async findByUserId(userId) {
        return this.reservationRepository.findByUserId(
            userId
        );
    }

    async findByRoomId(roomId) {
        return this.reservationRepository.findByRoomId(
            roomId
        );
    }

    async checkAvailability(
        roomId,
        startDate,
        endDate
    ) {
        this.reservationValidator.validateDates(
            startDate,
            endDate
        );

        const start = new Date(startDate);
        const end = new Date(endDate);

        const conflictingReservation =
            await this.reservationRepository.findConflictingReservation(
                roomId,
                start,
                end
            );

        return {
            roomId: Number(roomId),
            startDate: start,
            endDate: end,
            available: !conflictingReservation,
        };
    }

    async update(id, reservationData) {
        const reservation =
            await this.findById(id);

        if (
            reservation.status === "CANCELADA"
        ) {
            throw new AppError(
                "Uma reserva cancelada não pode ser alterada.",
                400
            );
        }

        const data = {};

        const startDate =
            reservationData.startDate !== undefined
                ? new Date(reservationData.startDate)
                : new Date(reservation.startDate);

        const endDate =
            reservationData.endDate !== undefined
                ? new Date(reservationData.endDate)
                : new Date(reservation.endDate);

        this.reservationValidator.validateDates(
            startDate,
            endDate
        );

        const roomId =
            reservationData.roomId !== undefined
                ? Number(reservationData.roomId)
                : reservation.roomId;

        const conflictingReservation =
            await this.reservationRepository.findConflictingReservation(
                roomId,
                startDate,
                endDate,
                id
            );

        if (conflictingReservation) {
            throw new AppError(
                "A sala já está reservada nesse período.",
                409
            );
        }

        if (reservationData.userId !== undefined) {
            data.userId =
                Number(reservationData.userId);
        }

        if (reservationData.roomId !== undefined) {
            data.roomId =
                Number(reservationData.roomId);
        }

        if (reservationData.startDate !== undefined) {
            data.startDate = startDate;
        }

        if (reservationData.endDate !== undefined) {
            data.endDate = endDate;
        }

        if (reservationData.status !== undefined) {
            if (
                !["CONFIRMADA", "CANCELADA"].includes(
                    reservationData.status
                )
            ) {
                throw new AppError(
                    "O status deve ser CONFIRMADA ou CANCELADA.",
                    400
                );
            }

            data.status =
                reservationData.status;
        }

        return this.reservationRepository.update(
            id,
            data
        );
    }

    async cancel(id) {
        const reservation =
            await this.findById(id);

        if (
            reservation.status === "CANCELADA"
        ) {
            throw new AppError(
                "A reserva já está cancelada.",
                400
            );
        }

        return this.reservationRepository.cancel(
            id
        );
    }
}

module.exports = ReservationService;