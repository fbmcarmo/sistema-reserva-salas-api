
const ReservationService = require(
  "../../src/modules/reservations/services/ReservationService"
);

describe("ReservationService", () => {
  let reservationService;
  let reservationRepository;
  let userRepository;
  let roomRepository;
  let reservationValidator;

  const futureDates = () => {
    const startDate = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    const endDate = new Date(
      startDate.getTime() + 60 * 60 * 1000
    );

    return { startDate, endDate };
  };

  beforeEach(() => {
    reservationRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findConflictingReservation: jest.fn(),
      update: jest.fn(),
      cancel: jest.fn(),
    };

    userRepository = {
      findById: jest.fn(),
    };

    roomRepository = {
      findById: jest.fn(),
    };

    reservationValidator = {
      validateCreate: jest.fn(),
      validateUpdate: jest.fn(),
    };

    userRepository.findById.mockResolvedValue({
      id: 1,
      name: "Usuário Teste",
    });

    roomRepository.findById.mockResolvedValue({
      id: 2,
      nome: "Sala Teste",
      status: "ATIVA",
    });

    reservationRepository
      .findConflictingReservation
      .mockResolvedValue(null);

    reservationService = new ReservationService({
      reservationRepository,
      userRepository,
      roomRepository,
      reservationValidator,
    });
  });

  describe("create", () => {
    test("deve criar uma reserva válida", async () => {
      const reservationData = {
        userId: 1,
        roomId: 2,
        ...futureDates(),
      };

      const savedReservation = {
        id: 10,
        ...reservationData,
        status: "CONFIRMADA",
      };

      reservationRepository.create.mockResolvedValue(
        savedReservation
      );

      const result = await reservationService.create(
        reservationData
      );

      expect(
        reservationValidator.validateCreate
      ).toHaveBeenCalledWith(reservationData);

      expect(userRepository.findById)
        .toHaveBeenCalledWith(1);

      expect(roomRepository.findById)
        .toHaveBeenCalledWith(2);

      expect(
        reservationRepository.findConflictingReservation
      ).toHaveBeenCalledWith({
        roomId: 2,
        startDate: reservationData.startDate,
        endDate: reservationData.endDate,
      });

      expect(reservationRepository.create)
        .toHaveBeenCalledWith({
          ...reservationData,
          status: "CONFIRMADA",
        });

      expect(result).toEqual(savedReservation);
    });

    test("deve rejeitar reserva com conflito", async () => {
      const reservationData = {
        userId: 1,
        roomId: 2,
        ...futureDates(),
      };

      reservationRepository
        .findConflictingReservation
        .mockResolvedValue({
          id: 5,
          roomId: 2,
        });

      await expect(
        reservationService.create(reservationData)
      ).rejects.toThrow(
        "A sala já está reservada neste período."
      );

      expect(reservationRepository.create)
        .not.toHaveBeenCalled();
    });

    test("deve rejeitar usuário inexistente", async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(
        reservationService.create({
          userId: 1,
          roomId: 2,
          ...futureDates(),
        })
      ).rejects.toThrow("Usuário não encontrado.");

      expect(reservationRepository.create)
        .not.toHaveBeenCalled();
    });

    test("deve rejeitar sala inativa", async () => {
      roomRepository.findById.mockResolvedValue({
        id: 2,
        status: "INATIVA",
      });

      await expect(
        reservationService.create({
          userId: 1,
          roomId: 2,
          ...futureDates(),
        })
      ).rejects.toThrow("A sala está inativa.");
    });
  });

  describe("findAll", () => {
    test("deve retornar reservas cadastradas", async () => {
      const reservations = [
        { id: 1, roomId: 2 },
        { id: 2, roomId: 3 },
      ];

      reservationRepository.findAll.mockResolvedValue(
        reservations
      );

      const result = await reservationService.findAll();

      expect(result).toEqual(reservations);

      expect(reservationRepository.findAll)
        .toHaveBeenCalledTimes(1);
    });
  });

  describe("findById", () => {
    test("deve retornar uma reserva existente", async () => {
      const reservation = {
        id: 1,
        userId: 1,
        roomId: 2,
      };

      reservationRepository.findById.mockResolvedValue(
        reservation
      );

      const result = await reservationService.findById(1);

      expect(result).toEqual(reservation);
    });

    test("deve rejeitar reserva inexistente", async () => {
      reservationRepository.findById.mockResolvedValue(
        null
      );

      await expect(
        reservationService.findById(999)
      ).rejects.toThrow("Reserva não encontrada.");
    });
  });

  describe("cancel", () => {
    test("deve cancelar reserva do proprietário", async () => {
      reservationRepository.findById.mockResolvedValue({
        id: 1,
        userId: 1,
        status: "CONFIRMADA",
      });

      reservationRepository.cancel.mockResolvedValue(
        true
      );

      const result = await reservationService.cancel(
        1,
        1,
        "USER"
      );

      expect(reservationRepository.cancel)
        .toHaveBeenCalledWith(1);

      expect(result).toEqual({
        message: "Reserva cancelada com sucesso.",
      });
    });

    test("deve impedir cancelamento sem permissão", async () => {
      reservationRepository.findById.mockResolvedValue({
        id: 1,
        userId: 1,
        status: "CONFIRMADA",
      });

      await expect(
        reservationService.cancel(1, 99, "USER")
      ).rejects.toThrow(
        "Você não possui permissão para alterar esta reserva."
      );

      expect(reservationRepository.cancel)
        .not.toHaveBeenCalled();
    });
  });
});
