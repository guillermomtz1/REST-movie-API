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

## API Documentation

### Base URL

```
http://localhost:3000
```

### Authentication

Most endpoints require a JWT token in the request header:

```
x-auth-token: YOUR_JWT_TOKEN_HERE
```

To get a token, login with:

```
POST /api/auth
```

---

## Users

### Register a New User

**POST** `/api/users`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Headers:** `x-auth-token` will be included in response

### Login

**POST** `/api/auth`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Headers:** `x-auth-token` will be included in response

---

## Customers

### Create a New Customer

**POST** `/api/customers`

**Request Body:**

```json
{
  "name": "Jane Smith",
  "phone": 1234567890,
  "isGold": false
}
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Jane Smith",
  "phone": 1234567890,
  "isGold": false
}
```

### Get All Customers

**GET** `/api/customers`

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith",
    "phone": 1234567890,
    "isGold": false
  }
]
```

---

## Genres

### Create a New Genre

**POST** `/api/genres`
**Requires:** Authentication

**Headers:**

```
x-auth-token: YOUR_JWT_TOKEN
```

**Request Body:**

```json
{
  "name": "Action"
}
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Action"
}
```

### Get All Genres

**GET** `/api/genres`

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Action"
  },
  {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Comedy"
  }
]
```

### Delete a Genre

**DELETE** `/api/genres/:id`
**Requires:** Authentication + Admin privileges

**Headers:**

```
x-auth-token: YOUR_ADMIN_JWT_TOKEN
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Action"
}
```

---

## Movies

### Create a New Movie

**POST** `/api/movies`

**Request Body:**

```json
{
  "title": "The Matrix",
  "genreId": "507f1f77bcf86cd799439013",
  "numberInStock": 10,
  "dailyRentalRate": 2
}
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439015",
  "title": "The Matrix",
  "genre": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Action"
  },
  "numberInStock": 10,
  "dailyRentalRate": 2
}
```

### Get All Movies

**GET** `/api/movies`

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "title": "The Matrix",
    "genre": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Action"
    },
    "numberInStock": 10,
    "dailyRentalRate": 2
  }
]
```

---

## Rentals

### Create a New Rental

**POST** `/api/rentals`

**Request Body:**

```json
{
  "customerId": "507f1f77bcf86cd799439012",
  "movieId": "507f1f77bcf86cd799439015"
}
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439016",
  "customer": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith",
    "isGold": false,
    "phone": 1234567890
  },
  "movie": {
    "_id": "507f1f77bcf86cd799439015",
    "title": "The Matrix",
    "dailyRentalRate": 2
  },
  "dateOut": "2024-01-15T10:30:00.000Z",
  "returnDate": null,
  "rentalFee": null
}
```

### Get All Rentals

**GET** `/api/rentals`

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439016",
    "customer": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "isGold": false,
      "phone": 1234567890
    },
    "movie": {
      "_id": "507f1f77bcf86cd799439015",
      "title": "The Matrix",
      "dailyRentalRate": 2
    },
    "dateOut": "2024-01-15T10:30:00.000Z",
    "returnDate": null,
    "rentalFee": null
  }
]
```

---

## Error Responses

### Validation Error (400)

```json
{
  "error": "Invalid input data"
}
```

### Authentication Error (401)

```
Access denied.
```

### Authorization Error (403)

```
Access denied.
```

### Not Found Error (404)

```
The resource with the given ID was not found.
```

---

## Complete Workflow Example

1. **Register a user:**

   ```bash
   POST /api/users
   {
     "name": "Admin User",
     "email": "admin@vidly.com",
     "password": "password123"
   }
   ```

2. **Login to get token:**

   ```bash
   POST /api/auth
   {
     "email": "admin@vidly.com",
     "password": "password123"
   }
   ```

3. **Create a genre (requires token):**

   ```bash
   POST /api/genres
   Headers: x-auth-token: YOUR_TOKEN
   {
     "name": "Action"
   }
   ```

4. **Create a customer:**

   ```bash
   POST /api/customers
   {
     "name": "John Doe",
     "phone": 1234567890,
     "isGold": false
   }
   ```

5. **Create a movie:**

   ```bash
   POST /api/movies
   {
     "title": "The Matrix",
     "genreId": "GENRE_ID_FROM_STEP_3",
     "numberInStock": 10,
     "dailyRentalRate": 2
   }
   ```

6. **Create a rental:**
   ```bash
   POST /api/rentals
   {
     "customerId": "CUSTOMER_ID_FROM_STEP_4",
     "movieId": "MOVIE_ID_FROM_STEP_5"
   }
   ```

## API Endpoints

- `/api/users` - User registration and management
- `/api/auth` - User authentication
- `/api/customers` - Customer management
- `/api/movies` - Movie management
- `/api/genres` - Genre management
- `/api/rentals` - Rental management
