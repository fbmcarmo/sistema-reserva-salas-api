const { Sequelize } = require("sequelize");
const config = require("../../config/database");

const environment = process.env.NODE_ENV || "development";

class Database {
    constructor() {
        const databaseConfig = config[environment];

        this.connection = new Sequelize(
            databaseConfig.database,
            databaseConfig.username,
            databaseConfig.password,
            {
                host: databaseConfig.host,
                port: databaseConfig.port,
                dialect: databaseConfig.dialect,
                dialectOptions: databaseConfig.dialectOptions,
                logging: false,
            }
        );
    }

    async connect() {
        await this.connection.authenticate();

        console.log("Banco de dados conectado com sucesso.");
    }

    getConnection() {
        return this.connection;
    }
}

module.exports = new Database();