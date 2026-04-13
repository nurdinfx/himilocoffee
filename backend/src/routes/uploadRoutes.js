const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const cloudinary = require('../config/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to Cloudinary using stream
        const uploadFromBuffer = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'himilo-coffee' },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                stream.end(fileBuffer);
            });
        };

        const result = await uploadFromBuffer(req.file.buffer);

        res.json({
            message: 'Image uploaded successfully',
            url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
});

module.exports = router;
