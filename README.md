# 🍕 Food Ordering Platform

A comprehensive full-stack food ordering platform built for small restaurants to manage their online presence, accept orders, and provide a seamless customer experience without relying on expensive third-party services.

## 📋 Overview

This platform enables restaurants to:
- Display their menu with detailed descriptions and images
- Accept online orders with real-time tracking
- Manage orders through an admin dashboard
- Collect customer reviews and ratings
- Generate sales reports and analytics

Customers can:
- Browse menu items
- Add items to cart 
- Processing checkout & Place orders
- Track order status 
- View order history

## ✨ Key Features

### For Customers
- 🔐 **User Authentication** - Secure registration and login
- 🍽️ **Menu Browsing** - Search, filter, and explore dishes
- 🛒 **Shopping Cart** - Add/remove items with quantity control
- 📦 **Order Placement** - Easy checkout with multiple payment options
- 📜 **Order History** - View past orders and reorder

### For Restaurant Owners/Admins
- 📊 **Dashboard Analytics** - Overview of orders, revenue, and performance
- 📝 **Order Management** - View and update order status
- 🍕 **Menu Management** - Add, edit, and manage menu items
- 👥 **Customer Insights** - Top customers and ordering patterns

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational database
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Security & Middleware
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting
- **express-validator** - Input validation
- **compression** - Response compression

## 📁 Project Structure

```
food-ordering-platform/
├── src/
│   ├── config/           # Database configuration
│   ├── controllers/      # Business logic
│   ├── middleware/       # Authentication, validation, errors
│   ├── routes/           # API endpoints
│   ├── utils/            # Helper functions
│   └── app.js            # Main application
├── schema.sql            # Database schema
├── .env.example          # Environment variables template
├── package.json          # Dependencies
└── README.md             # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Frontend (HTML5, CSS, JS)
- Node.js (v16+)
- MySQL (v8.0+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd food-ordering-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up database**
   ```bash
   mysql -u root -p
   CREATE DATABASE food_ordering_platform;
   exit
   
   mysql -u root -p food_ordering_platform < schema.sql
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the API**
   ```
   http://localhost:3000/api
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Main Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

#### Menu
- `GET /menu/categories` - Get all categories
- `GET /menu/items` - Get menu items (with search & filter)
- `GET /menu/items/:id` - Get item details

#### Cart
- `GET /cart` - Get user cart
- `POST /cart` - Add item to cart
- `PUT /cart/:id` - Update cart item
- `DELETE /cart/:id` - Remove from cart

#### Orders
- `POST /orders` - Place new order
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order details
- `PUT /orders/:id/cancel` - Cancel order

#### Reviews
- `POST /reviews` - Create review
- `GET /reviews/menu-item/:id` - Get item reviews

#### Admin (Protected)
- `GET /admin/dashboard` - Dashboard statistics
- `GET /admin/orders` - All orders
- `PUT /admin/orders/:id/status` - Update order status
- `GET /admin/reports/sales` - Sales report

For complete API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## 🔐 Default Admin Account

After running the schema, a default admin account is created:

- **Email**: `admin@foodplatform.com`
- **Password**: `Admin@123`

⚠️ **Important**: Change this password immediately in production!

## 🎯 Order Status Flow

```
pending → confirmed → preparing → on_the_way → delivered
   ↓          ↓           ↓
cancelled  cancelled  cancelled
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- SQL injection protection (parameterized queries)
- Input validation on all endpoints
- CORS configuration
- Secure HTTP headers

## 🧪 Testing

### Test health endpoint
```bash
curl http://localhost:3000/health
```

### Register a user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234",
    "full_name": "Test User",
    "phone": "+1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234"
  }'
```



## 📊 Database Schema

The platform uses a normalized MySQL database with the following main tables:

- **users** - User accounts and authentication
- **menu_items** - Food items with pricing and details
- **cart_items** - Shopping cart contents
- **orders** - Order information and status
- **order_items** - Items in each order
- **order_status_history** - Order tracking timeline


## 🌟 Key Highlights

- ✅ **Production-Ready** - Built with best practices and security in mind
- ✅ **Scalable Architecture** - Clean separation of concerns
- ✅ **Well-Documented** - Comprehensive API and setup guides
- ✅ **Transaction Support** - ACID compliance for critical operations
- ✅ **Real-Time Tracking** - Order status updates
- ✅ **Admin Dashboard** - Complete business analytics
- ✅ **Role-Based Access** - Customer, Admin, Restaurant Owner roles

## 📖 Additional Documentation

- [Setup Guide](SETUP_GUIDE.md) - Detailed installation instructions
- [API Documentation](API_DOCUMENTATION.md) - Complete API reference
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Production deployment
- [Frontend Integration](FRONTEND_GUIDE.md) - Frontend development guide
- [Quick Reference](QUICK_REFERENCE.md) - Cheat sheet and common tasks


## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Express.js team for the excellent web framework
- MySQL community for the reliable database
- All open-source contributors


---

**Built with ❤️ for small restaurants to thrive in the digital world**
