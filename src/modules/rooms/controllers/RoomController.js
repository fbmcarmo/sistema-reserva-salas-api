class RoomController {
    constructor(roomService) {
        this.roomService = roomService;
    }

    create = async (req, res, next) => {
        try {
            const room = await this.roomService.create(req.body);

            return res.status(201).json(room);
        } catch (error) {
            return next(error);
        }
    };

    findAll = async (req, res, next) => {
        try {
            const rooms = await this.roomService.findAll();

            return res.status(200).json(rooms);
        } catch (error) {
            return next(error);
        }
    };

    findById = async (req, res, next) => {
        try {
            const { id } = req.params;

            const room = await this.roomService.findById(id);

            return res.status(200).json(room);
        } catch (error) {
            return next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const { id } = req.params;

            const room = await this.roomService.update(
                id,
                req.body
            );

            return res.status(200).json(room);
        } catch (error) {
            return next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            const { id } = req.params;

            await this.roomService.delete(id);

            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    };

    checkAvailability = async (req, res, next) => {
        try {
            const { roomId } = req.params;

            const {
                startDate,
                endDate,
            } = req.query;

            const availability =
                await this.roomService.checkAvailability(
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

    findReservations = async (req, res, next) => {
        try {
            const { roomId } = req.params;

            const reservations =
                await this.roomService.findReservations(
                    roomId
                );

            return res
                .status(200)
                .json({
                    roomId: Number(roomId),
                    reservations,
                });

        } catch (error) {
            return next(error);
        }
    };
}

module.exports = RoomController;