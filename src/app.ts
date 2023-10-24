import fs from "fs";
import { Product } from "./interfaces/product.interface";

export class ProductManager {
  private path: string;

  constructor(productsFilePath: string) {
    this.path = productsFilePath;
  }

  private async writeFile(products: Product[]): Promise<void> {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");
    } catch (error) {
      throw new Error(`Error writing file: ${error}`);
    }
  }

  private async readFile(): Promise<Product[] | []> {
    if (fs.existsSync(this.path)) {
      return JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
    } else {
      return [];
    }
  }

  public async getProducts(): Promise<Product[]> {
    try {
      const products = await this.readFile();
      return products;
    } catch (error) {
      throw new Error(`Error getting products: ${error}`);
    }
  }

  public async addProduct(product: Product): Promise<void> {
    try {
      const products = await this.readFile();

      const newProduct = {
        id: products.length + 1,
        ...product,
      };

      await this.writeFile([...products, newProduct]);
    } catch (error) {
      throw new Error(`Error adding product: ${error}`);
    }
  }

  public async getProductByID(id: number): Promise<Product> {
    try {
      const products = await this.readFile();
      const product = products.find((product) => product.id === id);

      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    } catch (error) {
      throw new Error(`Error getting product: ${error}`);
    }
  }

  public async updateProductByID(id: number, updatedProduct: Partial<Product>): Promise<void> {
    try {
      const products = await this.readFile();
      const productIndex = products.findIndex((product) => product.id === id);

      if (productIndex === -1) {
        throw new Error("Product not found");
      }

      const updatedProducts = products.map((product: Product) => {
        if (product.id === id) {
          return {
            ...product,
            ...updatedProduct,
          };
        }
        return product;
      });

      await this.writeFile(updatedProducts);
    } catch (error) {
      throw new Error(`Error updating product: ${error}`);
    }
  }

  public async deleteProductByID(id: number): Promise<void> {
    try {
      const products = await this.readFile();

      // Check if the product with the specified ID exists
      const productIndex = products.findIndex((product) => product.id === id);

      if (productIndex === -1) {
        throw new Error("Product not found");
      }

      const updatedProducts = products.filter((product) => product.id !== id);

      await this.writeFile(updatedProducts);
    } catch (error) {
      throw new Error(`Error deleting product: ${error}`);
    }
  }
}