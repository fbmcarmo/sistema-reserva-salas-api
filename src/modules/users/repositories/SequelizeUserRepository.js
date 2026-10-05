const {
    User,
} = require("../../../shared/database/models");

class SequelizeUserRepository {
    async create(userData) {
        return User.create(userData);
    }

    async findAll() {
        return User.findAll({
            attributes: {
                exclude: ["password"],
            },
            order: [["id", "ASC"]],
        });
    }

    async findById(id) {
        return User.findByPk(id, {
            attributes: {
                exclude: ["password"],
            },
        });
    }

    async findByEmail(email) {
        return User.findOne({
            where: {
                email,
            },
        });
    }

    async update(id, userData) {
        const user = await User.findByPk(id);

        if (!user) {
            return null;
        }

        await user.update(userData);

        return User.findByPk(id, {
            attributes: {
                exclude: ["password"],
            },
        });
    }

    async delete(id) {
        const user = await User.findByPk(id);

        if (!user) {
            return null;
        }

        await user.destroy();

        return user;
    }
}

module.exports = SequelizeUserRepository;