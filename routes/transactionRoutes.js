import express from "express";
import { transactionController } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", transactionController.createTransaction);
router.get("/", transactionController.getAllTransaction);
router.get("/:id", transactionController.getTransactionById);
router.put("/:id", transactionController.updateTransaction);
router.delete("/:id", transactionController.deleteTransaction);

export default router;
