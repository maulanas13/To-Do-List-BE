const express = require("express");
const router = express.Router();
const {authControllers} = require("../controllers");
const {register} = authControllers;

router.post("/register", register);
router.get("/verify", )

module.exports = router;