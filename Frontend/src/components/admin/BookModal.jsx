import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const BookModal = ({ isOpen, onClose, onSave, book }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    price: '',
    stock: '',
    description: '',
    imageUrl: '',
    rating: '0'
  });

  useEffect(() => {
    if (book) {
      setFormData(book);
    } else {
      setFormData({
        title: '',
        author: '',
        genre: '',
        price: '',
        stock: '',
        description: '',
        imageUrl: '',
        rating: '0'
      });
    }
  }, [book, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#f7f3ec] dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-amber-200/50 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-amber-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-[#1a1a1a] dark:text-white tracking-tighter">
            {book ? 'Edit Book' : 'Add New Book'}<span className="text-amber-600">.</span>
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white dark:hover:bg-gray-800 text-gray-400 hover:text-amber-600 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-1">Title</label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="The Great Gatsby"
                className="w-full px-5 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold tracking-tight transition-all text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-1">Author</label>
              <input
                required
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="F. Scott Fitzgerald"
                className="w-full px-5 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold tracking-tight transition-all text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-1">Genre</label>
              <select
                required
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold tracking-tight transition-all appearance-none text-gray-900 dark:text-white"
              >
                <option value="">Select Genre</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Romance">Romance</option>
                <option value="Mystery">Mystery</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Self-Help">Self-Help</option>
                <option value="Business">Business</option>
                <option value="History">History</option>
                <option value="Poetry">Poetry</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-1">Price (₹)</label>
              <input
                required
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="499"
                className="w-full px-5 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold tracking-tight transition-all text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-1">Stock</label>
              <input
                required
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
                className="w-full px-5 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold tracking-tight transition-all text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-1">Image URL</label>
            <input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/book-cover.jpg"
              className="w-full px-5 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold tracking-tight transition-all text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold text-gray-500 uppercase tracking-widest pl-1">Description</label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="A brief summary of the book..."
              className="w-full px-5 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold tracking-tight transition-all resize-none text-gray-900 dark:text-white"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 rounded-2xl text-gray-500 font-extrabold tracking-tight hover:bg-white dark:hover:bg-gray-800 transition-all uppercase text-xs tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-extrabold tracking-tight shadow-lg shadow-amber-600/20 hover:scale-105 active:scale-95 transition-all uppercase text-xs tracking-widest"
            >
              {book ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;
