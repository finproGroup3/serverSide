const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Admin } = require("../models");

class AdminController {
    static async getAll(req, res, next) {
        try {
            const admins = await Admin.findAll();
            res.status(200).json({ status: 'success', code: 200, data: admins, message: 'Admins retrieved successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async register(req, res, next) {
        try {
            const { username, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const newAdmin = await Admin.create({
                username,
                password: hashedPassword
            });

            res.status(201).json({ status: 'success', code: 201, data: newAdmin, message: 'Admin registered successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const admin = await Admin.findOne({ where: { username } });

            if (!admin) {
                return res.status(401).json({ status: 'error', code: 401, message: 'Incorrect username or password' });
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password);

            if (!isPasswordValid) {
                return res.status(401).json({ status: 'error', code: 401, message: 'Incorrect username or password' });
            }

            // Generate JWT token with admin's ID, username, and role
            const token = jwt.sign(
                { adminId: admin.id, username: admin.username, role: 'admin' }, 
                process.env.SECRET_KEY,
                { expiresIn: '12h' }
            );

            res.status(200).json({ status: 'success', code: 200, data: { token }, message: 'Login successful' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AdminController;
