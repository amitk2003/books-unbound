# 📚 Books Unbound

## 🧭 Overview
**Books Unbound** is a full-stack e-commerce web application designed to provide users with access to a diverse collection of books across various categories.  
The application supports two main roles — **Admin** and **User**, each with distinct features and privileges.

---

## ⚙️ Tech Stack

### 🖥️ Frontend
- **React.js** – For building the interactive user interface
- **Vite** – Next-generation frontend tooling for fast builds
- **Framer Motion** – For animations and smooth transitions
- **Tailwind CSS** – For modern, responsive styling
- **Redux** – For efficient state management

### 🗄️ Backend
- **Node.js** & **Express.js** – For server-side logic and RESTful APIs
- **MongoDB** & **Mongoose** – For database management and data persistence
- **Stripe** – For secure payment processing
- **Google OAuth / JWT** – For secure user authentication and login

---

## 🚀 Features

### 👑 Admin Role
- Deliver and manage book inventory effectively
- Conduct timely update sessions for book details (stock, prices)
- Monitor and manage overall orders

### 🙋 User Role
- Browse and search a diverse catalog of books
- Add books to **Cart** and proceed to checkout (Supports COD and Online Payments)
- Secure delivery tracking with **OTP Verification**
- Add books to **Favorites** for later
- Leave **Reviews** and ratings on purchased books
- Access **Profile Page** to view:
  - Order history and real-time order status
  - Favorite books
  - Account settings and avatar management

---

## 🗄️ Data Models

- **User**: Manages user details, authentication (including password resets), roles (Admin/User), and references to their cart, favorites, and orders.
- **Book**: Stores catalog information, pricing, stock levels, genres, and aggregated rating metrics.
- **Order**: Tracks the checkout lifecycle (Placed -> Delivered), payment status, and includes OTP verification for secure deliveries.
- **Review**: Links users and books, storing 1-5 star ratings and textual feedback.

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- MongoDB instance running
- Stripe and Google OAuth developer credentials (if applicable)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bookstore
   ```

2. **Setup Server**
   ```bash
   cd server
   npm install
   # Create a .env file and add necessary environment variables (MONGO_URI, PORT, JWT_SECRET, STRIPE_SECRET, etc.)
   npm run start
   ```

3. **Setup Client**
   ```bash
   cd ../client
   npm install
   # Create a .env file if necessary
   npm run dev
   ```

---

## 🖼️ Screenshots
> *(Add your screenshots here using Markdown image syntax)*  

Example:  
```markdown
![Homepage Screenshot](./screenshots/homepage.png)
![Cart Screenshot](./screenshots/cart.png)
```
