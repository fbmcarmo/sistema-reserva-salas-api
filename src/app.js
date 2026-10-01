const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./shared/docs/swagger");

const usersRoutes = require("./modules/users/routes/users.routes");
const roomsRoutes = require("./modules/rooms/routes/rooms.routes");
const reservationsRoutes = require("./modules/reservations/routes/reservations.routes");
const authenticationRoutes = require("./modules/authentication/routes/authentication.routes");

const ErrorHandlingMiddleware = require("./shared/middlewares/ErrorHandlingMiddleware");
const ApplicationError = require("./shared/errors/ApplicationError");

class App {
  constructor() {
    this.app = express();

    this.configureMiddlewares();
    this.configureSwagger();
    this.configureRoutes();
    this.configureErrorHandling(); // Registrado obrigatoriamente após as rotas
  }

  configureMiddlewares() {
    this.app.use(cors());
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
    this.registerRoute("/users", usersRoutes);
    this.registerRoute("/rooms", roomsRoutes);
    this.registerRoute("/reservations", reservationsRoutes);
    this.registerRoute("/auth", authenticationRoutes);

    // Rota de verificação do status da API
    this.app.get("/health", (req, res) => {
      res.status(200).json({ status: "API operacional" });
    });

    // Tratamento para qualquer rota não mapeada (404 padronizado)
    this.app.use((req, res, next) => {
      next(new ApplicationError(`Rota '${req.originalUrl}' não encontrada.`, 404));
    });
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

  configureErrorHandling() {
    // Interceptador global de exceções
    this.app.use(ErrorHandlingMiddleware);
  }

  getApp() {
    return this.app;
  }
}

module.exports = new App().getApp();