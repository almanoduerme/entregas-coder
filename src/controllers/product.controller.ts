import { Request, Response } from "express";
import { Product, ProductBase } from "../interfaces";
import { Product as ProductModelMongoDB } from "../daos/models/product/product.model";
import mongoose from "mongoose";

interface QueryParams {
  limit?: string;
  page?: string;
  query?: string;
  sort?: string;
  category?: string;
  available?: string;
  status?: string;
}

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class ProductController {
  public static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const { limit = '10', page = '1', query = '', sort, category, available, status }: QueryParams = req.query;

      const parsedLimit = parseInt(limit, 10);
      const parsedPage = parseInt(page, 10);
      const skip = (parsedPage - 1) * parsedLimit;

      const sortOptions: [string, SortOrder][] = [];
      if (sort) {
        const [key, sortOrder] = sort.split(':');
        sortOptions.push([key, sortOrder === SortOrder.DESC ? SortOrder.DESC : SortOrder.ASC]);
      }

      const searchOptions: Record<string, any> = {};

      if (query) {
        const regexQuery = { $regex: query, $options: 'i' };
        searchOptions.$or = [
          { title: regexQuery },
          { description: regexQuery },
          { category: regexQuery },
        ];
      }

      if (category) {
        searchOptions.category = category;
      }

      if (available !== undefined) {
        searchOptions.stock = available === 'true' ? { $gt: 0 } : 0;
      }

      if (status !== undefined) {
        searchOptions.status = status === 'true';
      }

      const [products, totalProducts] = await Promise.all([
        ProductModelMongoDB.find(searchOptions)
          .limit(parsedLimit)
          .skip(skip)
          .sort(Object.fromEntries(sortOptions)),
        ProductModelMongoDB.countDocuments(searchOptions),
      ]);

      const totalPages = Math.ceil(totalProducts / parsedLimit);
      const hasPrevPage = parsedPage > 1;
      const hasNextPage = parsedPage < totalPages;
      const prevLink = hasPrevPage ? true : false;
      const nextLink = hasNextPage ? true : false;

      // res.status(200).json({
      //   status: products.length ? 'success' : 'error',
      //   payload: products,
      //   totalPages,
      //   prevPage: hasPrevPage ? parsedPage - 1 : null,
      //   nextPage: hasNextPage ? parsedPage + 1 : null,
      //   page: parsedPage,
      //   hasPrevPage,
      //   hasNextPage,
      //   prevLink : prevLink ? `/products?page=${parsedPage - 1}&limit=${parsedLimit}` : null,
      //   nextLink : nextLink ? `/products?page=${parsedPage + 1}&limit=${parsedLimit}` : null,
      // });

      // Send response to Handlebars.

      res.status(200).render("products", {
        status: products.length ? 'success' : 'error',
        products,
        totalPages,
        prevPage: hasPrevPage ? parsedPage - 1 : null,
        nextPage: hasNextPage ? parsedPage + 1 : null,
        page: parsedPage,
        hasPrevPage,
        hasNextPage,
        prevLink : prevLink ? `/products?page=${parsedPage - 1}&limit=${parsedLimit}` : null,
        nextLink : nextLink ? `/products?page=${parsedPage + 1}&limit=${parsedLimit}` : null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (mongoose.Types.ObjectId.isValid(id) === false) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }

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

      const products = await ProductModelMongoDB.find();
      const productExists = products.find((product) => product.code === code);

      if (productExists) {
        res.status(400).json({ error: "Product already exists" });
        return;
      }

      const newProduct: ProductBase = { title, description, code, price, stock, thumbnails, status, category };
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

      const product = await ProductModelMongoDB.findById(id);

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      await ProductModelMongoDB.findByIdAndDelete(id);
      res.status(200).json(`Product with id ${id} deleted`);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
