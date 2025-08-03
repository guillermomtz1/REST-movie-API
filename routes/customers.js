/** Customers API Routes
 *
 * This module handles customer management endpoints for the Vidly application.
 * It provides CRUD operations for customer profiles.
 *
 * Routes:
 * GET    /api/customers     - Get all customers
 * POST   /api/customers     - Create a new customer
 * PUT    /api/customers/:id - Update a customer by ID
 * DELETE /api/customers/:id - Delete a customer by ID
 * GET    /api/customers/:id - Get a customer by ID
 */
const { Customer, validate } = require("../models/customer");
const Joi = require("joi");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

/** GET /api/customers
 * Returns all customers
 *
 * Returns:
 * - 200: Array of customer objects
 */
router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

/** POST /api/customers
 * Creates a new customer
 *
 * Request body:
 * - name: Customer's full name
 * - isGold: Whether customer has gold membership
 * - phone: Customer's phone number
 *
 * Returns:
 * - 400: Invalid request data
 * - 200: Created customer object
 */
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });

  customer = await customer.save();
  res.send(customer);
});

/** PUT /api/customers/:id
 * Updates an existing customer
 *
 * Request body:
 * - name: Customer's full name
 * - isGold: Whether customer has gold membership
 * - phone: Customer's phone number
 *
 * Returns:
 * - 400: Invalid request data
 * - 404: Customer not found
 * - 200: Updated customer object
 */
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    },
    { new: true }
  );

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

/** DELETE /api/customers/:id
 * Deletes a customer by ID
 *
 * Returns:
 * - 404: Customer not found
 * - 200: Deleted customer object
 */
router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

/** GET /api/customers/:id
 * Returns a single customer by ID
 *
 * Returns:
 * - 404: Customer not found
 * - 200: Customer object
 */
router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

module.exports = router;
