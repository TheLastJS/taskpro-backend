export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || "Something went wrong",
    data: err.data || null
  });
};