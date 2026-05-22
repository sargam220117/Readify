import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Hero from '../components/Hero';
import BookCard from '../components/BookCard';
import PromoBanner from '../components/PromoBanner';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { name: 'All', icon: '🌟', color: 'bg-amber-50' },
    { name: 'Self-Help', icon: '🌱', color: 'bg-green-100' },
    { name: 'Fiction', icon: '📚', color: 'bg-amber-100' },
    { name: 'Finance', icon: '💰', color: 'bg-emerald-100' },
    { name: 'Psychology', icon: '🧠', color: 'bg-purple-100' },
    { name: 'History', icon: '🏛️', color: 'bg-blue-100' },
    { name: 'Business', icon: '💼', color: 'bg-slate-100' },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('https://readify-1-u98x.onrender.com/api/books');
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    const element = document.getElementById('best-sellers');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredBooks = selectedCategory === 'All' 
    ? books 
    : books.filter(book => book.genre === selectedCategory);

  return (
    <div className="transition-colors duration-300">
      <Hero featuredBook={books.length > 0 ? books[books.length - 1] : null} />
      
      <section id="best-sellers" className="py-12 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 border-b border-gray-200 dark:border-gray-800 pb-4 transition-colors duration-300">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-[#1a1a1a] dark:text-white transition-colors duration-300">
                {selectedCategory === 'All' ? 'Best Selling Books' : `${selectedCategory} Books`}
              </h2>
              {selectedCategory !== 'All' && (
                <button 
                  onClick={() => setSelectedCategory('All')}
                  className="text-amber-600 text-sm font-semibold mt-2 hover:underline"
                >
                  &larr; Clear Filter
                </button>
              )}
            </div>
            <Link to="/shop" className="font-semibold text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 hidden sm:block transition-colors duration-300">
              View All Books &rarr;
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl h-80"></div>
              ))}
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredBooks.slice(0, 8).map(book => (
                <BookCard 
                  key={book._id} 
                  book={book}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-3xl transition-colors duration-300">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-bold">No books found in {selectedCategory}.</p>
              <button 
                onClick={() => setSelectedCategory('All')}
                className="mt-4 bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          )}
          
          <div className="mt-12 text-center sm:hidden">
             <Link to="/shop" className="font-semibold text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors duration-300">
               View All Books &rarr;
             </Link>
          </div>
        </div>
      </section>

      <section id="categories" className="py-16 bg-[#fcfaf7] dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-[#1a1a1a] dark:text-white mb-4">Shop by Categories</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">Choose a genre to find your next favorite book from our curated collection.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((cat, i) => (
              <div 
                key={i} 
                onClick={() => handleCategoryClick(cat.name)}
                className={`${cat.color} dark:bg-gray-700 p-6 text-center rounded-2xl cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-2 border-2 ${selectedCategory === cat.name ? 'border-amber-600 shadow-lg scale-105' : 'border-transparent'}`}
              >
                <div className="text-4xl mb-4 filter drop-shadow-sm">{cat.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PromoBanner />

      <section id="featured" className="py-12 bg-white dark:bg-gray-900 transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 border-b border-gray-200 dark:border-gray-800 pb-4 transition-colors duration-300">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-[#1a1a1a] dark:text-white transition-colors duration-300">Latest Releases</h2>
          </div>
          
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl h-80"></div>
               ))}
             </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {books.slice(0, 4).reverse().map(book => (
                <BookCard 
                  key={book._id} 
                  book={book}
                />
              ))}
            </div>
          ) : (
             <div className="text-center py-10">
               <p className="text-gray-500 dark:text-gray-400 text-lg font-bold">More books coming soon!</p>
             </div>
          )}
         </div>
      </section>

      <section id="reviews" className="py-16 bg-[#fcfaf7] dark:bg-gray-800 transition-colors duration-300 border-t border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold tracking-tighter text-[#1a1a1a] dark:text-white mb-10">What Our Readers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: 'John Doe', text: 'Best bookstore I have ever visited. The selection is amazing!', role: 'Avid Reader' },
              { name: 'Sarah Smith', text: 'The dark mode implementation is just beautiful. Great experience.', role: 'Book Blogger' },
              { name: 'Mike Ross', text: 'Fast delivery and great customer support. Highly recommended.', role: 'Casual Reader' },
            ].map((review, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-50 dark:border-gray-800">
                <p className="italic text-gray-600 dark:text-gray-300 mb-8 font-serif text-lg leading-relaxed">"{review.text}"</p>
                <div className="w-12 h-1 bg-amber-600 mx-auto mb-6"></div>
                <h4 className="font-bold text-gray-900 dark:text-white">{review.name}</h4>
                <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">{review.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;
