import fs from "fs";

class ProductManager {
  constructor() {
    this.products = this.readProductsFromFile();
    this.path = "products.json";
  }

  writeProductsToFile(products) {
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2), "utf-8");
  }

  readProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    const verifyCode = this.products.find((product) => product.code === code);
    if (verifyCode) {
      console.log("El código ya está en uso");
      return;
    }

    const id = this.products.length + 1;
    const product = {
      id: id,
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
    };

    this.products.push(product);
    this.writeProductsToFile(this.products);
  }

  getProducts() {
    const products = this.readProductsFromFile();
    return products;
  }

  getProductById(id) {
    const products = this.getProducts();
    const obtainedProduct = products.find((product) => product.id === id);
    return obtainedProduct;
  }

  updateProduct(id, newProductData) {
    const productsFromFile = this.getProducts();
    const productToUpdate = this.getProductById(id);

    if (productToUpdate && productToUpdate !== "Product not found") {
      for (const key in newProductData) {
        if (key !== "id") {
          productToUpdate[key] = newProductData[key];
        } else {
          console.warn("No se permite modificar el ID del producto");
        }
      }
      const updatedProduct = productsFromFile.map((product) =>
        product.id === id ? productToUpdate : product
      );
      this.writeProductsToFile(updatedProduct);
      return "Product updated";
    } else {
      return "Product not found";
    }
  }

  deleteProduct(id) {
    const productsFromFile = this.getProducts();
    const productToDelete = productsFromFile.findIndex(
      (product) => product.id === id
    );

    if (productToDelete !== -1) {
      productsFromFile.splice(productToDelete, 1);
      this.writeProductsToFile(productsFromFile);
      return "Product deleted";
    } else {
      return "Product not found";
    }
  }
}

export default ProductManager;