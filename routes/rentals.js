/** Rentals API Routes
 *
 * This module handles movie rental endpoints for the Vidly application.
 * It provides functionality for creating and managing movie rentals.
 *
 * Routes:
 * GET  /api/rentals     - Get all rentals
 * POST /api/rentals     - Create a new rental
 * GET  /api/rentals/:id - Get a rental by ID
 */

const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const Joi = require("joi");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

/** GET /api/rentals
 * Returns all rentals sorted by date out
 *
 * Returns:
 * - 200: Array of rental objects
 */
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

/** POST /api/rentals
 * Creates a new rental
 *
 * Request body:
 * - customerId: ID of the customer renting the movie
 * - movieId: ID of the movie being rented
 *
 * Returns:
 * - 400: Invalid request data, invalid customer/movie, or movie not in stock
 * - 200: Created rental object
 */
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer ID.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie ID.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  rental = await rental.save();
  movie.numberInStock--;
  await movie.save();
  res.send(rental);
});

/** GET /api/rentals/:id
 * Returns a single rental by ID
 *
 * Returns:
 * - 404: Rental not found
 * - 200: Rental object
 */
router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send("Rental not found.");

  res.send(rental);
});

module.exports = router;
