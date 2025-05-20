import { Router } from "express";
import { categoryController } from "../controllers/categoryController.js";
import { checkAuthMiddleware } from "../middlewares/checkAuthMiddleware.js";

const router = Router();

router.post("/", checkAuthMiddleware, categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", checkAuthMiddleware, categoryController.updateCategory);
router.delete("/:id", checkAuthMiddleware, categoryController.deleteCategory);

export default router;
