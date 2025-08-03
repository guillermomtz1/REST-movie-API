/** Genres API Routes
 *
 * This module handles all genre-related HTTP endpoints for the Vidly application.
 * It provides CRUD operations for movie genres with proper validation and authorization.
 *
 * Routes:
 * GET    /api/genres     - Get all genres
 * POST   /api/genres     - Create a new genre (requires authentication)
 * PUT    /api/genres/:id - Update a genre by ID
 * DELETE /api/genres/:id - Delete a genre by ID (requires admin privileges)
 * GET    /api/genres/:id - Get a genre by ID
 */

const { Genre, validate } = require("../models/genre");
const Joi = require("joi");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// Import middleware for route protection
const authorization = require("../middleware/authorization");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

/** GET /api/genres
 * Returns all genres sorted by name
 * No authentication required
 */
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

/** POST /api/genres
 * Creates a new genre
 * Requires authentication (authorization middleware)
 * Validates genre name before saving
 */
router.post("/", authorization, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});

/** PUT /api/genres/:id
 * Updates an existing genre by ID
 * Validates the new genre name before updating
 * Returns 404 if genre not found
 */
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

/** DELETE /api/genres/:id
 * Deletes a genre by ID
 * Requires both authentication and admin privileges
 * Returns 404 if genre not found
 */
router.delete("/:id", [authorization, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

/** GET /api/genres/:id
 * Returns a single genre by ID
 * Returns:
 * - 404: If ID format is invalid (handled by validateObjectId middleware) or genre not found
 * - 200: Genre object if found
 *
 * Example Response (200):
 * {
 *   "_id": "507f1f77bcf86cd799439011",
 *   "name": "Action"
 * }
 */
router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

module.exports = router;
