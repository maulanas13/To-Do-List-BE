const jwt = require("jsonwebtoken");

export default verifyTokenEmail = (req, res, next) => {
    jwt.verify(req.token, "tokenemailverif", (err, decode) => {
        if (err) {
            return res.status(401).send({message: "Token expired"});
        }
        req.user = decode;
        next();
    });
}