const SequelizeRoomRepository = require('../repositories/SequelizeRoomRepository');
const CreateRoomService = require('../services/CreateRoomService');
const FindAllRoomsService = require('../services/FindAllRoomsService');
const FindRoomByIdService = require('../services/FindRoomByIdService');
const UpdateRoomService = require('../services/UpdateRoomService');
const DeleteRoomService = require('../services/DeleteRoomService');

class RoomController {
  async create(req, res, next) {
    try {
      const repository = new SequelizeRoomRepository();
      const service = new CreateRoomService(repository);
      const room = await service.execute(req.body);

      return res.status(201).json(room);
    } catch (error) {
      next(error);
    }
  }

  async index(req, res, next) {
    try {
      const repository = new SequelizeRoomRepository();
      const service = new FindAllRoomsService(repository);
      const rooms = await service.execute();

      return res.status(200).json(rooms);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const { id } = req.params;
      const repository = new SequelizeRoomRepository();
      const service = new FindRoomByIdService(repository);
      const room = await service.execute(id);

      return res.status(200).json(room);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const repository = new SequelizeRoomRepository();
      const service = new UpdateRoomService(repository);
      const updatedRoom = await service.execute(id, req.body);

      return res.status(200).json(updatedRoom);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const repository = new SequelizeRoomRepository();
      const service = new DeleteRoomService(repository);
      const result = await service.execute(id);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RoomController();