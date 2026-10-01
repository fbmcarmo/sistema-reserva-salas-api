class ApplicationError extends Error {
  constructor(message, statusCode = 400, details = null) {
    super(message);
    this.name = 'ApplicationError';
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
}

module.exports = ApplicationError;