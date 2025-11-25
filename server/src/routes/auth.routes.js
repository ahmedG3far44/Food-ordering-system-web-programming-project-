import { Router } from "express";
import myDB from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import SQL from "../models/queries.js";
// import { login, register } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    const [existingUser] = await myDB.query(SQL.isUserExist(), [email]);

    if (existingUser[0]) {
      return res.status(400).json({ error: "User already exists" });
    }

    console.log(existingUser);

    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const [newUser] = await myDB.query(SQL.registerNewUser(), [
      name,
      email,
      phone,
      hashedPassword,
      address,
    ]);

    const [currentUser] = await myDB.query(SQL.getCurrentUser(), [
      newUser.insertId,
    ]);

    console.log(currentUser);

    const token = jwt.sign({ ...currentUser[0] }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    res.cookie("session", token, {
      httpOnly: true,
      secure: false,
      maxAge: 5 * 24 * 60 * 60 * 1000, 
    });

    res.status(201).json({
      data: { ...currentUser[0], token },
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      data: "[Error]: internal server error",
      message: error.message,
      success: false,
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await myDB.query(SQL.isUserExist(), [email]);

    if (!user[0]) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ ...user[0] }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });
    res.cookie("session", token, {
      httpOnly: true,
      secure: false,
      maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
    });

    const [currentUser] = await myDB.query(SQL.getCurrentUser(), [
      user[0].user_id,
    ]);

    res
      .status(200)
      .json({ data: currentUser[0], message: "User logged in successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
