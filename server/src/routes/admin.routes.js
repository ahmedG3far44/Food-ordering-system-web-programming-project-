import { Router } from "express";

import {
  getAllOrders,
  getCustomerInsights,
  getDashboardStats,
  getItemPerformance,
  getSalesReport,
  updateOrderStatus,
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/dashboard", getDashboardStats);
router.get("/orders", getAllOrders);
router.put("/orders/:orderId/status", updateOrderStatus);
router.get("/reports/sales", getSalesReport);
router.get("/reports/items", getItemPerformance);
router.get("/reports/customers", getCustomerInsights);

export default router;
