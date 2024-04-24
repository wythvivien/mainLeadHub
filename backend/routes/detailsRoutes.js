import express from "express";
import isAuthenticated from "../middleware/auth.js";
import {
  deleteTag,
  addNotes,
  deleteNote,
  addTasks,
  getTasks,
  deleteTask
} from "../controller/detailsController.js";

const router = express.Router();

router.route("/:leadAccount/:tagName").delete(isAuthenticated, deleteTag);
router.route("/:leadAccount/notes").post(isAuthenticated, addNotes);
router.route("/:leadAccount/notes/:noteId").delete(isAuthenticated, deleteNote);
router.route("/:leadAccount/tasks").post(isAuthenticated, addTasks).get(isAuthenticated, getTasks);
router.route("/:leadAccount/:tasks/:taskId").delete(isAuthenticated, deleteTask);

export default router;
