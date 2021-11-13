const jwt = require("jsonwebtoken");

module.exports = {
    createTokenAccess: (data) => {
        const key = "tokenacc";
        const token = jwt.sign(data, key, {expiresIn: "10h"});
        return token;
    },
    createTokenEmailVerified: (data) => {
        const key = "tokenemailverif";
        const token = jwt.sign(data, key, {expiresIn: "3m"});
        return token;
    }
}