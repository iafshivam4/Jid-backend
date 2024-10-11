const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dz5pujhl3', // Replace with your Cloudinary Cloud Name
  api_key: '846146539383645',       // Replace with your Cloudinary API Key
  api_secret: 'p39T9PSNh5QbXLV4QpYZ1EtQMmg'  // Replace with your Cloudinary API Secret
});

// Multer configuration
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Controller function
const uploadDocument = (req, res) => {
  upload.single('document')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Upload to Cloudinary
    if (req.file) {
      const uniqueId = uuidv4(); // Generate a unique ID for the file
      cloudinary.uploader.upload_stream({ public_id: uniqueId }, (error, result) => {
        if (error) {
          return res.status(400).json({ error: error.message });
        }

        // Return the Cloudinary URL
        res.status(200).json({
          message: 'Document uploaded successfully',
          cloudinaryUrl: result.secure_url, // Cloudinary URL for the uploaded file
        });
      }).end(req.file.buffer); // End the upload stream with the file buffer
    } else {
      return res.status(400).json({ error: 'Please upload a document' });
    }
  });
};

module.exports = { uploadDocument };
