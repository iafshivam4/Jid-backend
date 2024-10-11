const multer = require('multer');
const axios = require('axios'); // Axios for making API requests
const FormData = require('form-data'); // For handling form data
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

// Uploadcare public key
const UPLOADCARE_PUBLIC_KEY = '85d1828bd8ce18834b32';
const UPLOADCARE_SECRET_KEY = '03fd27415fab3de139f5';

// Multer configuration for storing files in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Function to upload PDF to Uploadcare
const uploadToUploadcare = async (fileBuffer, fileName) => {
  const form = new FormData();
  form.append('UPLOADCARE_PUB_KEY', UPLOADCARE_PUBLIC_KEY); // Public key
  form.append('UPLOADCARE_STORE', 'auto'); // Auto store the file
  form.append('file', fileBuffer, fileName); // Add file buffer

  try {
    // Make the API request to Uploadcare
    const response = await axios.post('https://upload.uploadcare.com/base/', form, {
      headers: form.getHeaders(),
    });
    return response.data; // Return the Uploadcare response
  } catch (error) {
    throw new Error(`Uploadcare Error: ${error.response.data}`);
  }
};

// Controller function
const uploadDocument = (req, res) => {
  upload.single('document')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Check if the uploaded file is a PDF
    if (req.file && req.file.mimetype === 'application/pdf') {
      const uniqueId = uuidv4(); // Generate a unique ID for the file
      const fileName = `${uniqueId}.pdf`;

      try {
        // Upload the file to Uploadcare
        const fileInfo = await uploadToUploadcare(req.file.buffer, fileName);

        // Return the Uploadcare URL with .pdf extension
        res.status(200).json({
          message: 'Document uploaded successfully',
          path: `https://ucarecdn.com/${fileInfo.file}/`, // Uploadcare URL for the uploaded file
        });
      } catch (uploadError) {
        return res.status(400).json({ error: uploadError.message });
      }
    } else {
      return res.status(400).json({ error: 'Please upload a PDF document' });
    }
  });
};

module.exports = { uploadDocument };
