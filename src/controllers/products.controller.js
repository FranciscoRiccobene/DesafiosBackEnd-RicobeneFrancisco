import Products from "../dao/models/products.model.js";
import { io } from "../app.js";
import ProductDbManager from "../dao/managers/ProductDbManager.js";

const productDbManager = new ProductDbManager();

export const getAllProducts = async (req, res) => {
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
};

export const getProduct = async (req, res) => {
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
};

export const createProduct = async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !status ||
    !stock ||
    !category ||
    !thumbnails
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
};

export const updateProduct = async (req, res) => {
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
};

export const deleteProduct = async (req, res) => {
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
};
