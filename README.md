# Readify - Modern Online Bookstore 📚

Readify is a full-stack E-commerce platform for book lovers, featuring a premium UI, dark mode support, and a comprehensive admin dashboard.

## ✨ Features

- **Storefront**: Browse books by category, search by title/author, and view detailed book info.
- **Shopping Experience**: Add to cart, manage wishlist, and secure checkout.
- **Reviews System**: Post reviews with image uploads and rate your favorite books.
- **Admin Dashboard**: Manage inventory, track orders, view customer stats, and manage promotional coupons.
- **Dark Mode**: Fully responsive design with sleek dark mode transitions.
- **Security**: JWT-based authentication and secure password hashing.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React, React Router.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Multer (Image Uploads).
- **Authentication**: JSON Web Tokens (JWT).

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (Local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/readify.git
   cd readify
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   # Create a .env file based on .env.example
   cp .env.example .env
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   npm run dev
   ```

## 🛣️ Sample Routes

### Frontend (Client-side)
- `/` - Home Page (Featured books and categories)
- `/shop` - Browse all books with filters
- `/login` / `/signup` - User authentication
- `/cart` - Shopping cart management
- `/wishlist` - User wishlist
- `/orders` - User order history
- `/book/:id` - Detailed book view and reviews
- `/admin` - Admin dashboard (overview)
- `/admin/books` - Book inventory management

### Backend (API-side)
- `GET /api/books` - Fetch all books
- `GET /api/books/:id` - Fetch a single book by ID
- `POST /api/books/:id/reviews` - Post a review for a book (Authenticated)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/orders` - Place a new order
- `GET /api/admin/stats` - Fetch dashboard statistics (Admin only)

## 🔄 Starting & Ending Point

- **Starting Point**: The user begins at the **Home Page (`/`)**, where they can browse featured books, or go to the **Shop Page (`/shop`)** to search and filter through the entire catalog.
- **Ending Point**: The typical user journey ends with a **Successful Checkout / Order Placement**, where the user confirms their purchase and receives an order confirmation, viewable in their **Orders Page (`/orders`)**.

## 📥 Input / Output

- **Input**: 
  - User credentials (Email, Password) for authentication.
  - Search queries and filter parameters (Genre, Price, Rating).
  - Book reviews and ratings (Text, Numeric rating, Optional image uploads).
  - Admin-provided book details (Title, Author, Price, Stock, Category).
- **Output**: 
  - Dynamic list of books and reviews.
  - JSON-based API responses for cart and wishlist synchronization.
  - Order status and confirmation summaries.
  - Real-time UI updates for notifications and state changes.

## 🏁 Entry Point & Commands

### Backend (Server)
- **Entry Point**: `Backend/server.js`
- **Commands**: 
  - `npm start` - Run the production server.
  - `npm run dev` - Run the development server with Nodemon (auto-reload).

### Frontend (Client)
- **Entry Point**: `Frontend/src/main.jsx`
- **Commands**: 
  - `npm run dev` - Start the Vite development server.
  - `npm run build` - Build the project for production.

## 📚 Libraries & External APIs

### Backend
- **Express**: Fast, unopinionated, minimalist web framework.
- **Mongoose**: MongoDB object modeling tool.
- **jsonwebtoken (JWT)**: Secure user authentication.
- **bcryptjs**: Password hashing and security.
- **multer**: Middleware for handling `multipart/form-data` (image uploads).
- **cors**: Cross-Origin Resource Sharing.
- **dotenv**: Environment variable management.

### Frontend
- **React**: Modern UI library.
- **Vite**: Ultra-fast build tool and dev server.
- **Tailwind CSS**: Utility-first CSS framework for modern styling.
- **React Router DOM**: Declarative routing for React.
- **Axios**: Promised-based HTTP client for API requests.
- **Lucide React**: Beautiful icons for the UI.
- **React Hot Toast**: For elegant notifications.

## 🔒 Security

Sensitive information (database URIs, JWT secrets) is managed via environment variables and excluded from version control using `.gitignore`.

## 📄 License

This project is licensed under the MIT License.
