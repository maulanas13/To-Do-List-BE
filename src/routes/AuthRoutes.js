const express = require("express");
const router = express.Router();
const { verifyToken, verifyEmailToken } = require("./../helpers");
const { authControllers } = require("./../controllers");
const { verifyTokenAccess } = verifyToken;

const { login, keeplogin, register, verifyRegister } = authControllers;

router.post("/login", login);
router.get("/keeplogin", verifyTokenAccess, keeplogin);
router.post("/register", register);
router.get("/verify", verifyEmailToken, verifyRegister);

module.exports = router;
