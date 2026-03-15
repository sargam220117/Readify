import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Heart, Star, ArrowLeft, ShieldCheck, Truck, RefreshCw, Camera, X, MessageSquare, User, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, addToCart, updateQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const fileInputRef = React.useRef(null);

  const cartItem = cart.items.find(item => (item.book?._id === id || item.book === id));

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/books/${id}`);
        setBook(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching book details:', error);
        toast.error('Book not found');
        navigate('/shop');
      }
    };
    fetchBook();
  }, [id, navigate]);

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItem]);

  const handleAddToCart = () => {
    setAdding(true);
    if (cartItem) {
      updateQuantity(book._id, quantity);
      toast.success(`Cart updated to ${quantity} copies!`);
    } else {
      addToCart(book, quantity);
      toast.success(`${book.title} added to cart!`);
    }
    setTimeout(() => setAdding(false), 1000);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 5) {
      return toast.error('Maximum 5 images allowed');
    }
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment) return toast.error('Please add a comment');
    
    setSubmittingReview(true);
    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('comment', comment);
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      await axios.post(`http://localhost:5000/api/books/${id}/reviews`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      setSelectedFiles([]);
      
      const response = await axios.get(`http://localhost:5000/api/books/${id}`);
      setBook(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}/reviews/${reviewId}`);
      toast.success('Review deleted');
      
      // Refresh book data
      const response = await axios.get(`http://localhost:5000/api/books/${id}`);
      setBook(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(book?._id);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb / Back button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase text-[10px] tracking-widest">Back to Collection</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Image Container */}
          <div className="relative group">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-2xl relative">
              <img 
                src={book.imageUrl} 
                alt={book.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button 
                onClick={() => toggleWishlist(book)}
                className={`absolute top-6 right-6 p-4 rounded-full transition-all duration-300 shadow-xl ${
                  isWishlisted 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white hover:text-red-500'
                }`}
              >
                <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>
            
            {/* Badges */}
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hidden lg:block">
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
                  <Star size={24} className="text-amber-600" fill="currentColor" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                    {book.reviews?.length > 0 ? book.rating?.toFixed(1) : '0.0'}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Global Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content Container */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 text-[10px] font-black uppercase tracking-widest mb-4">
                {book.genre}
              </span>
              <h1 className="text-4xl lg:text-5xl font-black text-[#1a1a1a] dark:text-white leading-tight tracking-tighter mb-2">
                {book.title}<span className="text-amber-600">.</span>
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">by <span className="text-gray-900 dark:text-white font-bold underline decoration-amber-500/30 underline-offset-4">{book.author}</span></p>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <p className="text-4xl font-black text-[#1a1a1a] dark:text-amber-500 tracking-tighter">₹{book.price.toLocaleString()}</p>
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
              <p className={`text-sm font-bold uppercase tracking-widest ${book.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {book.stock > 0 ? `In Stock (${book.stock})` : 'Out of Stock'}
              </p>
            </div>

            {cartItem && (
              <div className="mb-6 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800 w-fit">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-tight">
                  {cartItem.quantity} already in your cart
                </span>
              </div>
            )}

            <div className="mb-10">
              <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-4">Description</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg font-medium">
                {book.description || `Embark on a journey through "${book.title}", a masterpiece by ${book.author}. This ${book.genre} classic explores themes that resonate with readers across generations, offering profound insights and a truly captivating narrative.`}
              </p>
            </div>

            {/* Actions */}
            <div className="mb-12">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Select Quantity</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border-2 border-gray-100 dark:border-gray-700 rounded-2xl p-1 bg-gray-50/50 dark:bg-gray-800/50">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-12 h-12 flex items-center justify-center text-xl font-bold hover:text-amber-600 transition-colors dark:text-white"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-black dark:text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="w-12 h-12 flex items-center justify-center text-xl font-bold hover:text-amber-600 transition-colors dark:text-white"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={adding || book.stock === 0}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-black uppercase tracking-widest py-4 px-8 rounded-2xl shadow-xl shadow-amber-600/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  <ShoppingCart size={20} />
                {adding ? (cartItem ? 'Updating...' : 'Adding...') : (cartItem ? 'Update Quantity' : 'Add to Collection')}
              </button>
            </div>
          </div>

            {/* Features/Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-col items-center text-center group">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl mb-3 text-emerald-600 transition-transform group-hover:scale-110">
                  <ShieldCheck size={24} />
                </div>
                <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Secure Payment</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl mb-3 text-blue-600 transition-transform group-hover:scale-110">
                  <Truck size={24} />
                </div>
                <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Global Shipping</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-xl mb-3 text-rose-600 transition-transform group-hover:scale-110">
                  <RefreshCw size={24} />
                </div>
                <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-32 pt-16 border-t border-gray-100 dark:border-gray-800">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-[#1a1a1a] dark:text-white tracking-tighter mb-2 flex items-center gap-3">
              Customer Reviews
              <span className="text-amber-600">.</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium lowercase tracking-wide">Real feedback from our global community of readers</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Summary & Form (Sticky Sidebar) */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
              <div className="bg-gray-50/50 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100 dark:border-gray-700/50 p-8 rounded-[32px]">
                <div className="flex items-center gap-6 mb-8">
                  <div className="flex flex-col">
                    <span className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter">
                      {book.reviews?.length > 0 ? book.rating?.toFixed(1) : '0.0'}
                    </span>
                    <div className="flex text-amber-500 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < Math.round(book.reviews?.length > 0 ? book.rating : 0) ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <div className="h-16 w-px bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex flex-col justify-center">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Based on</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{book.reviews?.length || 0} reviews</span>
                  </div>
                </div>

                {/* Rating bars would go here for extra premium feel */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = book.reviews?.filter(r => r.rating === star).length || 0;
                    const percent = book.reviews?.length > 0 ? (count / book.reviews.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 w-8 font-bold text-gray-400">{star} <Star size={10} fill="currentColor" /></span>
                        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${percent}%` }}></div>
                        </div>
                        <span className="w-8 text-right text-gray-400 font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {user ? (
                <div className="bg-white dark:bg-gray-900 border-2 border-gray-50 dark:border-gray-800 p-8 rounded-[32px] shadow-sm">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6 flex items-center gap-2">
                    <MessageSquare size={20} className="text-amber-600" />
                    Write a Review
                  </h3>
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Rating</label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setRating(num)}
                            className={`p-1.5 rounded-lg transition-all ${rating >= num ? 'text-amber-500 scale-110' : 'text-gray-200 dark:text-gray-700 hover:text-amber-200'}`}
                          >
                            <Star size={24} fill={rating >= num ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Comment</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-amber-500/30 dark:focus:border-amber-500/30 rounded-2xl p-4 min-h-[120px] outline-none transition-all dark:text-white text-sm"
                        placeholder="Share your thoughts..."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Photos</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex items-center justify-center gap-2 hover:border-amber-500/50 transition-all group"
                      >
                        <Camera size={20} className="text-gray-400 group-hover:text-amber-500 transition-colors" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedFiles.length > 0 ? `Selected ${selectedFiles.length}` : 'Upload'}</span>
                      </button>
                      
                      {selectedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {selectedFiles.map((file, idx) => (
                            <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
                              <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(idx)}
                                className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full bg-amber-600 text-white font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-amber-700 transition-all shadow-xl shadow-amber-600/10 active:scale-95 disabled:opacity-50"
                    >
                      {submittingReview ? 'Sending...' : 'Post Review'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-100 dark:border-amber-900/30 p-8 rounded-[32px] text-center">
                  <p className="text-amber-800 dark:text-amber-200 font-bold mb-4 italic text-sm">Sign in to share your review!</p>
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-amber-600 dark:text-amber-400 font-black uppercase tracking-widest text-xs hover:underline underline-offset-4"
                  >
                    Login to Account &rarr;
                  </button>
                </div>
              )}
            </div>

            {/* Right: Reviews List */}
            <div className="lg:col-span-8">
              {book.reviews?.length > 0 ? (
                <div className="grid grid-cols-1 gap-8">
                  {book.reviews.slice().reverse().map((review) => (
                    <div key={review._id} className="bg-white dark:bg-gray-800/20 border border-gray-50 dark:border-gray-700/50 p-8 rounded-[32px] transition-all hover:shadow-xl hover:shadow-gray-100/50 dark:hover:shadow-none transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-amber-600 border border-gray-100 dark:border-gray-700 group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20 transition-colors">
                            <User size={28} />
                          </div>
                          <div>
                            <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-base mb-1">{review.username}</p>
                            <div className="flex items-center gap-3">
                              <div className="flex text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                                ))}
                              </div>
                              <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>
                        {user && (user.id === review.user || user._id === review.user) && (
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                            title="Delete review"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      
                      <div className="relative">
                        <div className="absolute left-1 top-0 bottom-0 w-1 bg-amber-100 dark:bg-amber-900/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base font-medium pl-6">
                          {review.comment}
                        </p>
                      </div>
                      
                      {review.images?.length > 0 && (
                        <div className="flex flex-wrap gap-4 mt-8 pl-6">
                          {review.images.map((img, idx) => {
                            const fullImgUrl = img.startsWith('http') ? img : `http://localhost:5000${img}`;
                            return (
                              <div key={idx} className="w-28 h-28 rounded-[24px] overflow-hidden border-2 border-white dark:border-gray-800 shadow-md cursor-zoom-in group/img">
                                <img 
                                  src={fullImgUrl} 
                                  alt="review" 
                                  className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" 
                                  onClick={() => window.open(fullImgUrl, '_blank')}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-gray-50/50 dark:bg-gray-800/20 rounded-[48px] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl shadow-lg flex items-center justify-center text-4xl mb-6 animate-bounce">
                    ✨
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Be the first to share</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto font-medium">No reviews yet for this masterpiece. Help others by sharing your experience.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
