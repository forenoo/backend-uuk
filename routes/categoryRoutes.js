import { Router } from "express";
import { categoryController } from "../controllers/categoryController.js";
import { checkAuthMiddleware } from "../middlewares/checkAuthMiddleware.js";
import { checkAdminMiddleware } from "../middlewares/checkAdminMiddleware.js";
import { createCategoryValidator } from "../validator/validator.js";

const router = Router();

router.post(
  "/",
  [checkAdminMiddleware, createCategoryValidator],
  categoryController.createCategory
);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", checkAdminMiddleware, categoryController.updateCategory);
router.delete("/:id", checkAdminMiddleware, categoryController.deleteCategory);

export default router;
