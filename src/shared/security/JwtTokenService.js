const jwt = require("jsonwebtoken");

class JwtTokenService {

    generate(payload) {
        return jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn:
                    process.env.JWT_EXPIRES_IN || "1d",
            }
        );
    }

    verify(token) {
        return jwt.verify(
            token,
            process.env.JWT_SECRET
        );
    }
}

module.exports = JwtTokenService;

