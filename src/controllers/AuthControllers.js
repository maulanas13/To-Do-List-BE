const {mySqlDb} = require("../connections");
const { hashPass } = require("../helpers");
const { createTokenEmailVerified, createTokenAccess } = require("../helpers/CreateToken");

module.exports = {
    register: async (req, res) => {
        const {email, username, password} = req.body;
        const conn = await mySqlDb.promise().getConnection();
        try {
            // Cek username sudah terdaftar/belum
            let sql = "SELECT * FROM user WHERE username ?";
            const [dataUser] = await conn.query(sql, [username]);
            if (dataUser.length) {
                throw {message: "Username sudah terdaftar"}
            }
            sql = "INSERT INTO user SET ?"
            let dataInsert = {
                email,
                username,
                password: hashPass(password)
            };
            const [result] = await conn.query(sql, [dataInsert]);
            console.log("Ini result: ", result);

            // Get data user terdaftar utk dimasukan token
            sql = "SELECT id, username, email, is_verified, role_id FROM user WHERE id = ?";
            const [userData] = await conn.query(sql, [result.insertId]);
            console.log("Ini userData: ", userData);
            console.log("Ini result.insertId: ", result.insertId);
            const dataToken = {
                id: userData[0].id,
                username: userData[0].username,
                role_id: userData[0].role.id,
            };
            conn.release();
            const emailToken = createTokenEmailVerified(dataToken);
            const accessToken = createTokenAccess(dataToken);
        } catch (error) {
            conn.release();
            console.log(error);
            return res.status(500).send({message: error.message || "Server error"});
        }
    }
}