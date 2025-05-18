import express from "express";
import { productController } from "../controllers/productController.js";
import { createProductValidation } from "../validators/productValidation.js";

const router = express.Router();

router.post("/product", createProductValidation, productController.createProduct);
router.get("/product", productController.getProduct);
router.get("/product/:id", productController.getProductById);
router.put("/product/:id", productController.updateProduct);
router.delete("/product/:id", productController.deleteProduct);

export default router;
