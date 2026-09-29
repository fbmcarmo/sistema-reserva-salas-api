const express = require("express");

const ReservationController = require("../controllers/ReservationController");

class ReservationRoutes {
    constructor() {
        this.router = express.Router();
        this.reservationController = new ReservationController();

        this.configureRoutes();
    }

    configureRoutes() {
        this.router.get(
            "/",
            this.reservationController.findAll
        );

        this.router.get(
            "/:id",
            this.reservationController.findById
        );

        this.router.post(
            "/",
            this.reservationController.create
        );

        this.router.put(
            "/:id",
            this.reservationController.update
        );

        this.router.delete(
            "/:id",
            this.reservationController.delete
        );
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new ReservationRoutes().getRouter();