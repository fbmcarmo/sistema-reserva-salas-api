const express = require("express");

const AuthenticationController = require("../controllers/AuthenticationController");

const router = express.Router();
const authenticationController = new AuthenticationController();

router.post("/login", authenticationController.login);

module.exports = router;