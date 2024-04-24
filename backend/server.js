import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import passport from "passport";
import pass from "./utils/passport.js";
import session from "express-session";
import userRoutes from "./routes/userRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import detailsRoutes from "./routes/detailsRoutes.js"
import columnRoutes from "./routes/columnRoutes.js"
import dealsRoutes from "./routes/dealsRoutes.js"
import cors from "cors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Initialize Express app
const app = express();

// Load environment variables from .env file
const port = process.env.PORT || 8000;
dotenv.config();

// Connect to MongoDB database
connectDB();

// Configure Passport for authentication
pass(passport);

// Middleware for Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: "GET,POST,PUT,DELETE", // Allow specified HTTP methods
    credentials: true, // Allow sending cookies with CORS requests
  })
);

// Middleware for parsing JSON data in the request bodies
app.use(express.json());

// Middleware for managing user sessions using express-session
app.use(
  session({
    secret: "C1CsSoftEng",  // Secret used to sign session ID cookie
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Route handlers for user authentication and authorization
app.use("/auth", userRoutes);
// Route handlers for email functionalities
app.use("/", emailRoutes);
// Route handlers for managing leads
app.use("/api/leads", leadRoutes);
// Route handlers for managing lead details
app.use("/api/leads", detailsRoutes)
// Route handlers for managing leads
app.use("/api/column", columnRoutes);

app.use("/api/deals", dealsRoutes)

// Middleware for Handling 404 Not Found Errors
app.use(notFound);
// Middleware for handling errors
app.use(errorHandler);

// Start the server
app.listen(port, () => console.log(`Server ${port} Running`));
