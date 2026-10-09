
import { ReservationBuilder } from '../../src/modules/reservations/builders/ReservationBuilder.js';

describe('ReservationBuilder', () => {
  let reservationBuilder;

  beforeEach(() => {
    reservationBuilder = new ReservationBuilder();
  });

  test('deve construir uma reserva com os dados informados', () => {
    // Arrange — preparar os dados
    const reservationData = {
      userId: 1,
      roomId: 2,
      startDate: '2026-10-10T10:00:00',
      endDate: '2026-10-10T11:00:00',
    };

    // Act — construir o objeto
    const reservation = reservationBuilder
      .setUserId(reservationData.userId)
      .setRoomId(reservationData.roomId)
      .setStartDate(reservationData.startDate)
      .setEndDate(reservationData.endDate)
      .build();

    // Assert — verificar o resultado
    expect(reservation).toEqual(
      expect.objectContaining(reservationData)
    );
  });
});