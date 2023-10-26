import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

const productRouter = Router();

productRouter.get("/products", ProductController.getProducts);
productRouter.get("/products/:id", ProductController.getProductById);

export default productRouter;
