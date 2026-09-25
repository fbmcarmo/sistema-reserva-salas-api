const User = require('../models/User');

class SequelizeUserRepository {
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async findById(id) {
    return await User.findByPk(id);
  }

  async create(userData) {
    return await User.create(userData);
  }
}

module.exports = SequelizeUserRepository;