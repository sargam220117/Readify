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

## 🔒 Security

Sensitive information (database URIs, JWT secrets) is managed via environment variables and excluded from version control using `.gitignore`.

## 📄 License

This project is licensed under the MIT License.
