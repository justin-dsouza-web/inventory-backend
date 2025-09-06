const express = require("express");
const Product = require("../Models/Product");

const router = express.Router();

// ✅ Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add new product
router.post("/", async (req, res) => {
  console.log("📩 Received POST request:", req.body); // log incoming data
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete product
router.delete("/:id", async (req, res) => {
  console.log("🗑️ Deleting product:", req.params.id);
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
