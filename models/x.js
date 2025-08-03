/**
 *
 */
// /api/returns {customerId, movieId}
// This is the contract we are going to expose to the clients

// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 is movieId is not provided
// Return 404 if no rental found for this customer/movie
// Return 400 if rental already processed

// Return 200 if valid request
// Set the return date
// Calculate the rental fee
// Increase the stock
// Return the renatl
