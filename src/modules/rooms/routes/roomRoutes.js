const { Router } = require('express');
const RoomController = require('../controllers/RoomController');

const roomRoutes = Router();

roomRoutes.post('/', RoomController.create);
roomRoutes.get('/', RoomController.index);
roomRoutes.get('/:id', RoomController.show);
roomRoutes.put('/:id', RoomController.update);
roomRoutes.delete('/:id', RoomController.delete);

module.exports = roomRoutes;