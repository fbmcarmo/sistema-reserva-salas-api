const SequelizeUserRepository = require('../repositories/SequelizeUserRepository');
const CreateUserService = require('../services/CreateUserService');

class UserController {
  async create(req, res, next) {
    try {
      const { nome, email, senha, role } = req.body;

      const userRepository = new SequelizeUserRepository();
      const createUserService = new CreateUserService(userRepository);

      const user = await createUserService.execute({ nome, email, senha, role });

      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();