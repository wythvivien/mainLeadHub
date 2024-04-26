import express from "express";
import isAuthenticated from "../middleware/auth.js";
import { retrieveLeads, retrieveLeadCount, getLead, updateLead, updateLeadDetails, createLead, deleteLead, updateLeadColumn, getLeadId, listLeads} from "../controller/leadController.js";

const router = express.Router();

//Routes related to leads
router
  .route("/count/:filter")
  .get(isAuthenticated, retrieveLeadCount);  // Retrieve all leads
router
  .route("/:pg/:filter/:sortBy/:searchBy/:sort_order/:filterBy")
  .get(isAuthenticated, retrieveLeads);  // Retrieve all leads

router
  .route("/")
  .post(isAuthenticated, createLead) // Create a new Lead
  .put(isAuthenticated, updateLead); // Delete a specific lead
  
router.route("/delete").put(isAuthenticated, deleteLead); 

router
  .route("/:leadAccount")
  .get(isAuthenticated, getLead)  // Retrieve a specific lead
  .put(isAuthenticated, updateLeadDetails) // Update a specific lead
router
  .route("/card/column")
  .get(isAuthenticated, getLeadId)
  .put(isAuthenticated, updateLeadColumn);

router.route("/form/lists").get(isAuthenticated, listLeads);

export default router; //test
