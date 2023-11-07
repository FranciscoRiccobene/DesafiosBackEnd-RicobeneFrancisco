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

// document.addEventListener("DOMContentLoaded", () => {
//   document.getElementById("productForm").addEventListener("submit", (e) => {
//     e.preventDefault();
//     const productName = document.getElementById("productTitle").value;
//     const productPrice = document.getElementById("productPrice").value;
//     socket.emit("newProduct", { title: productName, price: productPrice });
//     document.getElementById("productTitle").value = "";
//     document.getElementById("productPrice").value = "";
//   });
// });
