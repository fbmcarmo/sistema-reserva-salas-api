import { ReservationValidator } from '../../src/modules/reservations/validators/ReservationValidator.js';

describe('ReservationValidator', () => {
  let reservationValidator;

  beforeEach(() => {
    reservationValidator = new ReservationValidator();
  });

  test('deve aceitar dados válidos', () => {
    // Arrange: preparar os dados válidos.
    // Act: chamar o método real de validação.
    // Assert: verificar o resultado esperado.
  });

  test('deve rejeitar dados inválidos', () => {
    // Arrange: preparar dados inválidos.
    // Act e Assert: verificar a rejeição esperada.
  });
});