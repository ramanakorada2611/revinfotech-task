class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? false : "error";
    this.isOperational = true; // for third-party APIs error or optional error

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
