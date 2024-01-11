import express from "express";
import {
  createCart,
  getCart,
  addProductToCart,
} from "../controllers/carts.controller.js";

const cartRouter = express.Router();

cartRouter.post("/", createCart);

cartRouter.get("/:cid", getCart);

cartRouter.post("/:cid/product/:pid", addProductToCart);

export { cartRouter };
