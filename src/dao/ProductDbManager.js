import Products from "../models/products.model.js";

class ProductDbManager {
  async getProductsFromDb() {
    try {
      const products = await Products.find({ isVisible: true });
      return products;
    } catch (err) {
      console.error("Error finding products from database", err);
    }
  }
}

export default ProductDbManager;
