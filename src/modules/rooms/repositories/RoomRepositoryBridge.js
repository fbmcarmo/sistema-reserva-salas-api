class RoomRepositoryBridge {

    constructor(repositoryImplementation) {
        this.repositoryImplementation =
            repositoryImplementation;
    }

    async create(roomData) {
        return this.repositoryImplementation.create(
            roomData
        );
    }

    async findAll() {
        return this.repositoryImplementation.findAll();
    }

    async findById(id) {
        return this.repositoryImplementation.findById(
            id
        );
    }

    async update(id, roomData) {
        return this.repositoryImplementation.update(
            id,
            roomData
        );
    }

    async delete(id) {
        return this.repositoryImplementation.delete(
            id
        );
    }

    async checkAvailability(
        roomId,
        startDate,
        endDate
    ) {
        return this.repositoryImplementation.checkAvailability(
            roomId,
            startDate,
            endDate
        );
    }

    async findReservations(roomId) {
        return this.repositoryImplementation.findReservations(
            roomId
        );
    }
}

module.exports = RoomRepositoryBridge;
