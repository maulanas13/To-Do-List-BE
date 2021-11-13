const express = require("express");
const router = express.Router();
const {authControllers} = require("../controllers");
const { verifyEmailToken } = require("../helpers");
const {register, verifyRegister} = authControllers;

router.post("/register", register);
router.get("/verify", verifyEmailToken, verifyRegister);

module.exports = router;