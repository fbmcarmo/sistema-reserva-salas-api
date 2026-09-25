const PasswordHashing = require('../../../shared/utils/PasswordHashing');
const ApplicationError = require('../../../shared/errors/ApplicationError');

class CreateUserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ nome, email, senha, role }) {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new ApplicationError('E-mail já cadastrado no sistema.', 400);
    }

    const hashedPassword = await PasswordHashing.hash(senha);

    const user = await this.userRepository.create({
      nome,
      email,
      senha: hashedPassword,
      role: role || 'USER',
    });

    // Ocultar a senha antes de retornar os dados
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      created_at: user.createdAt,
    };
  }
}

module.exports = CreateUserService;