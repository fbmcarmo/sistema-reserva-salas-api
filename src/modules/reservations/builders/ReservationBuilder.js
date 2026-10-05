class ReservationBuilder {
    constructor() {
        this.reservation = {};
    }

    setUserId(userId) {
        this.reservation.userId = userId;

        return this;
    }

    setRoomId(roomId) {
        this.reservation.roomId = roomId;

        return this;
    }

    setStartDate(startDate) {
        this.reservation.startDate = startDate;

        return this;
    }

    setEndDate(endDate) {
        this.reservation.endDate = endDate;

        return this;
    }

    setStatus(status) {
        this.reservation.status = status;

        return this;
    }

    build() {
        return {
            ...this.reservation,
        };
    }
}

module.exports = ReservationBuilder;