import React from 'react';

const Hero = ({ featuredBook }) => {
  const scrollToShop = () => {
    const element = document.getElementById('best-sellers');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-[#f7f3ec] dark:bg-gray-900 py-10 md:py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="order-2 md:order-1">
            <h1 className="text-5xl md:text-7xl font-bold text-[#1a1a1a] dark:text-white leading-tight tracking-tighter mb-6 transition-colors duration-300">
              {featuredBook ? (
                <>Read <span className="text-amber-600">{featuredBook.title}</span>, <br className="hidden md:block"/> Elevate Your Mind.</>
              ) : (
                <>Read More, <br className="hidden md:block"/> Learn More.</>
              )}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md leading-relaxed transition-colors duration-300">
              {featuredBook ? (
                `Discover "${featuredBook.title}" by ${featuredBook.author}. A masterpiece now available in our featured collection.`
              ) : (
                'Explore our vast collection of books and find your next great read. From fiction to history, we have everything to ignite your imaginary world.'
              )}
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={scrollToShop}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-none transition-colors duration-300"
              >
                Shop Now
              </button>
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            <div className="relative w-full max-w-sm aspect-[4/5] bg-gradient-to-tr from-amber-200 to-amber-500 rounded-lg shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-all duration-500 flex items-center justify-center border-4 border-white dark:border-gray-800">
               {featuredBook?.imageUrl ? (
                 <img 
                   src={featuredBook.imageUrl} 
                   alt={featuredBook.title} 
                   className="w-full h-full object-cover"
                 />
               ) : (
                 <span className="text-white text-3xl font-bold italic tracking-wider filter drop-shadow-md">Must Read</span>
               )}
               
               <div className="absolute top-4 right-4 bg-amber-600 text-white px-4 py-2 rounded-full font-bold shadow-lg text-sm uppercase tracking-widest animate-pulse">
                 {featuredBook ? 'Featured' : 'Best Seller'}
               </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
