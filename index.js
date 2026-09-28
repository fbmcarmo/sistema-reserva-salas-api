require("dotenv").config();

const app = require("./src/app");
const database = require("./src/shared/database/connection");

require("./src/shared/database/models");

const PORT = process.env.PORT || 3001;

async function startServer() {

    try {

        await database.connect();

        app.listen(PORT, () => {
            console.log(
                `Servidor rodando na porta ${PORT}`
            );
        });

    } catch (error) {

        console.error(
            "Erro ao iniciar aplicação:",
            error
        );

        process.exit(1);
    }
}

startServer();