const AppError = require("../../../shared/errors/AppError");

class RoomService {
    constructor(
        roomRepository,
        roomBuilder,
        roomValidator
    ) {
        this.roomRepository = roomRepository;
        this.roomBuilder = roomBuilder;
        this.roomValidator = roomValidator;
    }

    async create(roomData) {
        this.roomValidator.validateCreate(roomData);

        const room = this.roomBuilder
            .setNome(roomData.nome.trim())
            .setDescricao(roomData.descricao || null)
            .setCapacidade(Number(roomData.capacidade))
            .setLocalizacao(roomData.localizacao.trim())
            .setRecursos(roomData.recursos || null)
            .setStatus(roomData.status || "ATIVA")
            .build();

        return this.roomRepository.create(room);
    }

    async findAll() {
        return this.roomRepository.findAll();
    }

    async findById(id) {
        const room = await this.roomRepository.findById(id);

        if (!room) {
            throw new AppError(
                "Sala não encontrada.",
                404
            );
        }

        return room;
    }

    async update(id, roomData) {
        await this.findById(id);

        this.roomValidator.validateUpdate(roomData);

        const data = {};

        if (roomData.nome !== undefined) {
            data.nome = roomData.nome.trim();
        }

        if (roomData.descricao !== undefined) {
            data.descricao = roomData.descricao;
        }

        if (roomData.capacidade !== undefined) {
            data.capacidade = Number(roomData.capacidade);
        }

        if (roomData.localizacao !== undefined) {
            data.localizacao = roomData.localizacao.trim();
        }

        if (roomData.recursos !== undefined) {
            data.recursos = roomData.recursos;
        }

        if (roomData.status !== undefined) {
            data.status = roomData.status;
        }

        return this.roomRepository.update(id, data);
    }

    async delete(id) {
        const room = await this.findById(id);

        await this.roomRepository.delete(id);

        return room;
    }
}

module.exports = RoomService;