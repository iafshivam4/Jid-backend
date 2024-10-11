const path = require('path');
const multer = require('multer');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx', '.txt','.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only documents are allowed'), false);
  }
};


const upload = multer({ storage: storage, fileFilter: fileFilter });


const uploadDocument = (req, res) => {
  console.log(__dirname);
  upload.single('document')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      
      return res.status(400).json({ error: err.message });
    } else if (err) {
      
      return res.status(400).json({ error: err.message });
    }
    
    // Successfully uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a document' });
    }

    res.status(200).json({
      message: 'Document uploaded successfully',
      file: req.file,
      path:path.join(__dirname,req.file.path),
    });
  });

  
 
};

module.exports = { uploadDocument };