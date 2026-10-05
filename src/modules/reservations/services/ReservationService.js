const AppError = require(
    "../../../shared/errors/AppError"
);

const ReservationBuilder = require(
    "../builders/ReservationBuilder"
);

class ReservationService {

    constructor({
        reservationRepository,
        userRepository,
        roomRepository,
        reservationValidator,
    }) {
        this.reservationRepository =
            reservationRepository;

        this.userRepository =
            userRepository;

        this.roomRepository =
            roomRepository;

        this.reservationValidator =
            reservationValidator;
    }

    async create({
        userId,
        roomId,
        startDate,
        endDate,
    }) {

        this.reservationValidator.validateCreate({
            userId,
            roomId,
            startDate,
            endDate,
        });

        await this.validateUser(userId);

        await this.validateRoom(roomId);

        const dates =
            this.validateDates(
                startDate,
                endDate
            );

        const conflict =
            await this.reservationRepository
                .findConflictingReservation({
                    roomId,
                    startDate: dates.startDate,
                    endDate: dates.endDate,
                });

        if (conflict) {
            throw new AppError(
                "A sala já está reservada neste período.",
                409
            );
        }

        const reservation =
            new ReservationBuilder()
                .setUserId(userId)
                .setRoomId(roomId)
                .setStartDate(dates.startDate)
                .setEndDate(dates.endDate)
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
            await this.reservationRepository.findById(
                id
            );

        if (!reservation) {
            throw new AppError(
                "Reserva não encontrada.",
                404
            );
        }

        return reservation;
    }

    async findMyReservations(userId) {
        return this.reservationRepository
            .findByUserId(userId);
    }

    async update(
        id,
        userId,
        role,
        reservationData
    ) {
        const reservation =
            await this.findById(id);

        this.validateOwnership(
            reservation,
            userId,
            role
        );

        const startDate =
            reservationData.startDate !== undefined
                ? reservationData.startDate
                : reservation.startDate;

        const endDate =
            reservationData.endDate !== undefined
                ? reservationData.endDate
                : reservation.endDate;

        const roomId =
            reservationData.roomId !== undefined
                ? reservationData.roomId
                : reservation.roomId;

        const dates =
            this.validateDates(
                startDate,
                endDate
            );

        if (
            reservationData.roomId !== undefined
        ) {
            await this.validateRoom(roomId);
        }

        const conflict =
            await this.reservationRepository
                .findConflictingReservation({
                    roomId,
                    startDate: dates.startDate,
                    endDate: dates.endDate,
                    reservationId: reservation.id,
                });

        if (conflict) {
            throw new AppError(
                "A sala já está reservada neste período.",
                409
            );
        }

        return this.reservationRepository.update(
            id,
            {
                roomId,
                startDate: dates.startDate,
                endDate: dates.endDate,
            }
        );
    }

    async cancel(
        id,
        userId,
        role
    ) {
        const reservation =
            await this.findById(id);

        this.validateOwnership(
            reservation,
            userId,
            role
        );

        if (
            reservation.status === "CANCELADA"
        ) {
            throw new AppError(
                "A reserva já está cancelada.",
                400
            );
        }

        await this.reservationRepository.cancel(
            id
        );

        return {
            message:
                "Reserva cancelada com sucesso.",
        };
    }

    async validateUser(userId) {
        const user =
            await this.userRepository.findById(
                userId
            );

        if (!user) {
            throw new AppError(
                "Usuário não encontrado.",
                404
            );
        }
    }

    async validateRoom(roomId) {
        const room =
            await this.roomRepository.findById(
                roomId
            );

        if (!room) {
            throw new AppError(
                "Sala não encontrada.",
                404
            );
        }

        if (room.status === "INATIVA") {
            throw new AppError(
                "A sala está inativa.",
                400
            );
        }
    }

    validateDates(
        startDate,
        endDate
    ) {
        const start =
            new Date(startDate);

        const end =
            new Date(endDate);

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime())
        ) {
            throw new AppError(
                "As datas informadas são inválidas.",
                400
            );
        }

        if (start >= end) {
            throw new AppError(
                "A data inicial deve ser anterior à data final.",
                400
            );
        }

        return {
            startDate: start,
            endDate: end,
        };
    }

    validateOwnership(
        reservation,
        userId,
        role
    ) {
        const isOwner =
            reservation.userId === Number(userId);

        const isAdmin =
            role === "ADMIN";

        if (!isOwner && !isAdmin) {
            throw new AppError(
                "Você não possui permissão para alterar esta reserva.",
                403
            );
        }
    }
}

module.exports =
    ReservationService;

