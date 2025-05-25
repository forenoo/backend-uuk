import { Router } from "express";
import { overviewController } from "../controllers/overviewController.js";
import { checkAdminMiddleware } from "../middlewares/checkAdminMiddleware.js";

const router = Router();

router.get("/", checkAdminMiddleware, overviewController.getOverview);
router.get(
  "/recent-transactions",
  checkAdminMiddleware,
  overviewController.getRecentTransactions
);
router.get(
  "/recent-products",
  checkAdminMiddleware,
  overviewController.getRecentProducts
);
router.get(
  "/customer-growth",
  checkAdminMiddleware,
  overviewController.getCustomerGrowth
);

export default router;
