const express = require('express');
const router = express.Router();
const path = require('path');

// Define a route to serve images
router.get('/:folderImage/:imageName', (req, res) => {
    const folderImage = req.params.folderImage;
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, '..', 'uploads', folderImage, imageName); // Adjust the path to match your directory structure

    // Send the image file in the response
    res.sendFile(imagePath);
});


module.exports = router;
