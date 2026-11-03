
const UserBuilder = require(
    "../../src/modules/users/builders/UserBuilder"
);

describe("UserBuilder", () => {
    let builder;

    beforeEach(() => {
        builder = new UserBuilder();
    });

    test("deve construir usuário com todos os campos", () => {
        const user = builder
            .setName("Bruno Moreira")
            .setEmail("bruno@email.com")
            .setPassword("senha-hash")
            .setRole("USER")
            .build();

        expect(user).toEqual({
            name: "Bruno Moreira",
            email: "bruno@email.com",
            password: "senha-hash",
            role: "USER",
        });
    });

    test("deve permitir encadeamento dos métodos", () => {
        expect(builder.setName("Bruno")).toBe(builder);
        expect(builder.setEmail("bruno@email.com")).toBe(builder);
        expect(builder.setPassword("senha-hash")).toBe(builder);
        expect(builder.setRole("USER")).toBe(builder);
    });

    test("deve construir usuário com campos parciais", () => {
        const user = builder
            .setName("Bruno")
            .setEmail("bruno@email.com")
            .build();

        expect(user).toEqual({
            name: "Bruno",
            email: "bruno@email.com",
        });
    });

    test("deve retornar objeto independente do estado interno", () => {
        builder.setName("Bruno");

        const firstUser = builder.build();

        builder.setName("Outro Nome");

        const secondUser = builder.build();

        expect(firstUser.name).toBe("Bruno");
        expect(secondUser.name).toBe("Outro Nome");
        expect(firstUser).not.toBe(secondUser);
    });

    test("deve permitir sobrescrever campos", () => {
        const user = builder
            .setRole("USER")
            .setRole("ADMIN")
            .build();

        expect(user.role).toBe("ADMIN");
    });

    test("deve iniciar com objeto vazio", () => {
        expect(builder.build()).toEqual({});
    });
});
