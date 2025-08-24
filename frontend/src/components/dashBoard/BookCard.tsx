import React, { useEffect, useState } from 'react';
import dayjs from "dayjs";
import { useNavigate } from 'react-router-dom'; // Import useNavigat
const BookCard = ({ book, onEdit, onDelete, onRead = null }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [status, setStatus] = useState("Processing...");
  const navigate = useNavigate(); // Initialize navigate function

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price || 0);
  };

  // Handle card click to navigate to book details
  const handleCardClick = () => {
    navigate(`/book-details/${book._id}`);
  };

  // Prevent action buttons from triggering card navigation
  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  useEffect(() => {
    if (!book?.created_at) return;

    const createdTime = dayjs(book.created_at);
    const now = dayjs();

    const diffInMs = now.diff(createdTime, "millisecond");

    if (diffInMs >= 5000) {
      setStatus("Published");
    } else {
      const timeout = setTimeout(() => {
        setStatus("Published");
      }, 5000 - diffInMs);

      return () => clearTimeout(timeout);
    }
  }, [book?.created_at]);

  const getGenreColor = (genre) => {
    const genreColors = {
      fiction: 'bg-purple-100 text-purple-800',
      romance: 'bg-pink-100 text-pink-800',
      mystery: 'bg-indigo-100 text-indigo-800',
      fantasy: 'bg-blue-100 text-blue-800',
      scifi: 'bg-cyan-100 text-cyan-800',
      horror: 'bg-red-100 text-red-800',
      thriller: 'bg-orange-100 text-orange-800',
      biography: 'bg-amber-100 text-amber-800',
      history: 'bg-yellow-100 text-yellow-800',
      default: 'bg-gray-100 text-gray-800'
    };

    if (!genre) return genreColors.default;

    const genreLower = genre.toLowerCase();
    for (const [key, value] of Object.entries(genreColors)) {
      if (genreLower.includes(key)) return value;
    }

    return genreColors.default;
  };

  return (
    <div
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick} // Add click handler to the entire card
    >
      {/* Premium Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {status}
        </span>
      </div>

      {/* Book Cover Container */}
      <div className="relative h-60 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {book.coverImage ? (
          <>
            <img
              src={book.coverImage}
              alt={book.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
            />
            {/* Overlay gradient for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </>
        ) : book.backgroundColor ? (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: book.backgroundColor }}
          >
            <div className="text-5xl font-bold text-white/90 transition-transform duration-300 group-hover:scale-110">📚</div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <svg className="h-20 w-20 text-gray-400 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
        )}

        {/* Action buttons overlay */}
        <div className={`absolute top-3 right-3 flex flex-col space-y-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          <button
            onClick={(e) => handleActionClick(e, onEdit)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors duration-200 group/btn"
            title="Edit book"
          >
            <svg className="h-4 w-4 text-blue-600 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </button>

          <button
            onClick={(e) => handleActionClick(e, onDelete)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors duration-200 group/btn"
            title="Delete book"
          >
            <svg className="h-4 w-4 text-red-600 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>

        {/* PDF Icon Badge */}
        {book.pdfUrl && (
          <div className="absolute bottom-3 left-3 flex items-center bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
            <svg className="h-4 w-4 text-red-600 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
            </svg>
            <span className="text-xs font-medium text-gray-700">PDF Available</span>
          </div>
        )}
      </div>

      {/* Book Details */}
      <div className="p-5">
        {/* Genre Tag */}
        {book.genre && (
          <div className="mb-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getGenreColor(book.genre)}`}>
              {book.genre}
            </span>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
            {book.title || 'Untitled Book'}
          </h3>


          {book.author && (
            <p className="text-sm text-gray-600 mt-1 flex items-center">
              <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              by {book.author}
            </p>
          )}

          {book.description && (
            <p className="text-sm text-gray-700 mt-3 line-clamp-2">{book.description}</p>
          )}
          {book.keywords && book.keywords.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {book.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {formatPrice(book.price)}
          </span>

          <div className="flex space-x-2">
            {book.pdfUrl && onRead && (
              <button
                onClick={(e) => handleActionClick(e, onRead)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center"
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                Read
              </button>
            )}

            {!book.pdfUrl && (
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg cursor-not-allowed opacity-50"
                disabled
              >
                Coming Soon
              </button>
            )}
          </div>
        </div>


      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 pointer-events-none transition-all duration-300"></div>
    </div>
  );
};

export default BookCard;