import { ProductManager } from "./app";
import { skirt, shirt, pants, shoes } from "./data";

// Create a new instance of ProductManager
const productManager = new ProductManager();

// Show all products (empty)
// console.log(productManager.getProducts());

// Add the products
// productManager.addProduct(skirt);
// productManager.addProduct(shirt);
// productManager.addProduct(pants);
// productManager.addProduct(shoes);

// Show all products (2) with ID autoincremented.
// console.log(productManager.getProducts());

// Add a product with the same code
// productManager.addProduct(shirt);

// Get a product by id
// console.log(productManager.getProductById(2));

// Get a product by id that doesn't exist
// productManager.getProductById(5);