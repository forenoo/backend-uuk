import express from "express";
import { productController } from "../controllers/productController.js";
import { checkAuthMiddleware } from "../middlewares/checkAuthMiddleware.js";
import { uploadFileMiddleware } from "../middlewares/uploadFileMiddleware.js";
const router = express.Router();

router.post(
  "/",
  [checkAuthMiddleware, uploadFileMiddleware],
  productController.createProduct
);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put(
  "/:id",
  [checkAuthMiddleware, uploadFileMiddleware],
  productController.updateProduct
);
router.delete("/:id", checkAuthMiddleware, productController.deleteProduct);

export default router;
