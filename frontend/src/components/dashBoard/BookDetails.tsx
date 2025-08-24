import React from 'react';

interface Book {
  id?: string;
  title?: string;
  author?: string;
  description?: string;
  genre?: string;
  price?: number;
  coverImage?: string;
  pdfUrl?: string;
  publishedDate?: string;
  // Add other book properties as needed
}

interface BookDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
}

const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ isOpen, onClose, book }) => {
  if (!book) return null;

  const formatPrice = (price?: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price || 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Book Details</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              {book.coverImage ? (
                <img 
                  src={book.coverImage} 
                  alt={book.title}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              ) : (
                <div className="bg-gray-100 rounded-lg flex items-center justify-center aspect-[2/3]">
                  <svg className="h-20 w-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
              )}
              {book.pdfUrl && (
                <div className="mt-4 flex justify-center">
                  <a 
                    href={book.pdfUrl || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-4 py-2 ${book.pdfUrl ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white rounded-lg transition-colors flex items-center`}
                    onClick={!book.pdfUrl ? (e) => e.preventDefault() : undefined}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {book.pdfUrl ? 'Download PDF' : 'PDF Not Available'}
                  </a>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{book.title || 'Untitled Book'}</h1>
              
              {book.author && (
                <p className="text-gray-600 mb-4">
                  <span className="font-medium">Author:</span> {book.author}
                </p>
              )}

              {book.genre && (
                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    {book.genre}
                  </span>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-700">
                  {book.description || 'No description available.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-xl font-bold text-blue-600">{formatPrice(book.price)}</p>
                </div>
                {book.publishedDate && (
                  <div>
                    <p className="text-sm text-gray-500">Published</p>
                    <p className="text-gray-700">
                      {new Date(book.publishedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;
