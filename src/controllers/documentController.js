const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Check if 'uploads' directory exists, if not create it
const UPLOADS_DIR = 'uploads';
if (!fs.existsSync(UPLOADS_DIR)){
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the 'uploads' folder exists before setting it as the destination
    cb(null, UPLOADS_DIR); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only documents are allowed'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const uploadDocument = (req, res) => {
  upload.single('document')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a document' });
    }

    res.status(200).json({
      message: 'Document uploaded successfully',
      file: req.file,
      path: path.join(__dirname, req.file.path),
    });
  });
};

module.exports = { uploadDocument };
