
const { randomUUID } = require("crypto");

const database = require(
    "../../src/shared/database/connection"
);

const User = require(
    "../../src/modules/users/models/User"
);

const Room = require(
    "../../src/modules/rooms/models/Room"
);

const Reservation = require(
    "../../src/modules/reservations/models/Reservation"
);

const SequelizeReservationRepository = require(
    "../../src/modules/reservations/repositories/SequelizeReservationRepository"
);

describe("Integração - SequelizeReservationRepository", () => {
    let sequelize;
    let reservationRepository;

    let createdUser;
    let createdRoom;
    let createdReservation;

    beforeAll(async () => {
        if (process.env.NODE_ENV !== "test") {
            throw new Error(
                "Os testes devem executar com NODE_ENV=test."
            );
        }

        if (
            !process.env.TEST_DB_NAME ||
            !process.env.TEST_DB_HOST
        ) {
            throw new Error(
                "Configure TEST_DB_NAME e TEST_DB_HOST."
            );
        }

        sequelize = database.getConnection();

        if (
            sequelize.config.database !== process.env.TEST_DB_NAME ||
            sequelize.config.host !== process.env.TEST_DB_HOST
        ) {
            throw new Error(
                "A conexão não está utilizando o banco de testes."
            );
        }

        await database.connect();

        // Inicializa os modelos na conexão Sequelize.
        if (!User.sequelize) {
            User.initModel();
        }

        if (!Room.sequelize) {
            Room.initModel();
        }

        if (!Reservation.sequelize) {
            Reservation.initModel();
        }

        reservationRepository =
            new SequelizeReservationRepository();
    });

    beforeEach(async () => {
        // Email exclusivo para evitar conflitos entre execuções.
        const email = `teste-${randomUUID()}@example.com`;

        createdUser = await User.create({
            name: "Usuário de Teste",
            email,
            password: "hash-ficticio-para-teste",
            role: "USER",
        });

        createdRoom = await Room.create({
            nome: "Sala de Integração",
            descricao: "Sala criada pelo Jest",
            capacidade: 10,
            localizacao: "Bloco de Testes",
            recursos: "Projetor, Wi-Fi",
            status: "ATIVA",
        });
    });

    afterEach(async () => {
        try {
            // Exclui primeiro a reserva para respeitar
            // as restrições de chave estrangeira.
            if (createdReservation) {
                await Reservation.destroy({
                    where: {
                        id: createdReservation.id,
                    },
                });
            }

            if (createdRoom) {
                await Room.destroy({
                    where: {
                        id: createdRoom.id,
                    },
                });
            }

            if (createdUser) {
                await User.destroy({
                    where: {
                        id: createdUser.id,
                    },
                });
            }
        } finally {
            createdReservation = null;
            createdRoom = null;
            createdUser = null;
        }
    });

    afterAll(async () => {
        if (sequelize) {
            await sequelize.close();
        }
    });

    test("deve persistir e consultar uma reserva", async () => {
        const reservationData = {
            userId: createdUser.id,
            roomId: createdRoom.id,
            startDate: new Date(
                "2026-10-10T10:00:00Z"
            ),
            endDate: new Date(
                "2026-10-10T11:00:00Z"
            ),
            status: "CONFIRMADA",
        };

        createdReservation =
            await reservationRepository.create(
                reservationData
            );

        expect(createdReservation).toBeDefined();
        expect(createdReservation.id).toBeDefined();

        expect(createdReservation.userId).toBe(
            createdUser.id
        );

        expect(createdReservation.roomId).toBe(
            createdRoom.id
        );

        expect(createdReservation.status).toBe(
            "CONFIRMADA"
        );

        const foundReservation =
            await reservationRepository.findById(
                createdReservation.id
            );

        expect(foundReservation).not.toBeNull();

        expect(foundReservation.id).toBe(
            createdReservation.id
        );

        expect(foundReservation.userId).toBe(
            createdUser.id
        );

        expect(foundReservation.roomId).toBe(
            createdRoom.id
        );
    });
});
