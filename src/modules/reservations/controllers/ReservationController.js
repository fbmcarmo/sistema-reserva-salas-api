class ReservationController {
    findAll = async (req, res, next) => {
        try {
            return res.status(200).json({
                message: "Listagem de reservas"
            });
        } catch (error) {
            return next(error);
        }
    };

    findById = async (req, res, next) => {
        try {
            const { id } = req.params;

            return res.status(200).json({
                message: "Busca de reserva",
                id
            });
        } catch (error) {
            return next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            const reservationData = req.body;

            return res.status(201).json({
                message: "Reserva criada",
                reservation: reservationData
            });
        } catch (error) {
            return next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const reservationData = req.body;

            return res.status(200).json({
                message: "Reserva atualizada",
                id,
                reservation: reservationData
            });
        } catch (error) {
            return next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            const { id } = req.params;

            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    };
}

module.exports = ReservationController;