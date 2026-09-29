const { Router } = require('express');
const ReservationController = require('../controllers/ReservationController');

const reservationRoutes = Router();

reservationRoutes.post('/', ReservationController.create);

module.exports = reservationRoutes;