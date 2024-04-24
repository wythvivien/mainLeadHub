// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  // If authenticated, proceed to next middleware
  if (req.isAuthenticated()) {
    return next();
  }
  // If not redirect to login page
  res.redirect("http://localhost:3000"); // Redirect to login page if not authenticated
};

export default isAuthenticated;
