
const bcrypt = require("bcryptjs");

const PasswordHasher = require(
    "../../src/shared/security/PasswordHasher"
);

describe("PasswordHasher", () => {
    let passwordHasher;

    beforeEach(() => {
        passwordHasher = new PasswordHasher(4);
    });

    test("deve utilizar 12 rounds por padrão", () => {
        const hasher = new PasswordHasher();

        expect(hasher.rounds).toBe(12);
    });

    test("deve permitir configurar rounds", () => {
        expect(passwordHasher.rounds).toBe(4);
    });

    test("deve gerar hash diferente da senha original", async () => {
        const password = "senhaSegura123";

        const hash = await passwordHasher.hash(password);

        expect(hash).toBeDefined();
        expect(hash).not.toBe(password);
        expect(typeof hash).toBe("string");
        expect(hash).toMatch(/^\$2[aby]\$/);
    });

    test("deve validar senha correta", async () => {
        const password = "senhaSegura123";

        const hash = await passwordHasher.hash(password);

        const result = await passwordHasher.compare(
            password,
            hash
        );

        expect(result).toBe(true);
    });

    test("deve rejeitar senha incorreta", async () => {
        const hash = await passwordHasher.hash(
            "senhaCorreta123"
        );

        const result = await passwordHasher.compare(
            "senhaErrada123",
            hash
        );

        expect(result).toBe(false);
    });

    test("deve produzir hashes diferentes para a mesma senha", async () => {
        const firstHash = await passwordHasher.hash(
            "senhaSegura123"
        );

        const secondHash = await passwordHasher.hash(
            "senhaSegura123"
        );

        expect(firstHash).not.toBe(secondHash);

        expect(
            await bcrypt.compare("senhaSegura123", firstHash)
        ).toBe(true);

        expect(
            await bcrypt.compare("senhaSegura123", secondHash)
        ).toBe(true);
    });
});
