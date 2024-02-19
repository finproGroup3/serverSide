const jwt = require('jsonwebtoken');

function authorize(req, res, next) {
    // Get the token from the request header
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    token = token.slice(7);
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userRole = decoded.role;
        next(); // Call next middleware
    });
}

module.exports = authorize;
