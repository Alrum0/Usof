# USOF 

A full-featured platform for knowledge sharing and communication.

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Technologies](#technologies)
- [Features](#features)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)

## 🎯 About the Project

USOF is a platform for creating posts, comments, sharing experience and knowledge. Users can publish questions, answer them, vote for useful content, follow other users, and earn stars for activity.

## 🚀 Technologies

### Frontend
- **React 19** - UI library
- **Vite** - fast bundler and dev server
- **Redux Toolkit** - state management
- **React Router v7** - routing
- **Tailwind CSS v4** - styling
- **Framer Motion** - animations
- **Axios** - HTTP client
- **Emoji Picker React** - emoji picker

### Backend
- **Node.js** + **Express** - server framework
- **MySQL** - database
- **JWT** - authentication
- **Bcrypt** - password hashing
- **Nodemailer** - email sending
- **Sharp** - image processing
- **Express File Upload** - file uploads
- **Express Rate Limit** - request limiting

## ✨ Features

### Users
- 📝 Registration and authentication
- 🔐 Password recovery via email
- 👤 User profile with avatar
- ⭐ Stars system (buying and spending)
- 👥 User subscriptions
- 🚫 User blacklist

### Posts
- ✍️ Create posts with text, images, and location
- 🏷️ Post categories (multiple selection)
- 📷 Upload up to 4 images per post
- 👍 Likes and dislikes
- 🔄 Reposts
- ✏️ Edit and delete own posts
- 🔍 Search and filter posts

### Comments
- 💬 Comment on posts
- 💬 Reply to comments (nested comments)
- 👍 Like/dislike comments
- ✏️ Edit comments
- 🗑️ Delete comments

### Administration
- 👨‍💼 Admin panel
- 📊 User management
- 📋 Category management
- 🛡️ Content moderation

### UI/UX
- 📱 Fully responsive design (mobile-first)
- 🌙 Dark theme
- 🔔 Notifications
- 😊 Built-in emoji picker
- ⚡ Smooth animations and transitions
- 📍 Mobile navigation at bottom of screen

## 📦 Installation

### Requirements
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Step 1: Clone the repository
```bash
git clone https://github.com/Alrum0/Usof.git
cd Usof
```

### Step 2: Install dependencies

#### Root dependencies
```bash
npm install
```

#### Backend
```bash
cd Usof-backend
npm install
```

#### Frontend
```bash
cd ../Usof-frontend
npm install
```

### Step 3: Database setup

1. Create MySQL database:
```sql
CREATE DATABASE usof_db;
```

2. Import database schema:
```bash
cd Usof-backend
mysql -u your_username -p usof_db < db.sql
```

3. Run migrations (if needed):
```bash
mysql -u your_username -p usof_db < migration_add_parentId.sql
```

### Step 4: Configure environment variables

#### Backend (.env in Usof-backend/)
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=usof_db
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key

# Email settings
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# URL
CLIENT_URL=http://localhost:5173
```

#### Frontend (.env in Usof-frontend/)
```env
VITE_API_URL=http://localhost:5000
```

## 🎬 Running the Project

### Run Frontend and Backend simultaneously
From the root project folder:
```bash
npm run dev
```

### Run separately

#### Backend (port 5000)
```bash
cd Usof-backend
npm run dev
```

#### Frontend (port 5173)
```bash
cd Usof-frontend
npm run dev
```

Open browser: `http://localhost:5173`

## 📁 Project Structure

```
Usof/
├── Usof-backend/           # Backend Node.js/Express
│   ├── controllers/        # Request handling controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Middleware (auth, error handling)
│   ├── utils/             # Utilities (tokens, email)
│   ├── static/            # Static files (avatars, images)
│   ├── db.js              # Database connection
│   └── index.js           # Entry point
│
├── Usof-frontend/         # Frontend React
│   ├── src/
│   │   ├── assets/        # Images, icons
│   │   ├── components/    # React components
│   │   ├── pages/         # Pages
│   │   ├── store/         # Redux store
│   │   ├── http/          # API clients
│   │   ├── context/       # React Context
│   │   ├── utils/         # Utilities
│   │   └── App.jsx        # Main component
│   ├── public/            # Public files
│   └── index.html
│
├── package.json           # Root package.json
└── README.md             # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Registration
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/password-reset` - Password reset
- `POST /api/auth/password-reset/:token` - Confirm password reset
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users` - List of users
- `GET /api/users/:id` - User information
- `PATCH /api/users/avatar` - Update avatar
- `PATCH /api/users/:id` - Update profile
- `DELETE /api/users/:id` - Delete user

### Posts
- `GET /api/posts` - List of posts
- `GET /api/posts/:id` - Specific post
- `POST /api/posts` - Create post
- `PATCH /api/posts/:id` - Edit post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/:id/comments` - Post comments
- `POST /api/posts/:id/like` - Like/dislike post

### Comments
- `GET /api/comments/:id` - Specific comment
- `POST /api/comments` - Create comment
- `PATCH /api/comments/:id` - Edit comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/like` - Like/dislike comment

### Categories
- `GET /api/categories` - List of categories
- `GET /api/categories/:id` - Specific category
- `POST /api/categories` - Create category (admin)
- `PATCH /api/categories/:id` - Edit category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Stars
- `GET /api/stars` - Stars balance
- `POST /api/stars/buy` - Buy stars

## 🔐 Environment Variables

### Backend required variables:
- `PORT` - Server port
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - MySQL credentials
- `JWT_SECRET`, `JWT_REFRESH_SECRET` - JWT secret keys
- `EMAIL_USER`, `EMAIL_PASS` - Email for sending messages

### Frontend required variables:
- `VITE_API_URL` - Backend API URL

## 👥 User Roles

- **USER** - regular user
- **ADMIN** - administrator with full access

## 📝 License

ISC License

## 👨‍💻 Author

Created as a fullstack web application educational project.

---

**Note:** This is an educational project. Do not use in production without additional security configurations.
