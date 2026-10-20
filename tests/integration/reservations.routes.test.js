
const request = require("supertest");

const appModule = require("../../src/app");

const app =
  typeof appModule === "function"
    ? appModule
    : appModule.app;

describe("Integração - Rotas de reservas", () => {
  describe("GET /api/reservations", () => {
    test("deve exigir autenticação", async () => {
      const response = await request(app)
        .get("/api/reservations");

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/reservations/my", () => {
    test("deve exigir autenticação", async () => {
      const response = await request(app)
        .get("/api/reservations/my");

      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/reservations", () => {
    test("deve impedir criação sem autenticação", async () => {
      const response = await request(app)
        .post("/api/reservations")
        .send({
          userId: 1,
          roomId: 2,
          startDate: "2030-10-10T10:00:00Z",
          endDate: "2030-10-10T11:00:00Z",
        });

      expect(response.status).toBe(401);
    });
  });
});
