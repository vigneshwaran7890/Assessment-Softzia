import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const bookSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    createdBy: {
        type: String, 
        ref: "User", 
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    pdfUrl: {
        type: String, 
        required: true,
    },
    coverImage: {
        type: String, 
        required: true,
    },
    description: {
        type: String,
        default: null,
    },
    keywords: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ['Processing', 'Published'],
        default: 'Processing',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

// Auto-update `updated_at` whenever modified
bookSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);
export default Book;
