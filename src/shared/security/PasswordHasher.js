const bcrypt = require("bcryptjs");

class PasswordHasher {
    constructor(rounds = 12) {
        this.rounds = rounds;
    }

    async hash(plainPassword) {
        return bcrypt.hash(plainPassword, this.rounds);
    }

    async compare(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = PasswordHasher;