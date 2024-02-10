const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Get the token from the request headers
    const token = req.headers.authorization;

    // Check if token is provided
    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }

    // Verify the token
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            // Token is invalid or expired
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Token is valid
        // Attach the decoded token payload to the request for further use
        req.user = decoded;
        next(); // Move to the next middleware or route handler
    });
};

module.exports = verifyToken;
