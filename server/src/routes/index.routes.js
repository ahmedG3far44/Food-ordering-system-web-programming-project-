import { Router } from "express";

import authRoutes from "./auth.routes.js";
import menuRoutes from "./auth.routes.js";
import cartRoutes from "./auth.routes.js";
import orderRoutes from "./auth.routes.js";
import adminRoutes from "./auth.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/menus", menuRoutes);
router.use("/admin", adminRoutes);

export default router;
