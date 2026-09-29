const express = require("express");

const roomRoutes = require("./modules/rooms/routes/rooms.routes");
const userRoutes = require("./modules/users/routes/users.routes");
const authenticationRoutes = require(
    "./modules/authentication/routes/authentication.routes"
);

const ErrorHandlerMiddleware = require("./shared/middlewares/ErrorHandlerMiddleware");

class App {
    constructor() {
        this.app = express();

        this.middlewares();
        this.routes();
        this.errorHandlers();
    }

    middlewares() {
        this.app.use(express.json());
    }

    routes() {
        this.app.use("/rooms", roomRoutes);
        this.app.use("/users", userRoutes);
        this.app.use("/auth", authenticationRoutes);
    }

    errorHandlers() {
        this.app.use(ErrorHandlerMiddleware.handle);
    }

    getApp() {
        return this.app;
    }
}

module.exports = new App().getApp();