const ApplicationError = require('../errors/ApplicationError');

function ErrorHandlingMiddleware(err, req, res, next) {
  // 1. Erros conhecidos da regra de negócio (ApplicationError)
  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(err.details && { errors: err.details }),
    });
  }

  // 2. Erros de validação de modelo do Sequelize
  if (err.name === 'SequelizeValidationError') {
    const validationErrors = err.errors.map((error) => ({
      campo: error.path,
      mensagem: error.message,
    }));

    return res.status(400).json({
      status: 'error',
      message: 'Falha na validação dos dados enviados.',
      errors: validationErrors,
    });
  }

  // 3. Erro de violação de registro único no banco (Unique Constraint)
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      status: 'error',
      message: 'Já existe um registro com os dados informados.',
    });
  }

  // 4. Erro de sintaxe no JSON recebido
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      status: 'error',
      message: 'JSON malformado no corpo da requisição.',
    });
  }

  // 5. Erros não mapeados ou internos do servidor (500)
  console.error('[ERRO NÃO TRATADO]:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Erro interno no servidor. Tente novamente mais tarde.',
  });
}

module.exports = ErrorHandlingMiddleware;