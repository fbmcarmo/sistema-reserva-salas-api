
const ReservationRepositoryBridge = require(
  "../../src/modules/reservations/repositories/ReservationRepositoryBridge"
);

describe("ReservationRepositoryBridge", () => {
  let bridge;
  let repository;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findConflictingReservation: jest.fn(),
      update: jest.fn(),
      cancel: jest.fn(),
    };

    bridge = new ReservationRepositoryBridge(repository);
  });

  test("deve delegar criação ao repositório", async () => {
    const data = {
      userId: 1,
      roomId: 2,
    };

    const saved = {
      id: 10,
      ...data,
    };

    repository.create.mockResolvedValue(saved);

    const result = await bridge.create(data);

    expect(repository.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(saved);
  });

  test("deve delegar listagem ao repositório", async () => {
    const reservations = [
      { id: 1 },
      { id: 2 },
    ];

    repository.findAll.mockResolvedValue(reservations);

    const result = await bridge.findAll();

    expect(result).toEqual(reservations);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  test("deve delegar consulta por ID", async () => {
    repository.findById.mockResolvedValue({
      id: 1,
    });

    const result = await bridge.findById(1);

    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1 });
  });

  test("deve delegar busca por usuário", async () => {
    repository.findByUserId.mockResolvedValue([
      { id: 1, userId: 5 },
    ]);

    const result = await bridge.findByUserId(5);

    expect(repository.findByUserId)
      .toHaveBeenCalledWith(5);

    expect(result).toHaveLength(1);
  });

  test("deve delegar verificação de conflito", async () => {
    const data = {
      roomId: 2,
      startDate: new Date("2030-10-10T10:00:00Z"),
      endDate: new Date("2030-10-10T11:00:00Z"),
    };

    repository.findConflictingReservation
      .mockResolvedValue(null);

    const result =
      await bridge.findConflictingReservation(data);

    expect(repository.findConflictingReservation)
      .toHaveBeenCalledWith(data);

    expect(result).toBeNull();
  });

  test("deve propagar erros do repositório", async () => {
    repository.findAll.mockRejectedValue(
      new Error("Erro ao consultar reservas")
    );

    await expect(bridge.findAll()).rejects.toThrow(
      "Erro ao consultar reservas"
    );
  });
});
