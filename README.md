# Travel Tour Booking Website

A production-ready, full-featured travel tour booking website built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🚀 Features

### Public Features
- **Home Page**: Hero section with destination search, featured tours, testimonials
- **Destinations**: Browse destinations with filters and search
- **Tours**: Advanced filtering, sorting, and pagination
- **Tour Details**: Complete tour information with itinerary, reviews, and booking
- **Contact**: Contact form and company information

### User Features
- **Authentication**: Register, login, forgot password, email verification
- **Dashboard**: View bookings, wishlist, and statistics
- **Bookings**: Create, view, and cancel bookings
- **Wishlist**: Save favorite tours
- **Profile**: Update user profile information
- **Reviews**: Leave reviews and ratings for tours

### Admin Features
- **Dashboard**: Analytics and statistics
- **Tour Management**: Create, edit, delete tours
- **Destination Management**: Manage destinations
- **Booking Management**: View and update booking statuses
- **User Management**: Manage users and roles

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- React Query (data fetching)
- React Router DOM (routing)
- React Hot Toast (notifications)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (image uploads)
- Razorpay (payments)
- Nodemailer (email notifications)

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Cloudinary account (for image uploads)
- Razorpay account (for payments)
- Email service (Gmail or similar for Nodemailer)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the `server` directory with the following configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/travel_tour

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay Configuration (for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@traveltour.com

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Admin Initial Credentials (change after first login)
ADMIN_EMAIL=admin@traveltour.com
ADMIN_PASSWORD=Admin@123
```

**Note:** Replace all placeholder values with your actual credentials.

5. Start the server:
```bash
npm run dev
```

6. Initialize admin user (first time only):
```bash
# Using curl:
curl -X POST http://localhost:5000/api/admin/init

# Or use Postman/Thunder Client
# POST http://localhost:5000/api/admin/init
```

**Important:** After initialization, change the admin password from the admin panel!

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the `client` directory:
```env
# API Base URL
VITE_API_URL=http://localhost:5000/api

# Razorpay Key (for frontend payment integration)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

**Note:** Use the same Razorpay Key ID as in the server `.env` file.

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
Travel_Tour/
├── server/
│   ├── controllers/     # Route controllers
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   └── server.js       # Entry point
├── client/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── lib/        # Utilities
│   │   └── App.tsx     # Main app component
│   └── package.json
└── README.md
```

## 🔐 Default Admin Credentials

After initializing the admin user:
- Email: `admin@traveltour.com` (or as set in `.env`)
- Password: `Admin@123` (or as set in `.env`)

**⚠️ Important**: Change these credentials after first login!

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in your production `.env`
2. Update `MONGODB_URI` to your production database
3. Update `FRONTEND_URL` to your production frontend URL
4. Deploy to platforms like Heroku, Railway, or AWS

### Frontend Deployment
1. Build the production bundle:
```bash
npm run build
```

2. Deploy the `dist` folder to platforms like:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email

### Tours
- `GET /api/tours` - Get all tours (with filters: search, destination, minPrice, maxPrice, duration, difficulty, sort, featured)
- `GET /api/tours/:id` - Get single tour
- `GET /api/tours/slug/:slug` - Get tour by slug
- `GET /api/tours/featured` - Get featured tours
- `POST /api/tours` - Create tour (Admin)
- `PUT /api/tours/:id` - Update tour (Admin)
- `DELETE /api/tours/:id` - Delete tour (Admin)

### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get single destination
- `POST /api/destinations` - Create destination (Admin)
- `PUT /api/destinations/:id` - Update destination (Admin)
- `DELETE /api/destinations/:id` - Delete destination (Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings` - Get all bookings (Admin)
- `PUT /api/bookings/:id/status` - Update booking status (Admin)

### Payments
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/:id` - Get payment details

### Coupons
- `POST /api/coupons/validate` - Validate coupon code
- `GET /api/coupons` - Get all coupons (Admin)
- `POST /api/coupons` - Create coupon (Admin)
- `PUT /api/coupons/:id` - Update coupon (Admin)
- `DELETE /api/coupons/:id` - Delete coupon (Admin)

### Reviews
- `GET /api/reviews/tour/:tourId` - Get reviews for a tour
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/wishlist` - Get user wishlist
- `POST /api/users/wishlist/:tourId` - Add to wishlist
- `DELETE /api/users/wishlist/:tourId` - Remove from wishlist

### Admin
- `POST /api/admin/init` - Initialize admin user (first time only)
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

## 🚀 Advanced Features

✅ **Search & Filtering**
- Advanced search with debounce
- Filter by destination, price range, duration, difficulty
- Sort by price, rating, date
- Pagination support

✅ **Coupon System**
- Create and manage coupon codes
- Percentage and fixed amount discounts
- Usage limits and validity periods
- Tour-specific coupons

✅ **Payment Integration**
- Razorpay payment gateway
- Secure payment processing
- Payment verification
- Booking confirmation emails

✅ **User Features**
- JWT-based authentication
- Email verification
- Password reset functionality
- Wishlist management
- Booking history
- Review and rating system

✅ **Admin Panel**
- Comprehensive dashboard with analytics
- Tour management (CRUD operations)
- Destination management
- Booking management
- User management
- Coupon management
- Image uploads via Cloudinary

## 🎨 UI/UX Features

- Modern, premium travel UI
- Smooth page transitions with Framer Motion
- Glassmorphism effects
- Fully responsive design
- Skeleton loaders
- Toast notifications
- SEO-optimized pages

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- XSS protection
- MongoDB injection protection
- Helmet.js security headers

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, email info@traveltour.com or open an issue in the repository.

---

**Built with ❤️ using the MERN Stack**

