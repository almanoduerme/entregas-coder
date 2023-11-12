import { Request, Response, Router } from "express";
import { ProductManager } from "../managers";
import { baseDirectory } from "../utils";

const handlebarsRouter = Router();

const productManager = new ProductManager(`${baseDirectory}/database/products.json`);

handlebarsRouter.get("/", async (req: Request, res: Response) => {
  const products = await productManager.getProducts();

  res.render("index", { products });
});

export default handlebarsRouter;