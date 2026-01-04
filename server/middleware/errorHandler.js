export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    message = 'Validation Error';
    return res.status(400).json({
      success: false,
      message,
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'CastError') {
    message = 'Resource not found';
    return res.status(404).json({
      success: false,
      message
    });
  }

  if (err.message && err.message.includes('JWT_SECRET')) {
    message = 'Server configuration error: JWT_SECRET is missing';
    return res.status(500).json({
      success: false,
      message,
      hint: 'Please check your server .env file and ensure JWT_SECRET is set'
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      error: err.name,
      details: err.message
    })
  });
};

