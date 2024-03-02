const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { User, ReferralCode, Cart, Province, City } = require('../models');
const { Sequelize } = require('sequelize');


// Create a new Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'postgres',
});
// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads/profile'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = uniqueSuffix + path.extname(file.originalname);
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

const generateRandomCode = () => {
    // Function to generate a random alphanumeric code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
};

class UserController {

    static async getAll(req, res, next) {
        try {
            const users = await User.findAll();
            res.status(200).json({ status: 'success', code: 200, data: users, message: 'Users retrieved successfully' });
        } catch (error) {
            next(error);
        }
    }
    static async countAll(req, res, next) {
        try {
            // Count the total number of users in the database
            const totalUsers = await User.count();
            console.log("=================================");
            // Send the total number of users in the response
            res.status(200).json({ status: 'success', code: 200, totalUsers, message: 'Total users counted successfully' });
        } catch (error) {
            // Pass any errors to the error handling middleware
            next(error);
        }
    }


    static async getById(req, res, next) {
        try {
            // Extract the user ID from the request parameters
            const userId = req.params.id;

            // Find the user by ID in the database
            const user = await User.findByPk(userId);

            // If user is not found, send a 404 response
            if (!user) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'User not found' });
            }

            // Fetch the province and city data associated with the user
            const province = await Province.findByPk(user.provinceId);
            const city = await City.findByPk(user.cityId);

            // If province or city is not found, you may handle it accordingly

            // If user is found, send the user data along with province and city data
            res.status(200).json({ status: 'success', code: 200, data: { user, province, city }, message: 'User and associated province and city retrieved successfully' });
        } catch (error) {
            next(error); // Pass any errors to the error handling middleware
        }
    }

    static async register(req, res, next) {
        try {
            // Use multer middleware to handle form-data
            upload.single('profilePicture')(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ status: 'failed', code: 400, message: 'Error uploading file' });
                } else if (err) {
                    return res.status(500).json({ status: 'failed', code: 500, message: 'Internal server error' });
                }

                // Destructure data from body request
                const { email, password, username, cityId, provinceId, address, referralCode } = req.body;

                // Check if user with the same email already exists
                const existingUser = await User.findOne({ where: { email } });
                if (existingUser) {
                    return res.status(400).json({ status: 'failed', code: 400, message: 'User with this email already exists' });
                }

                // Check if a referral code was provided
                if (referralCode) {
                    // Find the referral code in the database
                    const existingReferralCode = await ReferralCode.findOne({ where: { code: referralCode } });
                    if (!existingReferralCode) {
                        // If referral code doesn't exist, return an error response
                        return res.status(400).json({ status: 'failed', code: 400, message: 'Invalid referral code' });
                    }
                }

                // Generate a unique referral code
                let generatedCode;
                let isCodeUnique = false;
                while (!isCodeUnique) {
                    generatedCode = generateRandomCode(); // You need to implement this function
                    const existingReferralCode = await ReferralCode.findOne({ where: { code: generatedCode } });
                    if (!existingReferralCode) {
                        isCodeUnique = true;
                    }
                }

                // Create a new referral code
                const newReferralCode = await ReferralCode.create({
                    code: generatedCode,
                    percentage: 50,
                    isActive: true
                });

                // After handling file upload with multer
                const profilePicture = req.file ? req.file.filename : null;
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
                    role: "user",
                    privateReferralCodeId: newReferralCode.id, // Associate the user with the newly created referral code
                    profilePicture,
                });

                // Create a cart for the new user
                const newCart = await Cart.create({ userId: newUser.id });

                // Check if user input a referral code
                if (referralCode) {
                    // Find the referral code in the database
                    const redeemedReferralCode = await ReferralCode.findOne({ where: { code: referralCode } });
                    if (redeemedReferralCode) {
                        // Associate the redeemed referral code with the user
                        await newUser.update({ reedemedReferralCodeId: redeemedReferralCode.id });
                    }
                }
                res.status(201).json({ status: 'success', code: 201, data: newUser, message: 'User registered successfully' });
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
            const user = await User.findOne({
                where: { email },
                include: [
                    { model: Cart },
                ]
            });

            // If user not found, send error response
            if (!user) {
                return res.status(401).json({ status: 'failed', code: 401, message: 'User not found' });
            }

            // Compare entered password with the stored password in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);

            // If password is not valid, send error response
            if (!isPasswordValid) {
                return res.status(401).json({ status: 'failed', code: 401, message: 'Password is incorrect' });
            }
            // Fetch the referral code corresponding to the privateReferralCodeId
            const privateReferralCode = await ReferralCode.findOne({
                where: { id: user.privateReferralCodeId },
                attributes: ['code'] // Include only the 'code' attribute
            });
            // Create JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email, role: 'user' },
                process.env.SECRET_KEY,
                { expiresIn: '12h' } // Set token expiration time
            );

            // Return response with user data and token
            res.status(200).json({ status: 'success', code: 200, data: { ...user.toJSON(), privateReferralCode }, token, message: 'User logged in successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async editProfile(req, res, next) {
        try {
            // Use multer middleware to handle form-data
            upload.single('profilePicture')(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ status: 'failed', code: 400, message: 'Error uploading file' });
                } else if (err) {
                    return res.status(500).json({ status: 'failed', code: 500, message: 'Internal server error' });
                }
                // Extract the user ID from the request parameters
                const userId = req.params.id;
                // Find the user by ID in the database
                const user = await User.findByPk(userId);
                // If user is not found, send a 404 response
                if (!user) {
                    return res.status(404).json({ status: 'failed', code: 404, message: 'User not found' });
                }
                // Destructure data from body request
                const { email, username, cityId, provinceId, address } = req.body;
                // After handling file upload with multer
                const profilePicture = req.file ? req.file.filename : user.profilePicture;
                // Update the user's information in the database
                const updatedData = {};
                if (email !== null && email !== undefined) {
                    updatedData.email = email; ``
                }
                if (username !== null && username !== undefined) {
                    updatedData.username = username;
                }
                if (cityId !== null && cityId !== undefined) {
                    updatedData.cityId = cityId;
                }
                if (provinceId !== null && provinceId !== undefined) {
                    updatedData.provinceId = provinceId;
                }
                if (address !== null && address !== undefined) {
                    updatedData.address = address;
                }
                if (profilePicture !== null && profilePicture !== undefined) {
                    updatedData.profilePicture = profilePicture;
                }
                await user.update(updatedData);
                // Return response indicating success
                res.status(200).json({ status: 'success', code: 200, data: user, message: 'User profile updated successfully' });
            });
        } catch (error) {
            next(error);
        }
    }


}

module.exports = UserController;
