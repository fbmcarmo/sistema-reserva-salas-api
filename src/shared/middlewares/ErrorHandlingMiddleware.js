cat << 'EOF' > src/shared/errors/ApplicationError.js
class ApplicationError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

module.exports = ApplicationError;
EOF

cat << 'EOF' > src/shared/middlewares/ErrorHandlingMiddleware.js
const ApplicationError = require('../errors/ApplicationError');

function ErrorHandlingMiddleware(err, req, res, next) {
  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  console.error('Erro interno:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor'
  });
}

module.exports = ErrorHandlingMiddleware;
EOF