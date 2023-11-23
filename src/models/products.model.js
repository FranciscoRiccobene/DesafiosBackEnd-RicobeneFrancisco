import mongoose from "mongoose";

const { Schema, model } = mongoose;
const productsCollection = "Products";

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true },
  stock: { type: Number, required: true },
  category: { type: String },
  thumbnails: { type: [String] },
  isVisible: { type: Boolean, default: true },
});

const Products = model(productsCollection, productSchema);

export default Products;
