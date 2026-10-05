const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
    openapi: "3.0.0",

    info: {
        title: "Sistema de Reserva de Salas API",
        version: "1.0.0",
        description:
            "API REST para gerenciamento de usuários, salas e reservas.",
    },

    servers: [
        {
            url: "http://localhost:3001",
            description: "Servidor local",
        },
    ],

    tags: [
        {
            name: "Authentication",
            description: "Autenticação dos usuários",
        },
        {
            name: "Users",
            description: "Gerenciamento de usuários",
        },
        {
            name: "Rooms",
            description: "Gerenciamento de salas",
        },
        {
            name: "Reservations",
            description: "Gerenciamento de reservas",
        },
    ],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
};

const swaggerOptions = {
    definition: swaggerDefinition,

    apis: [
        "./src/modules/**/*.routes.js",
        "./src/shared/docs/schemas/*.js",
    ],

    failOnErrors: true,
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;