import express from 'express';
import {
  addBook,
  updateBook,
  deleteBook,
  getBooks,
  getBookById,
  getBooksByUser
} from '../controllers/bookController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { uploadFiles } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Routes
router.post('/', verifyToken, uploadFiles, addBook);
router.get('/',verifyToken, getBooks);
router.get('/:id',verifyToken, getBookById);
router.get('/user/books',verifyToken, getBooksByUser);
router.put('/:id',verifyToken, updateBook);
router.delete('/:id',verifyToken, deleteBook);

export default router;
