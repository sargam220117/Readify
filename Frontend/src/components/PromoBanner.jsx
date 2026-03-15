import React from 'react';

const PromoBanner = () => {
  const scrollToShop = () => {
    const element = document.getElementById('best-sellers');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-amber-600 dark:bg-amber-700 py-12 text-center text-white my-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter">
          30% Discount on all items
        </h2>
        <p className="text-lg md:text-xl text-amber-100 dark:text-amber-50 mb-8 max-w-2xl mx-auto transition-colors duration-300">
          Sign up to our newsletter and get a 30% discount on your first book purchase. Hurry up!
        </p>
        <div className="flex justify-center">
          <button 
            onClick={scrollToShop}
            className="bg-[#1a1a1a] dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-800 hover:text-[#1a1a1a] dark:hover:text-amber-500 text-white font-bold py-3 px-8 rounded-none transition-colors duration-300"
          >
            Shop Collection
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
