import express from "express";
import ProductManager from "../ProductManager.js";
const productManager = new ProductManager();

const viewRouter = express.Router();

viewRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    res.render("index", { layout: "home", products: products });
  } catch (err) {
    console.error(`Error reading products file: ${err}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

viewRouter.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    res.render("index", { layout: "realTimeProducts", products: products });
  } catch (err) {
    console.error(`Error reading products file: ${err}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export { viewRouter };
