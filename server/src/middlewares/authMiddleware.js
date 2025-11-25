import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.cookies.session;
    if (!token) {
      throw new Error("No token provided");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      data: error.message,
      message: "Unauthorized User Access",
      success: false,
    });
  }
};

export default authMiddleware;
