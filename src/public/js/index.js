const socket = io();

socket.on("productAdded", (product) => {
  const productList = document.getElementById("productList");
  const newProduct = document.createElement("li");
  newProduct.setAttribute("data-product-id", product.id);
  newProduct.innerHTML = `${product.title} - Precio: $${product.price}`;
  productList.appendChild(newProduct);
});

socket.on("productDeleted", (productId) => {
  const productList = document.getElementById("productList");
  const productToDelete = productList.querySelector(
    `li[data-product-id="${productId}"]`
  );
  if (productToDelete) {
    productList.removeChild(productToDelete);
  }
});