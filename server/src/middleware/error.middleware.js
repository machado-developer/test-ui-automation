

const ErrorMiddleware = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  console.error(`[${req.method}] ${req.url} →`, error);

  const isProduction = process.env.NODE_ENV === 'production';
  const message =
    isProduction && statusCode === 500
      ? "Erro Interno!"
      : error.message || "Erro desconhecido";

  res.status(statusCode).json({
    message,
    statusCode,
  });
};

module.exports = { ErrorMiddleware };
