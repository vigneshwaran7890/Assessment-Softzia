import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import AddBookModal from '../components/dashBoard/AddBookModal.js';

import { useUserStore } from '../store/index.js';
import { getUserBooks, deleteBook,updateBook } from '../api/book.js';
import BookCard from '../components/dashBoard/BookCard.js';
import EditBookModal from '../components/dashBoard/EditBookModal.js';
import DeleteBookModal from '../components/dashBoard/DeleteBookModal.js';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isEditBookOpen, setIsEditBookOpen] = useState(false);
  const [isDeleteBookOpen, setIsDeleteBookOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const logoutUser = useUserStore((state) => state.logoutUser);
  const userId = useUserStore((state) => state?.id);
  const userName = useUserStore((state) => state?.name);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    logoutUser();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    navigate('/login');
  };

  const fetchUserBooks = async () => {
    try {
      setLoading(true);
      const data = await getUserBooks();
      setBooks(data.books || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch books.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditBook = (book) => {
    updateBook(book._id)
    setSelectedBook(book);
    setIsEditBookOpen(true);
  };

  const handleDeleteBook = (book) => {
    setSelectedBook(book);
    setIsDeleteBookOpen(true);
  };

  const confirmDeleteBook = async () => {
    try {
      await deleteBook(selectedBook._id);
      toast({
        title: 'Success',
        description: 'Book deleted successfully.',
      });
      fetchUserBooks();
      setIsDeleteBookOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete book.',
        variant: 'destructive',
      });
    }
  };

  const handleBookUpdated = () => {
    fetchUserBooks();
    setIsEditBookOpen(false);
    setSelectedBook(null);
  };

  const handleBookAdded = () => {
    fetchUserBooks();
    setIsAddBookOpen(false);
  };

  // Filter books based on status and search term
  const filteredBooks = books.filter(book => {
    const matchesFilter = filter === 'all' || book.status?.toLowerCase() === filter;
    const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.genre?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    fetchUserBooks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Book Dashboard</h1>
            <p className="text-sm text-gray-600">Manage your book collection</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Welcome, {userName || 'User'}!</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                placeholder="Search books..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsAddBookOpen(true)}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Book
          </button>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard 
                key={book._id} 
                book={book} 
                onEdit={() => handleEditBook(book)}
                onDelete={() => handleDeleteBook(book)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No books found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter to find what you are looking for.' 
                : 'Get started by adding a new book.'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsAddBookOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Book
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        onBookAdded={handleBookAdded}
      />
      
      {selectedBook && (
        <>
          <EditBookModal
            isOpen={isEditBookOpen}
            onClose={() => {
              setIsEditBookOpen(false);
              setSelectedBook(null);
            }}
            onBookUpdated={handleBookUpdated}
            book={selectedBook}
          />
          
          <DeleteBookModal
            isOpen={isDeleteBookOpen}
            onClose={() => {
              setIsDeleteBookOpen(false);
              setSelectedBook(null);
            }}
            onConfirm={confirmDeleteBook}
            book={selectedBook}
          />
        </>
      )}
    </div>
  );
};

export default Home;