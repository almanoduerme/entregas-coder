import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

const productRouter = Router();

productRouter.get("/", ProductController.getProducts);
productRouter.get("/:id", ProductController.getProductById);
productRouter.post("/", ProductController.addProduct);
productRouter.put("/:id", ProductController.updateProduct);
productRouter.delete("/:id", ProductController.deleteProductById);

export default productRouter;
