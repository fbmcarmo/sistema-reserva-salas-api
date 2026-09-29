const { User } = require("../../../shared/database/models");

class UserRepository {
    async create(userData) {
        return User.create(userData);
    }

    async findById(id) {
        return User.findByPk(id);
    }

    async findByEmail(email) {
        return User.findOne({
            where: { email },
        });
    }

    async findAll() {
        return User.findAll({
            attributes: {
                exclude: ["password"],
            },
            order: [["id", "ASC"]],
        });
    }
}

module.exports = UserRepository;