const express = require("express");
const RoomController = require("../controllers/RoomController");

const router = express.Router();

const roomController = new RoomController();

router.get("/", roomController.findAll);
router.get("/:id", roomController.findById);
router.post("/", roomController.create);
router.put("/:id", roomController.update);
router.delete("/:id", roomController.delete);

module.exports = router;