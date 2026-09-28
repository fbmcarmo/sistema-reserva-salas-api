const RoomRepository = require("../repositories/RoomRepository");

class RoomService {

    constructor() {
        this.roomRepository = new RoomRepository();
    }

    async findAll() {
        return await this.roomRepository.findAll();
    }

    async findById(id) {
        const room = await this.roomRepository.findById(id);

        if (!room) {
            throw new Error("Sala não encontrada.");
        }

        return room;
    }

    async create(data) {
        if (!data.name) {
            throw new Error("Nome da sala é obrigatório.");
        }

        if (!data.capacity || data.capacity <= 0) {
            throw new Error("Capacidade da sala deve ser maior que zero.");
        }

        return await this.roomRepository.create(data);
    }

    async update(id, data) {
        const room = await this.findById(id);

        return await this.roomRepository.update(room.id, data);
    }

    async delete(id) {
        const room = await this.findById(id);

        return await this.roomRepository.delete(room.id);
    }
}

module.exports = RoomService;