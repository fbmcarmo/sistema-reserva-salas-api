const express = require("express");

const userRoutes = require("./modules/users/routes/users.routes");
const roomRoutes = require("./modules/rooms/routes/rooms.routes");
const reservationRoutes = require(
    "./modules/reservations/routes/reservations.routes"
);
const authenticationRoutes = require(
    "./modules/authentication/routes/authentication.routes"
);

class App {

    constructor() {

        this.app = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {

        this.app.use(express.json());
    }

    routes() {

        this.app.use(
            "/users",
            userRoutes
        );

        this.app.use(
            "/rooms",
            roomRoutes
        );

        this.app.use(
            "/reservations",
            reservationRoutes
        );

        this.app.use(
            "/auth",
            authenticationRoutes
        );
    }

    getApp() {
        return this.app;
    }
}

module.exports = new App().getApp();