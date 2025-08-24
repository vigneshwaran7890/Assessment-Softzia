import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBooksById } from '../api/book.js';
import dayjs from 'dayjs';

interface Book {
  _id?: string;
  title?: string;
  author?: string;
  description?: string;
  genre?: string;
  price?: number;
  coverImage?: string;
  pdfUrl?: string;
  publishedDate?: string;
  keywords?: string[];
  rating?: number;
  created_at?: string;
  backgroundColor?: string;
  status?: string;
}

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewPdf, setViewPdf] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getBooksById(id);
        const bookData = response.book || response;
        setBook(bookData);
      } catch (err) {
        setError('Failed to fetch book details');
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const formatPrice = (price?: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price || 0);
  };

  const getGenreColor = (genre?: string) => {
    const genreColors = {
      fiction: 'bg-purple-100 text-purple-800',
      romance: 'bg-pink-100 text-pink-800',
      mystery: 'bg-indigo-100 text-indigo-800',
      fantasy: 'bg-blue-100 text-blue-800',
      science: 'bg-cyan-100 text-cyan-800',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The book you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Books
        </button>

        {/* PDF Viewer Modal */}
        {viewPdf && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl h-5/6 flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Reading: {book.title}</h3>
                <button
                  onClick={() => setViewPdf(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1">
                <iframe
                  src={book.pdfUrl}
                  className="w-full h-full"
                  title={`PDF of ${book.title}`}
                >
                  <p>Your browser does not support iframes. You can <a href={book.pdfUrl} download>download the PDF instead</a>.</p>
                </iframe>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Book Cover Section */}
              <div className="lg:col-span-1">
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-md">
                  {book.coverImage ? (
                    <img 
                      src={book.coverImage} 
                      alt={book.title}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                  ) : book.backgroundColor ? (
                    <div 
                      className="w-full h-80 flex items-center justify-center rounded-lg"
                      style={{ backgroundColor: book.backgroundColor }}
                    >
                      <div className="text-5xl font-bold text-white/90">📚</div>
                    </div>
                  ) : (
                    <div className="w-full h-80 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
                      <svg className="h-20 w-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {book.status || 'Published'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  {book.pdfUrl && (
                    <>
                      <button
                        onClick={() => setViewPdf(true)}
                        className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        Read Now
                      </button>
                      <a 
                        href={book.pdfUrl}
                        download
                        className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download PDF
                      </a>
                    </>
                  )}
                  
                  {!book.pdfUrl && (
                    <button
                      className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg cursor-not-allowed"
                      disabled
                    >
                      PDF Not Available
                    </button>
                  )}
                </div>
              </div>

              {/* Book Details Section */}
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title || 'Untitled Book'}</h1>
                
                {book.author && (
                  <p className="text-lg text-gray-700 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    by {book.author}
                  </p>
                )}

                {/* Genre */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {book.genre && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGenreColor(book.genre)}`}>
                      {book.genre}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(book.price)}
                  </span>
                </div>

                {/* Description */}
                {book.description && (
                  <div className="bg-gray-50 p-5 rounded-lg mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3 text-lg">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                )}

                {/* Keywords */}
                {book.keywords && book.keywords.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3 text-lg">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {book.keywords.map((keyword, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  {book.publishedDate && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Published Date</p>
                      <p className="text-gray-700">
                        {new Date(book.publishedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  
                  {book.created_at && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Added to Catalog</p>
                      <p className="text-gray-700">
                        {new Date(book.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;