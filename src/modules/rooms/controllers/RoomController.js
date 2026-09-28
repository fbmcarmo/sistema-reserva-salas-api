const RoomService = require("../services/RoomService");

class RoomController {

    constructor() {
        this.roomService = new RoomService();
    }

    findAll = async (req, res) => {
        try {
            const rooms = await this.roomService.findAll();

            return res.status(200).json(rooms);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    };

    findById = async (req, res) => {
        try {
            const room = await this.roomService.findById(
                req.params.id
            );

            return res.status(200).json(room);
        } catch (error) {
            return res.status(404).json({
                message: error.message,
            });
        }
    };

    create = async (req, res) => {
        try {
            const room = await this.roomService.create(req.body);

            return res.status(201).json(room);
        } catch (error) {
            return res.status(400).json({
                message: error.message,
            });
        }
    };

    update = async (req, res) => {
        try {
            const room = await this.roomService.update(
                req.params.id,
                req.body
            );

            return res.status(200).json(room);
        } catch (error) {
            return res.status(400).json({
                message: error.message,
            });
        }
    };

    delete = async (req, res) => {
        try {
            await this.roomService.delete(req.params.id);

            return res.status(204).send();
        } catch (error) {
            return res.status(404).json({
                message: error.message,
            });
        }
    };
}

module.exports = RoomController;