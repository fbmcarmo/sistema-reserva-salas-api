
const RoomValidator = require(
    "../../src/modules/rooms/validators/RoomValidator"
);

describe("RoomValidator", () => {
    let validator;

    beforeEach(() => {
        validator = new RoomValidator();
    });

    describe("validateCreate", () => {
        const validRoom = {
            nome: "Sala de Reuniões",
            capacidade: 10,
            localizacao: "Bloco A",
        };

        test("deve aceitar sala válida", () => {
            expect(() => {
                validator.validateCreate(validRoom);
            }).not.toThrow();
        });

        test.each([
            ["nome", { capacidade: 10, localizacao: "Bloco A" }],
            ["capacidade", { nome: "Sala", localizacao: "Bloco A" }],
            ["localizacao", { nome: "Sala", capacidade: 10 }],
        ])(
            "deve rejeitar ausência de %s",
            (field, data) => {
                expect(() => {
                    validator.validateCreate(data);
                }).toThrow(
                    "Nome, capacidade e localização são obrigatórios."
                );
            }
        );

        test.each([
            0,
            -1,
            -10,
            1.5,
            "abc",
            "10.5",
        ])(
            "deve rejeitar capacidade inválida: %s",
            (capacidade) => {
                const data = {
                    ...validRoom,
                    capacidade,
                };

                expect(() => {
                    validator.validateCreate(data);
                }).toThrow();
            }
        );

        test("deve aceitar capacidade numérica em string", () => {
            expect(() => {
                validator.validateCreate({
                    ...validRoom,
                    capacidade: "15",
                });
            }).not.toThrow();
        });
    });

    describe("validateUpdate", () => {
        test("deve aceitar atualização sem capacidade", () => {
            expect(() => {
                validator.validateUpdate({
                    nome: "Sala Atualizada",
                });
            }).not.toThrow();
        });

        test.each([
            0,
            -1,
            1.5,
            "abc",
        ])(
            "deve rejeitar capacidade inválida: %s",
            (capacidade) => {
                expect(() => {
                    validator.validateUpdate({
                        capacidade,
                    });
                }).toThrow(
                    "A capacidade deve ser um número inteiro maior que zero."
                );
            }
        );

        test("deve aceitar capacidade válida", () => {
            expect(() => {
                validator.validateUpdate({
                    capacidade: 20,
                });
            }).not.toThrow();
        });

        test.each([
            "ATIVA",
            "INATIVA",
        ])(
            "deve aceitar status %s",
            (status) => {
                expect(() => {
                    validator.validateUpdate({
                        status,
                    });
                }).not.toThrow();
            }
        );

        test.each([
            "BLOQUEADA",
            "CANCELADA",
            "ativa",
            "",
        ])(
            "deve rejeitar status inválido: %s",
            (status) => {
                expect(() => {
                    validator.validateUpdate({
                        status,
                    });
                }).toThrow(
                    "O status deve ser ATIVA ou INATIVA."
                );
            }
        );
    });
});
