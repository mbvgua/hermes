import express from "express";
import {
  addProduct,
  getProductById,
  getProducts,
  getProductsByCategory,
} from "../controllers/products.controllers";

const productRouter = express.Router();

productRouter.post("/add", addProduct);
productRouter.get("/get", getProducts);
productRouter.get("/get-by-category", getProductsByCategory);
productRouter.get("/get-by-id/:id", getProductById);
// productRouter.patch('/update/:id',updateProduct)
// productRouter.patch('/delete/:id',deleteProduct)

export default productRouter;
