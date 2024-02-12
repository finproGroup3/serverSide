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
            const { email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const newAdmin = await Admin.create({
                email,
                password: hashedPassword
            });

            res.status(201).json({ status: 'success', code: 201, data: newAdmin, message: 'Admin registered successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const admin = await Admin.findOne({ where: { email } });

            if (!admin) {
                return res.status(401).json({ status: 'error', code: 401, message: 'Incorrect email or password' });
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password);

            if (!isPasswordValid) {
                return res.status(401).json({ status: 'error', code: 401, message: 'Incorrect email or password' });
            }

            const token = jwt.sign(
                { adminId: admin.id, email: admin.email },
                'your-secret-key',
                { expiresIn: '1h' }
            );

            res.status(200).json({ status: 'success', code: 200, data: { token }, message: 'Login successful' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AdminController;
