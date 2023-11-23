import express from "express";
import { io } from "../app.js";
import ProductDbManager from "../dao/ProductDbManager.js";
import Products from "../models/products.model.js";

const productRouter = express.Router();
const productDbManager = new ProductDbManager();

productRouter.get("/", async (req, res) => {
  const { limit } = req.query;

  try {
    const products = await productDbManager.getProductsFromDb();

    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      res.status(200).json({ products: limitedProducts });
    } else {
      res.status(200).json({ products });
    }
  } catch (err) {
    console.error(`Error reading products from database: ${err}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

productRouter.get("/:pid", async (req, res) => {
  try {
    const obtainedProduct = await Products.findById(req.params.pid);

    if (obtainedProduct) {
      res.status(200).json({ product: obtainedProduct });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error(`Error reading products file: ${err}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

productRouter.post("/", async (req, res) => {
  const { title, description, code, price, status, stock, category } = req.body;

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !status ||
    !stock ||
    !category
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingProduct = await Products.findOne({ code });
  if (existingProduct) {
    return res.status(400).json({ message: "The code is already in use" });
  }

  const products = new Products(req.body);

  try {
    const newProduct = await products.save();

    io.emit("productAdded", newProduct);

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(`Error adding product: ${err}`);
    res.status(500).json({ message: "Error adding product" });
  }
});

productRouter.put("/:pid", async (req, res) => {
  try {
    const productToUpdate = await Products.findOneAndUpdate(
      { _id: req.params.pid },
      req.body,
      { new: true }
    );

    if (!productToUpdate) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json(productToUpdate);
    }
  } catch (err) {
    console.error(`Error updating product: ${err}`);
    res.status(500).json({ message: "Error updating product" });
  }
});

productRouter.delete("/:pid", async (req, res) => {
  try {
    const productToDelete = await Products.findByIdAndDelete(req.params.pid);

    if (!productToDelete) {
      res.status(404).json({ message: "Product not found" });
    } else {
      io.emit("Product deleted", productToDelete);

      res.status(204).json({ message: "Product deleted" });
    }
  } catch (err) {
    console.error(`Error deleting product: ${err}`);
    res.status(500).json({ message: "Error deleting product" });
  }
});

export { productRouter };
