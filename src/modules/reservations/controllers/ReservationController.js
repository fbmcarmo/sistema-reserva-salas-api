class ReservationController {

    constructor(reservationService) {
        this.reservationService =
            reservationService;
    }

    findAll = async (
        req,
        res,
        next
    ) => {
        try {
            const reservations =
                await this.reservationService
                    .findAll();

            return res.status(200).json({
                reservations,
            });
        } catch (error) {
            return next(error);
        }
    };

    findById = async (
        req,
        res,
        next
    ) => {
        try {
            const reservation =
                await this.reservationService
                    .findById(
                        req.params.id
                    );

            return res.status(200).json({
                reservation,
            });
        } catch (error) {
            return next(error);
        }
    };

    findMyReservations = async (
        req,
        res,
        next
    ) => {
        try {
            const reservations =
                await this.reservationService
                    .findMyReservations(
                        req.auth.userId
                    );

            return res.status(200).json({
                reservations,
            });
        } catch (error) {
            return next(error);
        }
    };

    create = async (
        req,
        res,
        next
    ) => {
        try {
            const reservation =
                await this.reservationService.create({
                    userId:
                        req.auth.userId,

                    roomId:
                        req.body.roomId,

                    startDate:
                        req.body.startDate,

                    endDate:
                        req.body.endDate,
                });

            return res.status(201).json({
                message:
                    "Reserva criada com sucesso.",
                reservation,
            });
        } catch (error) {
            return next(error);
        }
    };

    update = async (
        req,
        res,
        next
    ) => {
        try {
            const reservation =
                await this.reservationService.update(
                    req.params.id,
                    req.auth.userId,
                    req.auth.role,
                    req.body
                );

            return res.status(200).json({
                message:
                    "Reserva atualizada com sucesso.",
                reservation,
            });
        } catch (error) {
            return next(error);
        }
    };

    cancel = async (
        req,
        res,
        next
    ) => {
        try {
            const result =
                await this.reservationService.cancel(
                    req.params.id,
                    req.auth.userId,
                    req.auth.role
                );

            return res.status(200).json(
                result
            );
        } catch (error) {
            return next(error);
        }
    };
}

module.exports =
    ReservationController;

