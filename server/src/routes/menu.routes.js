import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  try {
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/", (req, res) => {
  try {
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put("/:id", (req, res) => {
  try {
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete("/:id", (req, res) => {
  try {
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
