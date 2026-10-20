
const ReservationValidator = require(
  "../../src/modules/reservations/validators/ReservationValidator"
);

describe("ReservationValidator", () => {
  let validator;

  const futureDates = () => {
    const startDate = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    const endDate = new Date(
      startDate.getTime() + 60 * 60 * 1000
    );

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  };

  beforeEach(() => {
    validator = new ReservationValidator();
  });

  test("deve aceitar uma reserva válida", () => {
    const data = {
      userId: 1,
      roomId: 2,
      ...futureDates(),
    };

    expect(() => {
      validator.validateCreate(data);
    }).not.toThrow();
  });

  test("deve rejeitar usuário não informado", () => {
    const data = {
      roomId: 2,
      ...futureDates(),
    };

    expect(() => {
      validator.validateCreate(data);
    }).toThrow(
      "Usuário, sala, data de início e data de término são obrigatórios."
    );
  });

  test("deve rejeitar sala não informada", () => {
    const data = {
      userId: 1,
      ...futureDates(),
    };

    expect(() => {
      validator.validateCreate(data);
    }).toThrow();
  });

  test("deve rejeitar datas inválidas", () => {
    expect(() => {
      validator.validateCreate({
        userId: 1,
        roomId: 2,
        startDate: "data-invalida",
        endDate: "outra-data-invalida",
      });
    }).toThrow("As datas informadas são inválidas.");
  });

  test("deve rejeitar data inicial posterior à final", () => {
    const dates = futureDates();

    expect(() => {
      validator.validateCreate({
        userId: 1,
        roomId: 2,
        startDate: dates.endDate,
        endDate: dates.startDate,
      });
    }).toThrow(
      "A data de início deve ser anterior à data de término."
    );
  });

  test("deve rejeitar reservas no passado", () => {
    expect(() => {
      validator.validateCreate({
        userId: 1,
        roomId: 2,
        startDate: "2020-01-01T10:00:00Z",
        endDate: "2020-01-01T11:00:00Z",
      });
    }).toThrow(
      "Não é possível criar uma reserva para um horário passado."
    );
  });

  test("deve aceitar atualização com datas válidas", () => {
    const dates = futureDates();

    expect(() => {
      validator.validateUpdate(dates);
    }).not.toThrow();
  });
});
