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
