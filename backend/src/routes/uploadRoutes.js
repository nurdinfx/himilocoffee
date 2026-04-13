const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Convert buffer to Base64
        const b64 = req.file.buffer.toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        res.json({
            message: 'Image processed successfully',
            url: dataURI
        });
    } catch (error) {
        console.error('Processing Error:', error);
        res.status(500).json({ message: 'Processing failed', error: error.message });
    }
});

module.exports = router;
