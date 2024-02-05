const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { User } = require('../models');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        cb(null, filename);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB file size limit
    },
});

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
            // Use multer middleware to handle form-data
            upload.single('profilePicture')(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ message: 'Error uploading file' });
                } else if (err) {
                    return res.status(500).json({ message: 'Internal server error' });
                }

                // Destructure data from body request
                const { email, password, username, cityId, provinceId, address, role, reedemedReferralCodeId } = req.body;

                // Check if user with the same email already exists
                const existingUser = await User.findOne({ where: { email } });
                if (existingUser) {
                    return res.status(400).json({ message: 'User with this email already exists' });
                }

                // Access the uploaded file, if any
                const profilePicture = req.file ? req.file.filename : null;
                console.log('Profile Picture Filename:', profilePicture);
                // Hash password using bcrypt
                const hashedPassword = await bcrypt.hash(password, 10);
                // Create a new user
                const newUser = await User.create({
                    email,
                    password: hashedPassword,
                    username,
                    cityId,
                    provinceId,
                    address,
                    role,
                    reedemedReferralCodeId,
                    profilePicture,
                });

                res.status(201).json(newUser);
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            // Destructure email and password from body request
            const { email, password } = req.body;

            // Find user based on email
            const user = await User.findOne({ where: { email } });

            // If user not found, send error response
            if (!user) {
                return res.status(401).json({ message: 'Email or password is incorrect' });
            }

            // Compare entered password with the stored password in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);

            // If password is not valid, send error response
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Email or password is incorrect' });
            }

            // Create JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                'your-secret-key', // Replace with a secure secret key
                { expiresIn: '1h' } // Set token expiration time
            );

            res.status(200).json({ token });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;
