import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import indexRoutes from "./routes/index.routes.js";

import { pool } from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

function startServer() {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("❌ Database connection failed:", err.message);
      process.exit(1);
    }
    console.log("✅ Database connected successfully");
    connection.release();
    // app.use(express.static("../../frontend/"));
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));

    app.get("/health", (req, res) => {
      res.status(200).json({ status: "OK" });
    });
    app.use("/api", indexRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  });
}

startServer();
