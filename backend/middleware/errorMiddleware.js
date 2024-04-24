// Handling requests for routes that does not exist
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Showing the error response
const errorHandler = (err, req, res, next) => {
  // Setting it to Internal Server Error when the status is successful even there is error 
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Changing the response for the default behavior of failing query
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource Not Found";
  }

  // Responding error with JSON object
  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };
