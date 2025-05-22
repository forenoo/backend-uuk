import express from "express";
import { transactionController } from "../controllers/transactionController.js";
import { checkAuthMiddleware } from "../middlewares/checkAuthMiddleware.js";
import { checkAdminMiddleware } from "../middlewares/checkAdminMiddleware.js";
import { createTransactionValidator } from "../validator/validator.js";

const router = express.Router();

router.post(
  "/",
  [checkAuthMiddleware, createTransactionValidator],
  transactionController.createTransaction
);
router.get(
  "/",
  [checkAdminMiddleware],
  transactionController.getAllTransaction
);
router.get(
  "/user",
  checkAuthMiddleware,
  transactionController.getUserTransaction
);
router.get(
  "/:id",
  checkAuthMiddleware,
  transactionController.getTransactionById
);
router.delete(
  "/:id",
  checkAdminMiddleware,
  transactionController.deleteTransaction
);

export default router;
