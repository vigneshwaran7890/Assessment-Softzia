import Book from '../models/bookModel.js'; // adjust path as needed
import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

// Add a new book with PDF and cover image upload
export const addBook = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { title, genre, price, description } = req.body;
    if (!title || !genre || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!req.files?.pdf?.[0]?.path || !req.files?.coverImage?.[0]?.path) {
      return res
        .status(400)
        .json({ message: "PDF and cover image are required" });
    }

    // Upload to Cloudinary
    const [pdfResult, coverResult] = await Promise.all([
      cloudinary.uploader.upload(req.files.pdf[0].path, {
        resource_type: "auto",
        folder: "books/pdf",
      }),
      cloudinary.uploader.upload(req.files.coverImage[0].path, {
        folder: "books/covers",
        resource_type: "image",
        format: "png",
        quality: "auto:good",
      }),
    ]);

    // Save to DB
    const book = new Book({
      title: title.trim(),
      genre: genre.trim(),
      price: parseFloat(price),
      description: description?.trim() || "",
      pdfUrl: pdfResult.secure_url,
      coverImage: coverResult.secure_url,
      createdBy: userId,
      status: "Published",
    });

    const savedBook = await book.save();

    // Remove local temp files
    fs.unlinkSync(req.files.pdf[0].path);
    fs.unlinkSync(req.files.coverImage[0].path);

    return res.status(201).json({
      message: "Book added successfully",
      book: {
        _id: savedBook._id,
        title: savedBook.title,
        genre: savedBook.genre,
        price: savedBook.price,
        coverImage: savedBook.coverImage,
        status: savedBook.status,
        createdAt: savedBook.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in addBook:", error);

    // Cleanup local files if any remain
    try {
      if (req.files?.pdf?.[0]?.path && fs.existsSync(req.files.pdf[0].path)) {
        fs.unlinkSync(req.files.pdf[0].path);
      }
      if (
        req.files?.coverImage?.[0]?.path &&
        fs.existsSync(req.files.coverImage[0].path)
      ) {
        fs.unlinkSync(req.files.coverImage[0].path);
      }
    } catch (cleanupError) {
      console.error("Error cleaning up files:", cleanupError);
    }

    return res.status(500).json({ message: "Failed to add book" });
  }
};

// Update a book
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete a book
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json({ message: 'Book deleted successfully', book: deletedBook });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all books (optional: filter by user)
export const getBooks = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId: mongoose.Types.ObjectId(userId) } : {};

    const books = await Book.find(filter);
    return res.status(200).json({ books });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get single book by ID
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json({ book });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const getBooksByUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const books = await Book.find({ createdBy: userId });
    return res.status(200).json({ books });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};