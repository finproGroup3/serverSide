const express = require("express");
const router = express.Router();
const AdminController = require("../controller/admin_controller");
const authorize = require('../middleware/authorize');

router.get('/', authorize, (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ status: 'failed', code: 403, message: 'Forbidden: Insufficient permissions' });
    }
    return AdminController.getAll(req, res, next);
});

router.post('/register', AdminController.register);

router.post('/login', AdminController.login);

module.exports = router;