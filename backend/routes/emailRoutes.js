import express from "express";
import isAuthenticated from "../middleware/auth.js";
import {sendEmail, receiveEmail} from "../controller/emailController.js";

const router = express.Router();

// Route for sending emails
router.post("/send-email", isAuthenticated, sendEmail)

// Route for receiving emails
router.get("/read-emails", isAuthenticated, receiveEmail)


export default router;
