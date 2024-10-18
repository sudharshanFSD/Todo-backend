const express = require("express");
const Product = require("../models/Products");
const authMiddleware = require("../middleware/authMiddleware"); // Adjust the path as necessary

const router = express.Router();

// Create a new product
router.post("/products", authMiddleware, async (req, res) => {
  const { task, description } = req.body; // Expect task and description in request body
  try {
    const product = new Product({ task, description });
    await product.save();
    res.status(201).send(product); // Successfully created
  } catch (error) {
    res.status(400).send({ message: 'Error creating product', error }); // Bad request
  }
});

// Get all products
router.get("/products", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).send(products); // Successfully fetched
  } catch (error) {
    res.status(500).send({ message: 'Error fetching products', error }); // Server error
  }
});

// Update a product by id
router.put("/products/:id", authMiddleware, async (req, res) => {
  const { task, description } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { task, description },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!product) {
      return res.status(404).send({ message: 'Product not found' }); // Not found
    }
    res.status(200).send(product); // Successfully updated
  } catch (error) {
    res.status(400).send({ message: 'Error updating product', error }); // Bad request
  }
});

// Delete a product by id
router.delete("/products/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' }); // Not found
    }
    res.status(200).send({ message: 'Product deleted successfully' }); // Successfully deleted
  } catch (error) {
    res.status(500).send({ message: 'Error deleting product', error }); // Server error
  }
});

module.exports = router;
