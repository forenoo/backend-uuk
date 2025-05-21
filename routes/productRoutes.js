import express from "express";
import { productController } from "../controllers/productController.js";
import { checkAuthMiddleware } from "../middlewares/checkAuthMiddleware.js";
import { uploadFileMiddleware } from "../middlewares/uploadFileMiddleware.js";
import { checkAdminMiddleware } from "../middlewares/checkAdminMiddleware.js";
import { createProductValidator } from "../validator/validator.js";

const router = express.Router();

router.post(
  "/",
  [checkAdminMiddleware, uploadFileMiddleware, createProductValidator],
  productController.createProduct
);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put(
  "/:id",
  [checkAdminMiddleware, uploadFileMiddleware],
  productController.updateProduct
);
router.delete("/:id", [checkAdminMiddleware], productController.deleteProduct);

export default router;
