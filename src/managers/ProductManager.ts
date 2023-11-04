import fs from "fs";
import * as crypto from "crypto";
import { Product, ProductPreview } from "../interfaces";

export class ProductManager {
  private productsFilePath: string;

  constructor(productsFilePath: string) {
    this.productsFilePath = productsFilePath;
  }

  private async writeFile(products: Product[]): Promise<void> {
    try {
      await fs.promises.writeFile(this.productsFilePath, JSON.stringify(products, null, 2), "utf-8");
    } catch (error) {
      throw new Error(`Error writing file: ${error}`);
    }
  }

  private async readFile(): Promise<Product[] | []> {
    if (fs.existsSync(this.productsFilePath)) {
      return JSON.parse(await fs.promises.readFile(this.productsFilePath, "utf-8"));
    } else {
      return [];
    }
  }

  public async getProducts(): Promise<Product[] | []> {
    try {
      const products = await this.readFile();
      return products;
    } catch (error) {
      throw new Error(`Error getting products: ${error}`);
    }
  }

  public async addProduct(product: ProductPreview): Promise<void> {
    try {
      const products = await this.readFile();

      const newProduct = {
        id: crypto.randomBytes(16).toString("hex"),
        ...product
      };

      await this.writeFile([...products, newProduct]);
    } catch (error) {
      throw new Error(`Error adding product: ${error}`);
    }
  }

  public async getProductByID(id: string): Promise<Product | undefined> {
    try {
      const products = await this.readFile();

      const product = products.find((product) => product.id === id);
      return product;
    } catch (error) {
      throw new Error(`Error getting product: ${error}`);
    }
  }

  public async updateProductByID(id: string, updatedProduct: Partial<Product>): Promise<void> {
    try {
      const products = await this.readFile();
      const product = products.find((product) => product.id === id);
      
      if (!product) {
        throw new Error("Product not found");
      }
      
      if (!updatedProduct.title && !updatedProduct.description && !updatedProduct.code && !updatedProduct.price && !updatedProduct.stock && !updatedProduct.thumbnail && !updatedProduct.status && !updatedProduct.category) {
        throw new Error("Missing required information");
      }
      
      const allowedUpdates = ["title", "description", "code", "price", "stock", "status", "category"];
      const invalidUpdates = Object.keys(updatedProduct).filter((update) => !allowedUpdates.includes(update));
      
      if (invalidUpdates.length > 0) {
        throw new Error(`Invalid update: ${invalidUpdates.join(", ")}`);
      }
      
      Object.assign(product, updatedProduct);
      
      await this.writeFile(products);
      return;
    } catch (error) {
      throw new Error(`Error updating product: ${error}`);
    }
  }

  public async deleteProductByID(id: string): Promise<void> {
    try {
      const products = await this.readFile();

      const productIndex = products.findIndex((product) => product.id as string === id.toString());

      if (productIndex === -1) {
        throw new Error("Product not found");
      }

      const updatedProducts = products.filter((product) => product.id !== id);
      await this.writeFile(updatedProducts);
      return;
    } catch (error) {
      throw new Error(`Error deleting product: ${error}`);
    }
  }
}