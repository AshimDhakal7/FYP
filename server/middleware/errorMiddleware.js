// server/middleware/errorMiddleware.js

// 404
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
  };
  
  // Global error handler
  const errorHandler = (err, req, res, next) => {
    console.error("❌ Error:", err);
  
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  };
  
  module.exports = { notFound, errorHandler };
  