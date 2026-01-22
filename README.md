# MEAN Blog Application

Full-stack blog application built with the MEAN stack (MongoDB, Express, Angular, Node.js) featuring authentication, authorization, and complete CRUD operations.

## 🚀 Features

### Authentication & Authorization
- ✅ User registration and login system
- ✅ JWT-based authentication
- ✅ Protected routes with Auth Guards
- ✅ HTTP Interceptor for automatic token injection
- ✅ Session management

### Blog Functionality
- ✅ View all blog posts
- ✅ View detailed post information
- ✅ Add new posts (authenticated users only)
- ✅ Search and filter posts
- ✅ Post categorization (General, Technology, Travel, Food, Lifestyle, Business, Health, Education)
- ✅ Pagination support
- ✅ Image support for posts

### Additional Features
- ✅ Responsive design with Bootstrap 5
- ✅ Dark/Light theme toggle
- ✅ Comments system
- ✅ Rating system
- ✅ Favorites functionality
- ✅ Lazy loading of components for better performance
- ✅ Custom pipes and directives

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance
- Modern web browser

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/mean-blog-app.git
cd mean-blog-app
```

### 2. Backend Setup (Node.js/Express)

```bash
cd mean-app
npm install
```

Configure your MongoDB connection in `lib/config.ts`:

```typescript
export const config = {
    port: process.env.PORT || 3000,
    databaseUrl: process.env.MONGODB_URI || 'your-mongodb-connection-string',
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret'
};
```

Start the backend server:

```bash
npm start
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup (Angular)

```bash
cd ../angular
npm install
```

Install JWT library if not already installed:

```bash
npm install --save @auth0/angular-jwt
```

Start the Angular development server:

```bash
npm start
```

The frontend will run on `http://localhost:4200`

## 🎯 Usage

1. **Register a new account**: Navigate to `/signup` and create a new user account
2. **Login**: Use your credentials to log in at `/login`
3. **Browse posts**: View all blog posts at `/blog` (requires authentication)
4. **Add a post**: Click "Dodaj post" in the navbar to create a new blog post
5. **View post details**: Click on any post to see full details

## 📁 Project Structure

```
mean-blog-app/
├── angular/                  # Frontend (Angular)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # UI Components
│   │   │   │   ├── home/
│   │   │   │   ├── login/
│   │   │   │   ├── signup/
│   │   │   │   ├── navbar/
│   │   │   │   ├── blog/
│   │   │   │   ├── blog-home/
│   │   │   │   ├── blog-item/
│   │   │   │   ├── blog-item-details/
│   │   │   │   ├── add-post/
│   │   │   │   └── ...
│   │   │   ├── services/    # Services (API calls, Auth)
│   │   │   ├── guards/      # Route guards
│   │   │   ├── interceptors/ # HTTP interceptors
│   │   │   ├── models/      # TypeScript interfaces
│   │   │   ├── pipes/       # Custom pipes
│   │   │   └── directives/  # Custom directives
│   │   └── ...
│   └── ...
│
└── mean-app/                 # Backend (Node.js/Express)
    ├── lib/
    │   ├── app.ts           # Express app configuration
    │   ├── config.ts        # Configuration settings
    │   ├── index.ts         # Server entry point
    │   ├── interfaces/      # TypeScript interfaces
    │   ├── middlewares/     # Express middlewares
    │   └── modules/
    │       ├── controllers/ # Route controllers
    │       ├── models/      # Data models
    │       ├── schemas/     # MongoDB schemas
    │       └── services/    # Business logic
    └── ...
```

## 🔑 API Endpoints

### Authentication
- `POST /api/user/auth` - Login user
- `POST /api/user/create` - Register new user
- `DELETE /api/user/logout/:id` - Logout user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create new post (requires authentication)
- `DELETE /api/posts/:id` - Delete post
- `DELETE /api/posts/all` - Delete all posts

## 🎨 Technologies Used

### Frontend
- **Angular 18** - Frontend framework
- **TypeScript** - Programming language
- **Bootstrap 5** - CSS framework
- **RxJS** - Reactive programming
- **@auth0/angular-jwt** - JWT handling

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Programming language
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes
- HTTP-only cookies (optional)
- XSS protection
- CORS configuration

## 📝 Lab 12 Implementation Details

This project implements all requirements from **Laboratorium 12**:

### Core Requirements ✅
1. ✅ Home page component with routing
2. ✅ Authentication service with JWT
3. ✅ Auth Guard implementation
4. ✅ HTTP Interceptor for token injection
5. ✅ Login component with error handling
6. ✅ Signup/Registration component
7. ✅ Navbar with conditional rendering
8. ✅ Lazy loading of all components

### Add Post Feature ✅
- ✅ Add post component generated
- ✅ Form with title, content, and image URL fields
- ✅ POST method in DataService
- ✅ Lazy loading routing
- ✅ "Dodaj post" button in navbar
- ✅ Auth Guard protection
- ✅ Conditional button visibility
- ✅ Backend endpoint for creating posts

### Additional Feature ✅
- ✅ **Post Categories**: Added dropdown selector for post categories (General, Technology, Travel, Food, Lifestyle, Business, Health, Education)
- ✅ Backend schema updated to support categories
- ✅ Category field stored in MongoDB
- ✅ Default category applied if not specified

## 🧪 Testing

Run frontend tests:
```bash
cd angular
npm test
```

Run backend tests:
```bash
cd mean-app
npm test
```

## 🚀 Deployment

### Frontend
The Angular app can be deployed to:
- Vercel
- Netlify
- Firebase Hosting
- GitHub Pages

Build for production:
```bash
cd angular
npm run build
```

### Backend
The Node.js backend can be deployed to:
- Heroku
- Railway
- Render
- DigitalOcean

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is created for educational purposes as part of the Web Application Technologies course.

## 👨‍💻 Author

**Kacper Szczudło**

## 🙏 Acknowledgments

- Web Application Technologies course materials
- Angular and Node.js documentation
- MongoDB Atlas for database hosting

## 📞 Support

For support, create an issue in the GitHub repository or contact the course instructor.

---

**Note**: This application was developed as part of Laboratory 12 for the Web Application Technologies course. Make sure to never commit sensitive information like database credentials or JWT secrets to version control.