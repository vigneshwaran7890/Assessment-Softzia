# Backend Architecture - Book Management System

## Overview
The backend is built using Node.js with Express.js, providing RESTful API endpoints for a book management system with user authentication and file upload capabilities.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **API Documentation**: (To be implemented)
- **Environment Management**: dotenv
- **Logging**: Morgan

## Project Structure
```
backend/
├── config/           # Configuration files
│   ├── cloudinary.js # Cloudinary configuration
│   └── geminiConfig.js # Google Gemini AI configuration
├── controllers/      # Request handlers
│   ├── bookController.js
│   └── userController.js
├── middleware/       # Custom middleware
│   ├── authMiddleware.js # Authentication middleware
│   ├── session.js    # Session configuration
│   └── uploadMiddleware.js # File upload handling
├── models/           # Database models
│   ├── bookModel.js
│   └── userModel.js
├── routes/           # Route definitions
│   ├── bookRoutes.js
│   └── userRoutes.js
├── uploads/          # Temporary file storage
├── .env              # Environment variables
├── package.json      # Project dependencies
└── server.js         # Application entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout user

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

## Environment Variables
Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/Softzia
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
```

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables in `.env`
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The server will be running at `http://localhost:5000`

## Dependencies
- express: ^5.1.0
- mongoose: ^8.18.0
- jsonwebtoken: ^9.0.2
- bcrypt: ^6.0.0
- cloudinary: ^2.7.0
- dotenv: ^17.2.1
- cors: ^2.8.5
- morgan: ^1.10.1
- multer: ^2.0.2
- @google/generative-ai: ^0.24.1
