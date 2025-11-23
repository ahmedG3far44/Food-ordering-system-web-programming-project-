import { Router } from "express";
// import { login, register } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", (req, res) => {
  try {
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/login", (req, res) => {
  try {
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// router.get('/profile', getProfile);
// router.put('/profile', updateProfile);
// router.put('/change-password', changePassword);

export default router;
