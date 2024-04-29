import express from "express";
import isAuthenticated from "../middleware/auth.js";
import { logUser, logOut, getUserTasks, getDateTasks, getLeadDetails, exportAllLeads, exportWarmLeads, exportColdLeads, exportDeadLeads,exportColumn, exportDeals, updateTasks, deleteTask, updateTaskById} from "../controller/userController.js";
import passport from "passport";

const router = express.Router();

// Route for initiating Google Oauth Authentication
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://mail.google.com/",
      "https://www.googleapis.com/auth/contacts.other.readonly",
    ],
    accessType: "offline",
    prompt: "consent",
  })
);

// Route for handling Google Oauth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    // Redirect to dashboard on successful authentication
    successRedirect: "http://localhost:3000/leadhub",
    // Redirect to login page on failure
    failureRedirect: "http://localhost:3000",
  })
);

// Route for logging in the user
router.get("/login/success", isAuthenticated, logUser);

// Route for logging out of the user
router.get("/logout", isAuthenticated, logOut);

// Route for getting tasks of the user
router.get("/tasks", isAuthenticated, getUserTasks)

// Route for getting tasks based on the date of the user
router.get("/tasks/date", isAuthenticated, getDateTasks)

// Route for getting leads based on the task of the user
router.get("/tasks/lead", isAuthenticated, getLeadDetails)

// Route for getting leads based on the task of the user
router.put("/tasks/update", isAuthenticated, updateTasks)
router.delete("/tasks/delete", isAuthenticated, deleteTask)
router.put("/tasks/update-by-id", isAuthenticated, updateTaskById)

router.get("/export/leads", isAuthenticated, exportAllLeads)

router.get("/export/warmleads", isAuthenticated, exportWarmLeads);
router.get("/export/coldleads", isAuthenticated, exportColdLeads);
router.get("/export/deadleads", isAuthenticated, exportDeadLeads);
router.get("/export/columns", isAuthenticated, exportColumn);
router.get("/export/deals", isAuthenticated, exportDeals);
export default router;
