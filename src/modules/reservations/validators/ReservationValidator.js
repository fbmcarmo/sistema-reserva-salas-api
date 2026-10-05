const AppError = require("../../../shared/errors/AppError");

class ReservationValidator {
    validateCreate(reservationData) {
        const {
            userId,
            roomId,
            startDate,
            endDate,
        } = reservationData;

        if (
            !userId ||
            !roomId ||
            !startDate ||
            !endDate
        ) {
            throw new AppError(
                "Usuário, sala, data de início e data de término são obrigatórios.",
                400
            );
        }

        this.validateDates(startDate, endDate);
    }

    validateUpdate(reservationData) {
        if (
            reservationData.startDate !== undefined &&
            reservationData.endDate !== undefined
        ) {
            this.validateDates(
                reservationData.startDate,
                reservationData.endDate
            );
        }
    }

    validateDates(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

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
                "A data de início deve ser anterior à data de término.",
                400
            );
        }

        const now = new Date();

        if (start < now) {
            throw new AppError(
                "Não é possível criar uma reserva para um horário passado.",
                400
            );
        }
    }
}

module.exports = ReservationValidator;