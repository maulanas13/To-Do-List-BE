const {mySqlDb} = require("../connections");

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
                password
            };

        } catch (error) {
            conn.release();
            console.log(error);
            return res.status(500).send({message: error.message || "Server error"});
        }
    }
}