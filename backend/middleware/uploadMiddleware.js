import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'pdf') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for book content'), false);
    }
  } else if (file.fieldname === 'coverImage') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for cover'), false);
    }
  } else {
    cb(new Error(`Unexpected field: ${file.fieldname}`), false);
  }
};

// Multer instance
const upload = multer({
  storage,
  limits: { 
    fileSize: 20 * 1024 * 1024, // 20MB per file
    files: 2 // Maximum of 2 files (PDF + cover image)
  },
  fileFilter,
});

// Middleware for multiple files
export const uploadFiles = (req, res, next) => {

  
  const uploadMiddleware = upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]);

  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error('File upload error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size should be less than 20MB' });
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ 
          message: 'Unexpected file field', 
          expected: ['pdf', 'coverImage'],
          received: Object.keys(req.files || {})
        });
      } else if (err.message) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: 'File upload failed', error: err });
    }
    
    // Log the uploaded files for debugging
    if (req.files) {
      Object.entries(req.files).forEach(([field, files]) => {
        files.forEach(file => {
          console.log(`- ${field}: ${file.originalname} (${file.mimetype}, ${file.size} bytes)`);
        });
      });
    } else {
      console.warn('No files were uploaded');
    }
    
    next();
  });
};
