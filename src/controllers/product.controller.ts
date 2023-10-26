import { Request, Response } from "express";
import { ProductManager } from "../managers/ProductManager";
import path from "path";

const productsFilePath = path.join(__dirname, "../database/products.json");
const productManager = new ProductManager(productsFilePath);

export class ProductController {
  public static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const { limit } = req.query;
      const products = await productManager.getProducts();

      if (products.length === 0) {
        res.status(404).json({ error: "Products not found" });
        return;
      }

      let productsToSend = products;

      if (limit) {
        const limitNumber = parseInt(limit as string, 10);
        productsToSend = products.slice(0, limitNumber);
      }

      if (productsToSend.length === 0) {
        res.status(404).json({ error: "Products not found within the specified limit" });
        return;
      }

      res.status(200).json(productsToSend);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const productId = parseInt(id, 10);
      const product = await productManager.getProductByID(productId);

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      res.status(200).json(product);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
