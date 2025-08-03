/** Movies API Routes
 *
 * This module handles movie management endpoints for the Vidly application.
 * It provides CRUD operations for movies with genre relationships.
 *
 * Routes:
 * GET    /api/movies     - Get all movies
 * POST   /api/movies     - Create a new movie
 * PUT    /api/movies/:id - Update a movie by ID
 * DELETE /api/movies/:id - Delete a movie by ID
 * GET    /api/movies/:id - Get a movie by ID
 */

const { Movie, validate } = require("../models/movie");
const Joi = require("joi");
const mongoose = require("mongoose");
const express = require("express");
const { Genre } = require("../models/genre");
const router = express.Router();

/** GET /api/movies
 * Returns all movies sorted by name
 *
 * Returns:
 * - 200: Array of movie objects
 */
router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});

/** POST /api/movies
 * Creates a new movie
 *
 * Request body:
 * - title: Movie title
 * - genreId: ID of the movie's genre
 * - numberInStock: Number of copies available
 * - dailyRentalRate: Rental rate per day
 *
 * Returns:
 * - 400: Invalid request data or invalid genre
 * - 200: Created movie object
 */
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  await movie.save();

  res.send(movie);
});

/** PUT /api/movies/:id
 * Updates an existing movie
 *
 * Request body:
 * - title: Movie title
 * - genreId: ID of the movie's genre
 * - numberInStock: Number of copies available
 * - dailyRentalRate: Rental rate per day
 *
 * Returns:
 * - 400: Invalid request data or invalid genre
 * - 404: Movie not found
 * - 200: Updated movie object
 */
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

/** DELETE /api/movies/:id
 * Deletes a movie by ID
 *
 * Returns:
 * - 404: Movie not found
 * - 200: Deleted movie object
 */
router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

/** GET /api/movies/:id
 * Returns a single movie by ID
 *
 * Returns:
 * - 404: Movie not found
 * - 200: Movie object
 */
router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

module.exports = router;
