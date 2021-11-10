const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "tesproduk13@gmail.com",
        pass: "wzyosyhlycnhyekb",
    },
    tls: {
        rejectUnauthorized: false,
    },
})

module.exports = transporter;