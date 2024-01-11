import express from "express";
import {
  productsView,
  realTimeProductsView,
} from "../controllers/views.controller.js";

const viewRouter = express.Router();

viewRouter.get("/products", productsView);

viewRouter.get("/realtimeproducts", realTimeProductsView);

export { viewRouter };
