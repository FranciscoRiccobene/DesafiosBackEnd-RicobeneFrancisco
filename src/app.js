import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
const port = 8080;
const productManager = new ProductManager();

app.get("/products", async (req, res) => {
  const limit = req.query.limit;
  try {
    const products = await productManager.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      res.status(200).json({ products: limitedProducts });
    } else {
      res.status(200).json({ products });
    }
  } catch (error) {
    console.error(`Error reading products file: ${error}`);
    res.status(500).json({ message: "Internal Serve Error" });
  }
});

app.get("/products/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const product = await productManager.getProductById(productId);
    
    if (product) {
      res.status(200).json({ product: product });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(`Error reading products file: ${error}`);
    res.status(500).json({ message: "Internal Serve Error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
