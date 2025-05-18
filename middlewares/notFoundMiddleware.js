export const notFoundMiddleware = (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "Route tidak ditemukan",
  });
};
