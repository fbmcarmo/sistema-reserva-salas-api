class ErrorHandlerMiddleware {
    handle = (error, req, res, next) => {
        const statusCode = error.statusCode || 500;

        if (statusCode === 500) {
            console.error(error);
        }

        return res.status(statusCode).json({
            message:
                statusCode === 500
                    ? "Erro interno do servidor."
                    : error.message,
        });
    };
}

module.exports = new ErrorHandlerMiddleware();