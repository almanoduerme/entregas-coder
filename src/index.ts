import { ProductManager } from "./app";
import { skirt, shirt, pants, shoes } from "./data/products.data";

// Path: src/index.ts
const filePath = __dirname + "/data/products.json";

// Create a new instance of ProductManager
const productManager = new ProductManager(filePath);

const environment = async () => {
  try {
    // Read the products from the file
    // const products = await productManager.getProducts();
    // console.log(products);

    // Add a new product
    // await productManager.addProduct(shirt);
    // await productManager.addProduct(pants);
    // await productManager.addProduct(shoes);
    // await productManager.addProduct(skirt);

    // Read the products from the file
    // const products = await productManager.getProducts();
    // console.log(products);

    // Get a product by id
    // const product = await productManager.getProductByID(3);
    // console.log(product);

    // Update a product by id
    // await productManager.updateProductByID(3, { price: 1000 });

    // Delete a product by id
    // productManager.deleteProductByID(1);
  } catch (error) {
    console.log(error);
  }
};

environment();