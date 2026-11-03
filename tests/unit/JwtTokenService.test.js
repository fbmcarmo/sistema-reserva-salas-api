
const jwt = require("jsonwebtoken");

const JwtTokenService = require(
    "../../src/shared/security/JwtTokenService"
);

jest.mock("jsonwebtoken");

describe("JwtTokenService", () => {
    let jwtTokenService;

    const originalSecret = process.env.JWT_SECRET;
    const originalExpiresIn = process.env.JWT_EXPIRES_IN;

    beforeEach(() => {
        jest.clearAllMocks();

        process.env.JWT_SECRET = "secret-test";
        process.env.JWT_EXPIRES_IN = "2h";

        jwtTokenService = new JwtTokenService();
    });

    afterAll(() => {
        if (originalSecret === undefined) {
            delete process.env.JWT_SECRET;
        } else {
            process.env.JWT_SECRET = originalSecret;
        }

        if (originalExpiresIn === undefined) {
            delete process.env.JWT_EXPIRES_IN;
        } else {
            process.env.JWT_EXPIRES_IN = originalExpiresIn;
        }
    });

    describe("generate", () => {
        test("deve gerar token JWT", () => {
            const payload = {
                userId: 1,
                role: "USER",
            };

            jwt.sign.mockReturnValue("token-gerado");

            const token = jwtTokenService.generate(payload);

            expect(jwt.sign).toHaveBeenCalledWith(
                payload,
                "secret-test",
                { expiresIn: "2h" }
            );

            expect(token).toBe("token-gerado");
        });

        test("deve utilizar expiração padrão de 1 dia", () => {
            delete process.env.JWT_EXPIRES_IN;

            jwt.sign.mockReturnValue("token-padrao");

            jwtTokenService.generate({ userId: 1 });

            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: 1 },
                "secret-test",
                { expiresIn: "1d" }
            );
        });

        test("deve propagar erro de geração", () => {
            jwt.sign.mockImplementation(() => {
                throw new Error("Erro ao gerar token");
            });

            expect(() => {
                jwtTokenService.generate({ userId: 1 });
            }).toThrow("Erro ao gerar token");
        });
    });

    describe("verify", () => {
        test("deve validar token JWT", () => {
            const decoded = {
                userId: 1,
                role: "ADMIN",
            };

            jwt.verify.mockReturnValue(decoded);

            const result = jwtTokenService.verify("token-valido");

            expect(jwt.verify).toHaveBeenCalledWith(
                "token-valido",
                "secret-test"
            );

            expect(result).toEqual(decoded);
        });

        test("deve propagar erro de token inválido", () => {
            const error = new Error("jwt malformed");
            error.name = "JsonWebTokenError";

            jwt.verify.mockImplementation(() => {
                throw error;
            });

            expect(() => {
                jwtTokenService.verify("token-invalido");
            }).toThrow("jwt malformed");
        });

        test("deve propagar erro de token expirado", () => {
            const error = new Error("jwt expired");
            error.name = "TokenExpiredError";

            jwt.verify.mockImplementation(() => {
                throw error;
            });

            expect(() => {
                jwtTokenService.verify("token-expirado");
            }).toThrow("jwt expired");
        });
    });
});
