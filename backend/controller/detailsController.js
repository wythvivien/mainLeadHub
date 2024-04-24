import asyncHandler from "express-async-handler";
import Lead from "../models/leadModel.js";
import Task from "../models/taskModel.js";

const deleteTag = asyncHandler(async (req, res) => {
  // Get lead account parameter from the route path
  const { leadAccount, tagName } = req.params;

  // Get the userId from the authenticated user
  const { _id: userId } = req.user;

  // Find and update a lead document
  const lead = await Lead.findOne({ user: userId, account: leadAccount });

  // Check if the lead exists
  if (!lead) {
    res.status(404).json({ message: "Lead not found" });
    return;
  }

  // Check if the tagId exists in the lead's tags array
  const tagIndex = lead.tags.findIndex((tag) => tag === tagName);
  if (tagIndex === -1) {
    res.status(404).json({ message: "Tag not found in lead" });
    return;
  }

  // Remove the tag from the tags array
  lead.tags.splice(tagIndex, 1);

  // Save the updated lead document
  await lead.save();

  res.status(200).json({ message: "Tag deleted successfully" });
});

const addNotes = asyncHandler(async (req, res) => {
  const { leadAccount } = req.params;
  // Get the userId from the authenticated user
  const { _id: userId } = req.user;

  const lead = await Lead.findOne({ user: userId, account: leadAccount });

  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  lead.notes.push(req.body);

  // Save the updated lead document
  await lead.save();

  // Return the updated lead with the added note
  res.json({ lead });
});

const deleteNote = asyncHandler(async (req, res) => {
  // Get lead account parameter from the route path
  const { leadAccount, noteId } = req.params;

  // Get the userId from the authenticated user
  const { _id: userId } = req.user;

  // Find and update a lead document
  const lead = await Lead.findOne({ user: userId, account: leadAccount });

  // Check if the lead exists
  if (!lead) {
    res.status(404).json({ message: "Lead not found" });
    return;
  }

  // Check if the tagId exists in the lead's tags array
  const noteIndex = lead.notes.findIndex((note) => note.id === noteId);
  if (noteIndex === -1) {
    res.status(404).json({ message: "Note not found in lead" });
    return;
  }

  // Remove the tag from the tags array
  lead.notes.splice(noteIndex, 1);

  // Save the updated lead document
  await lead.save();

  res.status(200).json({ message: "Note deleted successfully" });
});

const addTasks = asyncHandler(async (req, res) => {
  const { leadAccount } = req.params;
  // Get the userId from the authenticated user
  const { _id: userId } = req.user;
  const lead = await Lead.findOne({ user: userId, account: leadAccount });

  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  const task = await Task.create({
    ...req.body,
    lead: lead._id, // Assign the lead's ID to the task
    user: userId, // Assuming you have the authenticated user's ID available in req.user
  });

  return res.status(201).json(task); // Return the created task
});

const getTasks = asyncHandler(async (req, res) => {
  const { leadAccount } = req.params;

  // Get the userId from the authenticated user
  const { _id: userId } = req.user;

  const lead = await Lead.findOne({ user: userId, account: leadAccount});

  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  const task = await Task.find({
    lead: lead._id, // Assign the lead's ID to the task
    user: userId, // Assuming you have the authenticated user's ID available in req.user
    completed: false
  });

  return res.status(201).json(task); // Return the created task
});

const deleteTask = asyncHandler(async (req, res) => {
  // Get lead account parameter from the route path
  const { taskId } = req.params;

  const task = await Task.findByIdAndUpdate({taskId},{completed:true},{new:true});

  if (!task) {
    res.status(404).json({ message: "Task not Found" });
  }

  res.status(200).json({ message: "Task deleted successfully" });
});

export { deleteTag, addNotes, deleteNote, addTasks, getTasks, deleteTask };
