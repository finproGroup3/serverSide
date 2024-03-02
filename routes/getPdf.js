const express = require('express');
const router = express.Router();
const path = require('path');

// Endpoint to serve the PDF file
app.get('/pdf/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', 'invoices', filename);
    res.sendFile(filePath);
});

// Other routes and server setup...

module.exports = router;