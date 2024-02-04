const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require("../models");

class UserController {
    static async getAll(req, res, next) {
        try {
            const users = await User.findAll();
            res.status(200).json(users);
        } catch (error) {
            next(error); 
        }
    }

    static async register(req, res, next) {
        try {
            // Destructure data dari body request
            const { email, password, username, cityId, provinceId, address, role } = req.body;

            // Hash password menggunakan bcrypt
            const hashedPassword = await bcrypt.hash(password, 10);

            // Buat user baru
            const newUser = await User.create({
                email,
                password: hashedPassword,
                username,
                cityId,
                provinceId,
                address,
                role
            });

            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            // Destructure email dan password dari body request
            const { email, password } = req.body;

            // Cari user berdasarkan email
            const user = await User.findOne({ where: { email } });

            // Jika user tidak ditemukan, kirim respon error
            if (!user) {
                return res.status(401).json({ message: 'Email atau password salah' });
            }

            // Bandingkan password yang dimasukkan dengan password yang tersimpan di database
            const isPasswordValid = await bcrypt.compare(password, user.password);

            // Jika password tidak valid, kirim respon error
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Email atau password salah' });
            }

            // Buat token JWT
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                'your-secret-key', // Ganti dengan secret key yang aman
                { expiresIn: '1h' } // Atur waktu kedaluwarsa token
            );

            res.status(200).json({ token });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;
