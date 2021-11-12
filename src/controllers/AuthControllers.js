const {mySqlDb} = require("../connections");
const { hashPass, createToken, transporter } = require("../helpers");
const { createTokenEmailVerified, createTokenAccess } = createToken;
const handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");

module.exports = {
    register: async (req, res) => {
        const {email, username, password} = req.body;
        const conn = await mySqlDb.promise().getConnection();
        try {
            // Cek email & username sudah terdaftar/belum
            let sql = "SELECT id FROM user WHERE email = ?";
            const [dataUser01] = await conn.query(sql, email);
            sql = "SELECT id FROM user WHERE username = ?";
            const [dataUser02] = await conn.query(sql, username);

            if (dataUser01.length || dataUser02.length) {
                if (dataUser01.length && dataUser02.length) {
                    conn.release();
                    console.log("Email & Username sudah terdaftar")
                    return res.send({messageId: 1, message: "Email & Username sudah terdaftar"});
                }

                // Cek email sudah terdaftar/belum
                else if (dataUser01.length) {
                    conn.release();
                    console.log("Email sudah terdaftar")
                    return res.send({messageId: 2, message: "Email sudah terdaftar"});
                }

                // Cek username sudah terdaftar/belum
                else {
                    conn.release();
                    console.log("Username sudah terdaftar")
                    return res.send({messageId: 3, message: "Username sudah terdaftar"});
                } 
            }

            // Masukin data regis user ke SQL
            sql = "INSERT INTO user SET ?"
            let dataInsert = {
                email,
                username,
                password: hashPass(password),
            };
            const [result] = await conn.query(sql, [dataInsert]);
            console.log("Ini result: ", result);

            // Get data user terdaftar utk dimasukan token
            sql = "SELECT id, username, email, is_verified, role_id FROM user WHERE id = ?";
            const [userData] = await conn.query(sql, [result.insertId]); // Pake insertId karena unique (insertId = id)
            console.log("Ini userData: ", userData);
            console.log("Ini result.insertId: ", result.insertId);
            const dataToken = {
                id: userData[0].id,
                username: userData[0].username,
                role_id: userData[0].role_id,
            };

            // Utk melepaskan koneksi dari pool, kemudian lanjut dgn kirim email verifikasi
            conn.release();

            // Bikin token email verifikasi & token akses
            const emailToken = createTokenEmailVerified(dataToken);
            const accessToken = createTokenAccess(dataToken);

            // Ambil template email verifikasi & kirim
            let filepath = path.resolve(__dirname, "../template/VerifikasiEmail.html");
            let htmlString = fs.readFileSync(filepath, "utf-8");
            const template = handlebars.compile(htmlString);
            const htmlToEmail = template({
                name: username,
                token: emailToken,
            });
            transporter.sendMail({
                from: "Admin <tesproduk13@gmail.com>",
                to: email,
                subject: "Registration Verification Email",
                html: htmlToEmail,
            });

            // Simpan token pada header
            res.set("x-token-access", accessToken);
            return res.status(200).send({...userData[0]});
        } catch (error) {
            conn.release();
            console.log(error);
            return res.status(500).send({message: error.message || "Server error"});
        };
    }
}