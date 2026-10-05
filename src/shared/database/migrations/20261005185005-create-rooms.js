module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("rooms", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            nome: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            descricao: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            capacidade: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            localizacao: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            recursos: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            status: {
                type: Sequelize.ENUM("ATIVA", "INATIVA"),
                allowNull: false,
                defaultValue: "ATIVA",
            },

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("rooms");
    },
};