<<<<<<< HEAD
// adminController.js

// Import model yang diperlukan
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Controller untuk login admin
const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Temukan admin berdasarkan username
        const admin = await Admin.findOne({ where: { username } });

        // Jika admin tidak ditemukan atau password tidak sesuai, kirim respons error
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ message: 'Username atau password tidak valid.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin.id, username: admin.username }, 'secret_key');

        res.status(200).json({ admin, token });
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat proses login admin.' });
    }
};

// Controller untuk mendapatkan list products, orders, dan promo
const getListData = async (req, res) => {
    try {
        // Dapatkan data products, orders, dan promo dari database
        const products = []; // Ambil data products dari database
        const orders = []; // Ambil data orders dari database
        const promo = []; // Ambil data promo dari database

        res.status(200).json({ products, orders, promo });
    } catch (error) {
        console.error('Error fetching list data:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil list data.' });
    }
};

// Ekspor controller yang diperlukan
module.exports = {
    loginAdmin,
    getListData
};
=======
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
            const { email, password } = req.body;

            // Hash password menggunakan bcrypt
            const hashedPassword = await bcrypt.hash(password, 10);

            // Buat user baru
            const newUser = await User.create({
                email,
                password: hashedPassword
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
                'your-secret-key', 
                { expiresIn: '1h' } // Atur waktu kedaluwarsa token
            );

            res.status(200).json({ token });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;
>>>>>>> b4bee17fda160ed38765b554b591fa083495cc5c
