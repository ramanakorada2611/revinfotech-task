# Blog API Application

A secure and optimized blog API application built with Node.js, Express, and MongoDB.

## Features

- JWT-based authentication with refresh token mechanism
- Blog post management (CRUD operations)
- Pagination for efficient data retrieval
- Automatic deletion of old blogs (older than 1 year)
- Comprehensive error handling and logging
- Rate limiting for API protection
- Security best practices implementation
- global error middleware
- joi validation
- schema validation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   #PORT
   PORT=3001
   ```

#ENVIRONMENT
NODE_ENV=development

#MONGODB_URL
MONGODB_URL=mongodb://localhost:27017/revinfotech-api

#JWT_CREDENTAILS

JWT_SECRET_KEY=rev-info-tech-key
JWT_REFRESH_SECRET_KEY=rev-info-tech-key-for-refresh
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=30d

````

## Running the Application

Development mode:
```bash
npm run dev
````

Production mode:

```bash
npm start
```

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register a new user

  ```json
  {
    "username": "user123",
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- POST `/api/auth/login` - Login user

  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- POST `/api/auth/refresh-token` - Refresh access token
  ```json
  {
    "refreshToken": "your-refresh-token"
  }
  ```

### Blogs

- GET `/api/blogs/get-blogs` - Get all blogs (paginated) (requires authentication)

  - Query parameters:
    - page (default: 1)
    - limit (default: 10)

- GET `/api/blogs/get-blog/:id` - Get a specific blog (requires authentication)

- POST `/api/blogs/create-blog` - Create a new blog (requires authentication)

  ```json
  {
    "title": "Blog Title",
    "content": "Blog content goes here..."
  }
  ```

- PUT `/api/blogs/update-blog/:id` - Update a blog (requires authentication)

  ```json
  {
    "title": "Updated Title",
    "content": "Updated content..."
  }
  ```

- DELETE `/api/update-blog/:id` - Delete a blog (requires authentication)

## Security Features

- JWT-based authentication
- Password hashing using bcrypt
- Rate limiting
- Helmet security headers
- CORS protection
- Input validation
- Error logging

## Error Handling

All errors are logged to:

- `logs/error.log` - For error-level logs
- `logs/combined.log` - For all logs

## Testing

Run tests using:

```bash
npm test
```

## License

MIT
