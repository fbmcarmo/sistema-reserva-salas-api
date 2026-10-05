class ReservationRepositoryBridge {
    constructor(repositoryImplementation) {
        this.repositoryImplementation = repositoryImplementation;
    }

    async create(reservationData) {
        return this.repositoryImplementation.create(
            reservationData
        );
    }

    async findAll() {
        return this.repositoryImplementation.findAll();
    }

    async findById(id) {
        return this.repositoryImplementation.findById(id);
    }

    async findByUserId(userId) {
        return this.repositoryImplementation.findByUserId(userId);
    }

    async findByRoomId(roomId) {
        return this.repositoryImplementation.findByRoomId(roomId);
    }

    async findConflictingReservation(
        roomId,
        startDate,
        endDate,
        reservationId
    ) {
        return this.repositoryImplementation.findConflictingReservation(
            roomId,
            startDate,
            endDate,
            reservationId
        );
    }

    async update(id, reservationData) {
        return this.repositoryImplementation.update(
            id,
            reservationData
        );
    }

    async cancel(id) {
        return this.repositoryImplementation.cancel(id);
    }

    async findAvailableReservations(
        roomId,
        startDate,
        endDate
    ) {
        return this.repositoryImplementation.findAvailableReservations(
            roomId,
            startDate,
            endDate
        );
    }
}

module.exports = ReservationRepositoryBridge;