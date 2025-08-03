# rest-API

A RESTful API built with Node.js, Express, and MongoDB for a video rental service (Vidly).

## Features

- User authentication and authorization with JWT
- Customer management
- Movie and genre management
- Rental system
- Input validation
- Error handling middleware
- Comprehensive test suite

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Jest for testing
- Supertest for API testing

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   - Create a `.env` file or set environment variables
   - Set `vidly_jwtPrivateKey` for JWT signing
   - Configure MongoDB connection string

3. Run the application:

   ```bash
   npm start
   ```

4. Run tests:
   ```bash
   npm test
   ```

## API Endpoints

- `/api/users` - User registration and management
- `/api/auth` - User authentication
- `/api/customers` - Customer management
- `/api/movies` - Movie management
- `/api/genres` - Genre management
- `/api/rentals` - Rental management
