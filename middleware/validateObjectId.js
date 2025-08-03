/**
 * MongoDB ObjectId Validation Middleware
 *
 * This middleware validates that the 'id' parameter in the request URL
 * is a valid MongoDB ObjectId format. It's used to prevent invalid ID
 * queries to the database and provide consistent error responses.
 *
 * Behavior:
 * - Checks if req.params.id is a valid MongoDB ObjectId
 * - Returns 404 if the ID format is invalid
 * - Calls next() if the ID format is valid
 */
const mongoose = require("mongoose");

module.exports = function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("Invalid ID.");

  next();
};
