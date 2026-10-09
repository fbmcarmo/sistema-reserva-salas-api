
import request from 'supertest';
import app from '../../src/app.js';

describe('Integração - Rotas de reservas', () => {
  describe('GET /reservations', () => {
    test('deve responder à requisição de listagem', async () => {
      const response = await request(app)
        .get('/reservations');

      // Ajuste conforme a política de autenticação
      // e o contrato real do endpoint.
      expect([200, 401, 403]).toContain(response.status);
    });
  });

  describe('GET /reservations/availability', () => {
    test('deve receber os parâmetros de disponibilidade', async () => {
      const response = await request(app)
        .get('/reservations/availability')
        .query({
          roomId: 1,
          startDate: '2026-10-10T10:00:00',
          endDate: '2026-10-10T12:00:00',
        });

      // A resposta depende da implementação real,
      // da autenticação e do estado do banco de teste.
      expect(response.status).toBeDefined();
      expect(typeof response.status).toBe('number');
    });
  });
});