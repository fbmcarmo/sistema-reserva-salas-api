class ReservationController {
    constructor(reservationService) {
        this.reservationService =
            reservationService;
    }

    create = async (req, res, next) => {
        try {
            const reservation =
                await this.reservationService.create(
                    req.body
                );

            return res
                .status(201)
                .json(reservation);
        } catch (error) {
            return next(error);
        }
    };

    findAll = async (req, res, next) => {
        try {
            const reservations =
                await this.reservationService.findAll();

            return res
                .status(200)
                .json(reservations);
        } catch (error) {
            return next(error);
        }
    };

    findById = async (req, res, next) => {
        try {
            const { id } = req.params;

            const reservation =
                await this.reservationService.findById(
                    id
                );

            return res
                .status(200)
                .json(reservation);
        } catch (error) {
            return next(error);
        }
    };

    findByUserId = async (req, res, next) => {
        try {
            const { userId } = req.params;

            const reservations =
                await this.reservationService.findByUserId(
                    userId
                );

            return res
                .status(200)
                .json(reservations);
        } catch (error) {
            return next(error);
        }
    };

    findByRoomId = async (req, res, next) => {
        try {
            const { roomId } = req.params;

            const reservations =
                await this.reservationService.findByRoomId(
                    roomId
                );

            return res
                .status(200)
                .json(reservations);
        } catch (error) {
            return next(error);
        }
    };

    checkAvailability = async (req, res, next) => {
        try {
            const {
                roomId,
                startDate,
                endDate,
            } = req.query;

            const availability =
                await this.reservationService.checkAvailability(
                    roomId,
                    startDate,
                    endDate
                );

            return res
                .status(200)
                .json(availability);
        } catch (error) {
            return next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const { id } = req.params;

            const reservation =
                await this.reservationService.update(
                    id,
                    req.body
                );

            return res
                .status(200)
                .json(reservation);
        } catch (error) {
            return next(error);
        }
    };

    cancel = async (req, res, next) => {
        try {
            const { id } = req.params;

            const reservation =
                await this.reservationService.cancel(
                    id
                );

            return res
                .status(200)
                .json(reservation);
        } catch (error) {
            return next(error);
        }
    };
}

module.exports = ReservationController;