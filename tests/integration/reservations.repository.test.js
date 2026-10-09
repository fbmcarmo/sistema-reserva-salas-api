
import { SequelizeReservationRepository } from '../../src/modules/reservations/repositories/SequelizeReservationRepository.js';
import { Reservation } from '../../src/modules/reservations/models/Reservation.js';
import database from '../../src/config/database.js';

describe('Integração - SequelizeReservationRepository', () => {
  let reservationRepository;
  let createdReservationId;

  beforeAll(async () => {
    // Confirme o método de conexão e a instância
    // Sequelize disponibilizados pela sua classe Database.
    await database.connect();

    reservationRepository =
      new SequelizeReservationRepository();
  });

  afterEach(async () => {
    if (createdReservationId) {
      await Reservation.destroy({
        where: { id: createdReservationId },
      });

      createdReservationId = undefined;
    }
  });

  afterAll(async () => {
    // Ajuste para o método de encerramento real
    // da conexão na sua classe Database.
    await database.getConnection().close();
  });

  test('deve persistir e consultar uma reserva', async () => {
    const reservationData = {
      userId: 1,
      roomId: 1,
      startDate: new Date('2026-10-10T10:00:00'),
      endDate: new Date('2026-10-10T11:00:00'),
    };

    const createdReservation =
      await reservationRepository.create(reservationData);

    createdReservationId = createdReservation.id;

    expect(createdReservation.id).toBeDefined();
    expect(createdReservation.roomId).toBe(1);

    const foundReservation =
      await reservationRepository.findById(
        createdReservationId
      );

    expect(foundReservation).toBeDefined();
    expect(foundReservation.id).toBe(createdReservationId);
  });
});