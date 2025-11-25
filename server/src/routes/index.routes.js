import { Router } from "express";

import authRoutes from "./auth.routes.js";
import menuRoutes from "./menu.routes.js";
import cartRoutes from "./cart.routes.js";
import orderRoutes from "./order.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/menu", menuRoutes);
router.use("/admin", adminRoutes);

export default router;
