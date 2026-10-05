class ReservationRepositoryBridge {

    constructor(repositoryImplementation) {
        this.repositoryImplementation =
            repositoryImplementation;
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
        return this.repositoryImplementation.findById(
            id
        );
    }

    async findByUserId(userId) {
        return this.repositoryImplementation.findByUserId(
            userId
        );
    }

    async findConflictingReservation(
        reservationData
    ) {
        return this.repositoryImplementation
            .findConflictingReservation(
                reservationData
            );
    }

    async update(id, reservationData) {
        return this.repositoryImplementation.update(
            id,
            reservationData
        );
    }

    async cancel(id) {
        return this.repositoryImplementation.cancel(
            id
        );
    }
}

module.exports =
    ReservationRepositoryBridge;

