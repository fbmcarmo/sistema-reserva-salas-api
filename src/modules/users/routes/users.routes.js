const express = require("express");

const UserController = require("../controllers/UserController");
const authMiddleware = require("../../../shared/middlewares/AuthMiddleware");
const authorizationMiddleware = require(
    "../../../shared/middlewares/AuthorizationMiddleware"
);

const router = express.Router();
const userController = new UserController();

router.post("/register", userController.register);

// A partir daqui, as rotas exigem autenticação.
router.use(authMiddleware.authenticate);

// Somente ADMIN pode listar todos os usuários.
router.get(
    "/",
    authorizationMiddleware.allowRoles("ADMIN"),
    userController.findAll
);

// ADMIN pode consultar qualquer usuário.
// USER pode consultar apenas o próprio cadastro.
router.get(
    "/:id",
    (req, res, next) => {
        const isAdmin = req.auth.role === "ADMIN";
        const isOwnAccount = String(req.auth.userId) === String(req.params.id);

        if (!isAdmin && !isOwnAccount) {
            return res.status(403).json({
                message: "Você não tem permissão para consultar este usuário.",
            });
        }

        return next();
    },
    userController.findById
);

module.exports = router;