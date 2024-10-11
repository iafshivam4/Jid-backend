const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dz5pujhl3',  // Replace with your Cloudinary Cloud Name
  api_key: '846146539383645',        // Replace with your Cloudinary API Key
  api_secret: 'p39T9PSNh5QbXLV4QpYZ1EtQMmg'   // Replace with your Cloudinary API Secret
});

// Set up Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Cloudinary folder name (optional)
    format: async (req, file) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (['.png', '.pdf', '.doc', '.docx', '.txt'].includes(ext)) {
        return ext.slice(1); // Return file format (png, pdf, etc.)
      }
      throw new Error('Invalid file format'); // Reject unsupported file types
    },
    public_id: (req, file) => {
      return Date.now() + path.extname(file.originalname); // Use timestamp as the public_id
    },
  },
});

// File Filter (Allow only certain file types)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true); // Allow file upload
  } else {
    cb(new Error('Only PDF, DOC, DOCX, TXT, and PNG files are allowed'), false); // Reject the file
  }
};

// Multer Upload Middleware using Cloudinary Storage
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Controller Function to Upload Document to Cloudinary
const uploadDocument = (req, res) => {
  upload.single('document')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Other errors
      return res.status(400).json({ error: err.message });
    }

    // Check if the file was uploaded successfully
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a document' });
    }

    // Success Response (Cloudinary file URL)
    res.status(200).json({
      message: 'Document uploaded successfully',
      cloudinaryUrl: req.file.path, // Cloudinary URL for the uploaded file
    });
  });
};

module.exports = { uploadDocument };
