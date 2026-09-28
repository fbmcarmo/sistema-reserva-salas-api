const jwt = require("jsonwebtoken");

class AuthMiddleware {

    authenticate = (req, res, next) => {

        const token =
            req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                message: "Token não informado.",
            });
        }

        try {

            const decoded =
                jwt.verify(token, process.env.JWT_SECRET);

            req.user = decoded;

            next();

        } catch (error) {

            return res.status(401).json({
                message: "Token inválido.",
            });
        }
    };
}

module.exports = new AuthMiddleware();