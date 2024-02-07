function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        res.status(403).send('Anda tidak memiliki izin untuk mengakses halaman ini.');
    }
}

module.exports = { isAdmin };
