import Carts from "../dao/models/carts.model.js";

export const createCart = async (req, res) => {
  try {
    const newCart = new Carts(req.body);
    const savedCart = await newCart.save();

    res.status(201).json(savedCart);
  } catch (err) {
    console.error(`Error creating cart ${err}`);
    res.status(500).json({ message: "Error creating cart" });
  }
};

export const getCart = async (req, res) => {
  try {
    const obtainedCart = await Carts.findById(req.params.cid);
    if (!obtainedCart) {
      res.status(404).json({ message: "Cart not found" });
    } else {
      res.status(200).json(obtainedCart);
    }
  } catch (err) {
    console.error(`Error getting cart ${err}`);
    res.status(500).json({ message: "Error getting cart" });
  }
};

export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Carts.findById(cid);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const existingProduct = cart.products.find((p) => p.product.equals(pid));

    if (existingProduct) {
      existingProduct.quantity += quantity || 1;
    } else {
      cart.products.push({ product: pid, quantity: quantity || 1 });
    }

    const updatedCart = await cart.save();

    res.status(200).json(updatedCart);
  } catch (err) {
    console.error(`Error adding product to cart: ${err}`);
    res.status(500).json({ message: "Error adding product to cart" });
  }
};
