const AppError = require("../../../shared/errors/AppError");

class RoomValidator {
    validateCreate(roomData) {
        const {
            nome,
            capacidade,
            localizacao,
        } = roomData;

        if (!nome || !capacidade || !localizacao) {
            throw new AppError(
                "Nome, capacidade e localização são obrigatórios.",
                400
            );
        }

        if (!Number.isInteger(Number(capacidade)) || Number(capacidade) <= 0) {
            throw new AppError(
                "A capacidade deve ser um número inteiro maior que zero.",
                400
            );
        }
    }

    validateUpdate(roomData) {
        if (
            roomData.capacidade !== undefined &&
            (!Number.isInteger(Number(roomData.capacidade)) ||
                Number(roomData.capacidade) <= 0)
        ) {
            throw new AppError(
                "A capacidade deve ser um número inteiro maior que zero.",
                400
            );
        }

        if (
            roomData.status !== undefined &&
            !["ATIVA", "INATIVA"].includes(roomData.status)
        ) {
            throw new AppError(
                "O status deve ser ATIVA ou INATIVA.",
                400
            );
        }
    }
}

module.exports = RoomValidator;