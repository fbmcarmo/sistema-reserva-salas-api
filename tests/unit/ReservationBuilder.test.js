
const ReservationBuilder = require(
  "../../src/modules/reservations/builders/ReservationBuilder"
);

describe("ReservationBuilder", () => {
  let builder;

  beforeEach(() => {
    builder = new ReservationBuilder();
  });

  test("deve construir uma reserva completa", () => {
    const startDate = new Date("2030-10-10T10:00:00Z");
    const endDate = new Date("2030-10-10T11:00:00Z");

    const reservation = builder
      .setUserId(1)
      .setRoomId(2)
      .setStartDate(startDate)
      .setEndDate(endDate)
      .setStatus("CONFIRMADA")
      .build();

    expect(reservation).toEqual({
      userId: 1,
      roomId: 2,
      startDate,
      endDate,
      status: "CONFIRMADA",
    });
  });

  test("deve permitir encadeamento de métodos", () => {
    expect(builder.setUserId(1)).toBe(builder);
    expect(builder.setRoomId(2)).toBe(builder);
    expect(builder.setStatus("CONFIRMADA")).toBe(builder);
  });

  test("deve retornar um objeto independente", () => {
    builder.setUserId(1);

    const reservation = builder.build();

    reservation.userId = 99;

    expect(builder.build().userId).toBe(1);
  });
});
