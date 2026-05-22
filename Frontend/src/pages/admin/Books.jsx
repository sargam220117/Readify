import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Edit2, Trash2, Filter } from 'lucide-react';
import BookModal from '../../components/admin/BookModal';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/books');
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = () => {
    setSelectedBook(null);
    setIsModalOpen(true);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`http://localhost:5001/api/books/${id}`);
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handleSaveBook = async (formData) => {
    try {
      if (selectedBook) {
        await axios.put(`http://localhost:5001/api/books/${selectedBook._id}`, formData);
      } else {
        await axios.post('http://localhost:5001/api/books', formData);
      }
      setIsModalOpen(false);
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1a1a1a] dark:text-white tracking-tighter">
            Inventory<span className="text-amber-600">.</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold mt-1 tracking-tight">Manage your book collection</p>
        </div>
        <button 
          onClick={handleAddBook}
          className="flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold tracking-tight transition-all shadow-lg shadow-amber-600/20 hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          <span>Add New Book</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-amber-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by title, author, or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#f7f3ec] dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium text-gray-900 dark:text-white"
            />
          </div>
          <button className="flex items-center space-x-2 px-6 py-3 border border-amber-200 dark:border-amber-800 text-amber-600 font-bold tracking-tight rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              <p className="text-gray-500 mt-4 font-bold">Loading inventory...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f7f3ec] dark:bg-gray-900/50">
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Image</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 uppercase">Book Details</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Genre</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Stock</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Price</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredBooks.map((book) => (
                  <tr key={book._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                    <td className="px-6 py-4">
                      {book.imageUrl ? (
                        <img 
                          src={book.imageUrl} 
                          alt={book.title} 
                          className="h-14 w-10 object-cover rounded shadow-sm group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.src = ''; e.target.className = 'h-14 w-10 bg-amber-100 dark:bg-gray-700 rounded shadow-sm'; }}
                        />
                      ) : (
                        <div className="h-14 w-10 bg-amber-100 dark:bg-gray-700 rounded shadow-sm group-hover:scale-105 transition-transform duration-300"></div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">{book.title}</span>
                        <span className="text-xs font-bold text-gray-400 tracking-tight">{book.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/20 uppercase tracking-widest">
                        {book.genre}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300 tracking-tighter">
                      {book.stock} units
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white tracking-tighter">
                      ₹{book.price}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEditBook(book)}
                          className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/40 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteBook(book._id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <BookModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBook}
        book={selectedBook}
      />
    </div>
  );
};

export default Books;

