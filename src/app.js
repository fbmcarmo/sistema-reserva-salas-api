const express = require("express");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./shared/docs/swagger");

const usersRoutes = require("./modules/users/routes/users.routes");
const roomsRoutes = require("./modules/rooms/routes/rooms.routes");
const reservationsRoutes = require("./modules/reservations/routes/reservations.routes");
const authenticationRoutes = require("./modules/authentication/routes/authentication.routes");

class App {
    constructor() {
        this.app = express();

        this.configureMiddlewares();
        this.configureSwagger();
        this.configureRoutes();
    }

    configureMiddlewares() {
        this.app.use(express.json());
    }

    configureSwagger() {
        this.app.use(
            "/api-docs",
            swaggerUi.serve,
            swaggerUi.setup(swaggerSpec)
        );
    }

    configureRoutes() {
        this.registerRoute("/api/users", usersRoutes);
        this.registerRoute("/api/rooms", roomsRoutes);
        this.registerRoute("/api/reservations", reservationsRoutes);
        this.registerRoute("/api/auth", authenticationRoutes);
    }

    registerRoute(path, route) {
        if (typeof route !== "function") {
            throw new TypeError(
                `A rota "${path}" não foi configurada corretamente. ` +
                `Esperado um Express Router, mas recebido: ${typeof route}`
            );
        }

        this.app.use(path, route);
    }

    getApp() {
        return this.app;
    }
}

module.exports = new App().getApp();