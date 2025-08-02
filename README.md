# Blog API with Authentication

A complete RESTful API for a blog platform with user authentication, JWT token-based security, and full CRUD operations for blogs with voting functionality.

## 🚀 Features

- **User Authentication** with JWT tokens
- **User Registration & Login** with validation
- **Blog CRUD Operations** (Create, Read, Update, Delete)
- **Blog Voting System** (Upvote/Downvote)
- **Protected Routes** - All blog operations require authentication
- **Comprehensive Validation** for all inputs
- **MongoDB Integration** with Mongoose ODM
- **Error Handling** with proper HTTP status codes
- **API Documentation** built into the application

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Environment:** dotenv
- **Development:** nodemon

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd api
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
Create a `.env` file in the root directory:
```env
PORT=3000
MONGOOSE_DB_URL=mongodb://localhost:27017/your_database_name
JWT_SECRETKEY=your_super_secret_jwt_key_here_make_it_long_and_random
```

4. **Start the server:**
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication
All blog operations require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

### 1. Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "profile_url": "https://example.com/profile.jpg",
  "gender": "male",
  "address": "123 Main St",
  "username": "john_doe"
}
```

**Response (201):**
```json
{
  "status": true,
  "message": "User created successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "profile_url": "https://example.com/profile.jpg",
    "gender": "male",
    "address": "123 Main St",
    "username": "john_doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "profile_url": "https://example.com/profile.jpg",
    "gender": "male",
    "address": "123 Main St",
    "username": "john_doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Blog Endpoints

#### Get All Blogs
```http
GET /api/v1/blog
Authorization: Bearer <your_token>
```

**Response (200):**
```json
{
  "status": true,
  "message": "Blogs retrieved successfully",
  "data": [
    {
      "_id": "...",
      "title": "My First Blog",
      "description": "This is my first blog post...",
      "author": {
        "_id": "...",
        "name": "John Doe",
        "email": "john@example.com",
        "username": "john_doe"
      },
      "upvotes": 5,
      "downvotes": 1,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Get Blog by ID
```http
GET /api/v1/blog/:id
Authorization: Bearer <your_token>
```

#### Get Blogs by Author
```http
GET /api/v1/blog/author/:authorId
Authorization: Bearer <your_token>
```

#### Create Blog
```http
POST /api/v1/blog
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "My First Blog Post",
  "description": "This is the content of my first blog post. It can be as long as you want."
}
```

**Response (201):**
```json
{
  "status": true,
  "message": "Blog created successfully",
  "data": {
    "_id": "...",
    "title": "My First Blog Post",
    "description": "This is the content of my first blog post...",
    "author": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "username": "john_doe"
    },
    "upvotes": 0,
    "downvotes": 0,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Update Blog
```http
PUT /api/v1/blog/:id
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "Updated Blog Title",
  "description": "Updated blog content..."
}
```

**Note:** Only the author can update their own blogs.

#### Delete Blog
```http
DELETE /api/v1/blog/:id
Authorization: Bearer <your_token>
```

**Note:** Only the author can delete their own blogs.

#### Upvote Blog
```http
POST /api/v1/blog/:id/upvote
Authorization: Bearer <your_token>
```

#### Downvote Blog
```http
POST /api/v1/blog/:id/downvote
Authorization: Bearer <your_token>
```

### 3. User Endpoints

#### Get All Users (excluding current user)
```http
GET /api/v1/user
Authorization: Bearer <your_token>
```

## 📊 Data Models

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  profile_url: String (required, valid URL),
  gender: String (required, enum: ["male", "female"]),
  address: String (required),
  username: String (required, unique, 3-20 chars, alphanumeric + underscore),
  timestamps: { createdAt, updatedAt }
}
```

### Blog Schema
```javascript
{
  title: String (required, max 200 chars),
  author: ObjectId (required, ref: "User"),
  description: String (required),
  upvotes: Number (default: 0),
  downvotes: Number (default: 0),
  timestamps: { createdAt, updatedAt }
}
```

## 🔐 Authentication & Authorization

### JWT Token Structure
```javascript
{
  UserId: "user_mongodb_id",
  iat: timestamp,
  exp: timestamp (5 days)
}
```

### Protected Routes
All blog operations require authentication:
- GET `/api/v1/blog` - Get all blogs
- GET `/api/v1/blog/:id` - Get specific blog
- GET `/api/v1/blog/author/:authorId` - Get blogs by author
- POST `/api/v1/blog` - Create blog
- PUT `/api/v1/blog/:id` - Update blog (author only)
- DELETE `/api/v1/blog/:id` - Delete blog (author only)
- POST `/api/v1/blog/:id/upvote` - Upvote blog
- POST `/api/v1/blog/:id/downvote` - Downvote blog

## ✅ Validation Rules

### User Registration
- **name:** Required
- **email:** Required, valid email format, unique
- **password:** Required, minimum 6 characters
- **profile_url:** Required, valid URL format
- **gender:** Required, must be "male" or "female"
- **address:** Required
- **username:** Required, 3-20 characters, alphanumeric and underscore only, unique

### Blog Creation/Update
- **title:** Required, maximum 200 characters
- **description:** Required

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "status": false,
  "message": "Title is required"
}
```

### 401 Unauthorized
```json
{
  "status": false,
  "message": "not authenticated"
}
```

### 403 Forbidden
```json
{
  "status": false,
  "message": "You can only update your own blogs"
}
```

### 404 Not Found
```json
{
  "status": false,
  "message": "Blog not found"
}
```

### 500 Internal Server Error
```json
{
  "status": false,
  "message": "Internal server error"
}
```

## 🧪 Testing

### Using Postman
1. Set base URL: `http://localhost:3000/api/v1`
2. For protected routes, add header: `Authorization: Bearer <token>`
3. For POST/PUT requests, set `Content-Type: application/json`

### Using cURL
```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'

# Create blog (use token from login response)
curl -X POST http://localhost:3000/api/v1/blog \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{"title": "My Blog", "description": "Blog content"}'
```

## 📁 Project Structure

```
api/
├── backend/
│   ├── controller/
│   │   ├── auth.controller.js
│   │   ├── blog.controller.js
│   │   └── user.controller.js
│   ├── DB/
│   │   └── mongodb.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── user.module.js
│   │   └── blog.module.js
│   ├── route/
│   │   ├── auth.route.js
│   │   ├── blog.route.js
│   │   └── user.route.js
│   └── utility/
│       └── token.js
├── backend.js
├── package.json
└── README.md
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGOOSE_DB_URL=mongodb://localhost:27017/your_database_name
JWT_SECRETKEY=your_super_secret_jwt_key_here_make_it_long_and_random
```

## 🚀 Available Scripts

```bash
npm run dev    # Start development server with nodemon
npm start      # Start production server
```

## 📝 API Documentation Endpoint

Access the complete API documentation at:
```
GET http://localhost:3000/api/v1/blog/faq
```

This endpoint provides detailed documentation including:
- All endpoint descriptions
- Request/response examples
- Error codes and messages
- Authentication requirements
- Testing tips

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

---

**Note:** This API requires authentication for all blog operations. Make sure to login first to get a JWT token before accessing any blog endpoints. 