
import { ReservationRepositoryBridge } from '../../src/modules/reservations/repositories/ReservationRepositoryBridge.js';

describe('ReservationRepositoryBridge', () => {
  let reservationRepositoryBridge;
  let reservationRepository;

  beforeEach(() => {
    reservationRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findConflictingReservation: jest.fn(),
      findAvailableReservations: jest.fn(),
      cancel: jest.fn(),
    };

    reservationRepositoryBridge =
      new ReservationRepositoryBridge(reservationRepository);
  });

  test('deve delegar a criação de uma reserva ao repositório', async () => {
    const reservationData = {
      userId: 1,
      roomId: 2,
      startDate: '2026-10-10T10:00:00',
      endDate: '2026-10-10T11:00:00',
    };

    const savedReservation = {
      id: 10,
      ...reservationData,
    };

    reservationRepository.create.mockResolvedValue(
      savedReservation
    );

    const result =
      await reservationRepositoryBridge.create(reservationData);

    expect(reservationRepository.create)
      .toHaveBeenCalledWith(reservationData);

    expect(result).toEqual(savedReservation);
  });

  test('deve delegar a consulta de reservas', async () => {
    const reservations = [
      { id: 1, roomId: 2 },
      { id: 2, roomId: 3 },
    ];

    reservationRepository.findAll.mockResolvedValue(reservations);

    const result = await reservationRepositoryBridge.findAll();

    expect(reservationRepository.findAll)
      .toHaveBeenCalledTimes(1);

    expect(result).toEqual(reservations);
  });

  test('deve propagar erros do repositório', async () => {
    const error = new Error('Erro ao consultar reservas');

    reservationRepository.findAll.mockRejectedValue(error);

    await expect(
      reservationRepositoryBridge.findAll()
    ).rejects.toThrow('Erro ao consultar reservas');
  });
});