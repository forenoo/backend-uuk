import express from "express";
import { transactionController } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/transactions", transactionController.createTransaction);
router.get("/transactions", transactionController.getTransactions);
router.get("/transactions/:id", transactionController.getTransactionById);

export default router;
