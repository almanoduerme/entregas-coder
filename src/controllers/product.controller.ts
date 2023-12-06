import path from "path";
import { Request, Response } from "express";
import { Product, ProductBase } from "../interfaces";
import { ProductManager } from "../daos/managers";
import { baseDirectory } from "../utils";

// =================== MongoDB =================== //
import { Product as ProductModelMongoDB } from "../daos/models/product.model";
import mongoose from "mongoose";

const productsFilePath = path.join(baseDirectory, "database/products.json");
const productManager = new ProductManager(productsFilePath);

export class ProductController {
  public static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const { limit } = req.query;
      // let products: Product[] = await productManager.getProducts();
      let products: Product[] = await ProductModelMongoDB.find().lean();

      if (products.length === 0) {
        res.status(404).json({ error: "Don't have any products" });
        return;
      }

      if (limit) {
        const limitNumber = parseInt(limit as string, 10);
        products = products.slice(0, limitNumber);
      }

      if (products.length === 0) {
        res.status(404).json({ error: "Products not found within the specified limit" });
        return;
      }

      res.status(200).render("home", { products });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (mongoose.Types.ObjectId.isValid(id) === false) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }

      // const product: Product | undefined = await productManager.getProductByID(id);
      const product = await ProductModelMongoDB.findById(id).lean();

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

  public static async addProduct(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, code, price, stock, thumbnails, status = true, category }: ProductBase = req.body;

      if (!title || !description || !code || !price || !stock || !category || !status) {
        res.status(400).json({ error: "Missing required information" });
        return;
      }

      // const products = await productManager.getProducts();
      const products = await ProductModelMongoDB.find();
      const productExists = products.find((product) => product.code === code);

      if (productExists) {
        res.status(400).json({ error: "Product already exists" });
        return;
      }

      const newProduct: ProductBase = { title, description, code, price, stock, thumbnails, status, category };
      // const product = await productManager.createProduct(newProduct);
      const product = await ProductModelMongoDB.create(newProduct);

      if (!product) {
        res.status(500).json({ error: "Error adding product" });
        return;
      }

      res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async updateProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id) === false) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const updatedProduct: Partial<Product> = req.body;

    try {
      // await productManager.updateProductByID(id, updatedProduct);
      await ProductModelMongoDB.findByIdAndUpdate(id, updatedProduct);
      res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({ error: `Error updating product: ${error}` });
    }
  }
  
  public static async deleteProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (mongoose.Types.ObjectId.isValid(id) === false) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }

      // const product = await productManager.getProductByID(id);
      const product = await ProductModelMongoDB.findById(id);

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      // await productManager.deleteProductByID(id);
      await ProductModelMongoDB.findByIdAndDelete(id);
      res.status(200).json(`Product with id ${id} deleted`);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
