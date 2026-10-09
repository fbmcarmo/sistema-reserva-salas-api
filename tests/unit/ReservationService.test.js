
import { ReservationService } from '../../src/modules/reservations/services/ReservationService.js';

describe('ReservationService', () => {
  let reservationService;
  let reservationRepositoryBridge;
  let reservationBuilder;
  let reservationValidator;

  beforeEach(() => {
    reservationRepositoryBridge = {
      findConflictingReservation: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      cancel: jest.fn(),
      findAvailableReservations: jest.fn(),
    };

    reservationBuilder = {
      build: jest.fn(),
    };

    reservationValidator = {
      validate: jest.fn(),
    };

    // Ajuste a ordem dos argumentos conforme
    // o construtor real do seu ReservationService.
    reservationService = new ReservationService(
      reservationRepositoryBridge,
      reservationBuilder,
      reservationValidator
    );
  });

  describe('createReservation', () => {
    test('deve criar uma reserva válida', async () => {
      const reservationData = {
        userId: 1,
        roomId: 2,
        startDate: '2026-10-10T10:00:00',
        endDate: '2026-10-10T11:00:00',
      };

      const builtReservation = {
        ...reservationData,
      };

      const savedReservation = {
        id: 10,
        ...reservationData,
      };

      reservationValidator.validate.mockReturnValue(true);

      reservationRepositoryBridge
        .findConflictingReservation
        .mockResolvedValue(null);

      reservationBuilder.build.mockReturnValue(builtReservation);

      reservationRepositoryBridge.create
        .mockResolvedValue(savedReservation);

      const result = await reservationService.createReservation(
        reservationData
      );

      expect(reservationValidator.validate)
        .toHaveBeenCalled();

      expect(
        reservationRepositoryBridge.findConflictingReservation
      ).toHaveBeenCalled();

      expect(reservationRepositoryBridge.create)
        .toHaveBeenCalled();

      expect(result).toEqual(savedReservation);
    });

    test('deve rejeitar uma reserva com conflito de horário', async () => {
      const reservationData = {
        userId: 1,
        roomId: 2,
        startDate: '2026-10-10T10:00:00',
        endDate: '2026-10-10T11:00:00',
      };

      reservationValidator.validate.mockReturnValue(true);

      reservationRepositoryBridge
        .findConflictingReservation
        .mockResolvedValue({
          id: 5,
          roomId: 2,
          startDate: '2026-10-10T10:30:00',
          endDate: '2026-10-10T11:30:00',
        });

      await expect(
        reservationService.createReservation(reservationData)
      ).rejects.toThrow();

      expect(reservationRepositoryBridge.create)
        .not.toHaveBeenCalled();
    });
  });

  describe('findAllReservations', () => {
    test('deve retornar as reservas cadastradas', async () => {
      const reservations = [
        { id: 1, roomId: 2 },
        { id: 2, roomId: 3 },
      ];

      reservationRepositoryBridge.findAll
        .mockResolvedValue(reservations);

      const result =
        await reservationService.findAllReservations();

      expect(result).toEqual(reservations);
      expect(reservationRepositoryBridge.findAll)
        .toHaveBeenCalledTimes(1);
    });
  });
});