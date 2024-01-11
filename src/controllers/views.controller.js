import Products from "../dao/models/products.model.js";

export const productsView = async (req, res) => {
  try {
    const products = await Products.find({ isVisible: true }).lean();

    const data = {
      layout: "products",
      products,
      user: req.session.user,
    };

    res.render("index", data);
  } catch (err) {
    console.error(`Error reading products file: ${err}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const realTimeProductsView = async (req, res) => {
  try {
    const products = await Products.find({ isVisible: true }).lean();

    res.render("index", { layout: "realTimeProducts", products });
  } catch (err) {
    console.error(`Error reading products file: ${err}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
