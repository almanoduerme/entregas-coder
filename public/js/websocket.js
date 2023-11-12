const socket = io();

// VARIABLES
let productTable = document.getElementById("div-container-products-table");
let title = document.getElementById("title");
let description = document.getElementById("description");
let code = document.getElementById("code");
let price = document.getElementById("price");
let stock = document.getElementById("stock");
let category = document.getElementById("category");
let statusOfProduct = document.getElementById("status");
let send = document.getElementById("send");
let deleteProduct = document.getElementById("deleteProduct");

// FUNCTIONS
const resetForm = () => {
  title.value = "";
  description.value = "";
  code.value = "";
  price.value = "";
  stock.value = "";
  category.value = "";
  statusOfProduct.checked = false;
};

const generateTableRow = (product) => `
  <tr>
    <td>${product.id}</td>
    <td>${product.title}</td>
    <td>${product.description}</td>
    <td>${product.code}</td>
    <td>${product.price}</td>
    <td>${product.stock}</td>
    <td>${product.category}</td>
    <td>${product.status ? "Active" : "Inactive"}</td>
    <td><button id="deleteProduct ${product.id}" class="deleteProduct">Delete</button></td>
  </tr>
`;

const generateTableHTML = (data) => `
  <table class="product-table">
    <thead>
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Title</th>
        <th scope="col">Description</th>
        <th scope="col">Code</th>
        <th scope="col">Price</th>
        <th scope="col">Stock</th>
        <th scope="col">Category</th>
        <th scope="col">Status</th>
        <th scope="col">Delete</th>
      </tr>
    </thead>
    <tbody>
      <h1 class="product-title">Products</h1>
      ${data.map(generateTableRow).join("")}
    </tbody>
  </table>
`;

const renderTable = (data) => {
  if (data.length > 0) {
    const tableHTML = generateTableHTML(data);
    productTable.innerHTML = tableHTML;
  } 

  if (data.length === 0) {
    productTable.innerHTML = "<p>There are no products</p>";
  }
};

const validateNotEmpty = (value, fieldName) => {
  if (!value) {
    alert(`${fieldName} is required`);
    return false;
  }
  return true;
};

const validateString = (value, fieldName) => {
  const isString = /^[a-zA-Z\s]*$/;
  if (!isString.test(value)) {
    alert(`${fieldName} must be a string`);
    return false;
  }
  return true;
};

const validateNumber = (value, fieldName) => {
  const isOnlyNumber = /^[0-9]+$/;
  if (!isOnlyNumber.test(value) || value < 0) {
    alert(`${fieldName} must be a positive number`);
    return false;
  }
  return true;
};

const validateStatus = (value) => {
  if (value === null || typeof value !== "boolean") {
    alert("Status must be true or false");
    return false;
  }
  return true;
};

const validateLength = (value, maxLength, fieldName) => {
  if (value.length > maxLength) {
    alert(`${fieldName} must be less than ${maxLength} characters`);
    return false;
  }
  return true;
};

const sendProduct = (title, description, code, price, stock, category, statusValue) => {
  socket.emit("newProduct", { title, description, code, price, stock, category, status: statusValue });
};

// EVENTS LISTENERS
send.addEventListener("click", (event) => {
  event.preventDefault();

  const statusValue = statusOfProduct.checked;

  if (
    validateNotEmpty(title.value, "Title") &&
    validateNotEmpty(description.value, "Description") &&
    validateNotEmpty(code.value, "Code") &&
    validateNotEmpty(price.value, "Price") &&
    validateNotEmpty(stock.value, "Stock") &&
    validateNotEmpty(category.value, "Category") &&
    validateString(title.value, "Title") &&
    validateString(description.value, "Description") &&
    validateString(category.value, "Category") &&
    validateNumber(price.value, "Price") &&
    validateNumber(stock.value, "Stock") &&
    validateStatus(statusValue) &&
    validateLength(title.value, 20, "Title") &&
    validateLength(description.value, 120, "Description") &&
    validateLength(code.value, 20, "Code") &&
    validateLength(category.value, 20, "Category")
  ) { 
    sendProduct(title.value, description.value, code.value, price.value, stock.value, category.value, statusValue);

    resetForm();
  }
});

productTable.addEventListener("click", (event) => {
  if (event.target.classList.contains("deleteProduct")) {
    const id = event.target.id.split(" ")[1];

    socket.emit("deleteProduct", id);
  }
});

// SOCKET EVENTS
socket.on("products", (data) => {
  renderTable(data);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});