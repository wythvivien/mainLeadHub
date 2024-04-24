import express from "express";
import isAuthenticated from "../middleware/auth.js";
import {
  createColumn,
  updateColumn,
  deleteColumn,
  retrieveColumn,
  updColumnPos,
  updColumnLead,
  listColumn,
  setOpportunityVal,
  removeCard,
  listLeadsColumn
} from "../controller/columnController.js";

const router = express.Router();

//Routes related to leads
router
  .route("/")
  .get(isAuthenticated, retrieveColumn) // Retrieve all leads
  .post(isAuthenticated, createColumn) // Create a new Lead
  .put(isAuthenticated, updateColumn) // Update a specific lead
  .delete(isAuthenticated, deleteColumn); // Delete a specific lead

router.route("/:leadId/value").put(isAuthenticated, setOpportunityVal);

router.route("/position").put(isAuthenticated, updColumnPos);
router
  .route("/leads")
  .put(isAuthenticated, updColumnLead)
  .get(isAuthenticated, listColumn)
  .delete(isAuthenticated, removeCard);

router.route("/dashboard").get(isAuthenticated, listLeadsColumn);

export default router;
