import asyncHandler from "express-async-handler";
import Task from "../models/taskModel.js";
import Lead from "../models/leadModel.js";
import Column from "../models/columnModel.js"
import Deal from "../models/dealModel.js"
import { Parser } from "json2csv";


// @desc    Log User
// route    GET /login/success
// @access  Private

const logUser = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({ message: "Success", user });
});

// @desc    Logout User
// route    GET /logout
// @access  Private

const logOut = asyncHandler(async (req, res, next) => {
  // Call the logout method provided by Passport.js
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // Redirect the user to the url after logout
    res.redirect("http://localhost:3000");
  });
});

// @desc Get User Tasks
// route GET /tasks
// @access Private

const getUserTasks = asyncHandler(async (req, res) => {
  // Get the userId from the authenticated user
  const { _id: userId } = req.user;

  const tasks = await Task.find({ user: userId });

  if (!tasks) {
    return res.status(404).json({ message: "Tasks not found" });
  }

  return res.status(201).json(tasks); // Return the created task
});

// @desc Get User Tasks
// route GET /tasks/date
// @access Private

const getDateTasks = asyncHandler(async (req, res) => {
  // Get the userId from the authenticated user
  const { _id: userId } = req.user;

  const { date } = req.query;

  const tasks = await Task.find({ user: userId, date: date });

  if (!tasks) {
    return res.status(404).json({ message: "Tasks not found" });
  }

  return res.status(201).json(tasks); // Return the created task
});

// @desc Get Lead Details
// route GET /tasks/lead
// @access Private

const getLeadDetails = asyncHandler(async (req, res) => {
  // Get the userId from the authenticated user
  const { _id: userId } = req.user;

  const { lead } = req.query;

  const leadItem = await Lead.findOne({ _id: lead, user: userId });

  if (!leadItem) {
    return res.status(404).json({ message: "Lead not found" });
  }

  return res.status(201).json(leadItem); // Return the created task
});

const exportAllLeads = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const leads = await Lead.find({ user: userId, deleted: false});

  if (!leads || leads.length === 0) {
    return res.status(404).json({ message: "No leads found" });
  }

  // Define CSV fields based on lead schema (you might need to adjust this based on your schema)
  const fields = [
    "account",
    "email",
    "number",
    "status",
    "source",
    "address",
    "company",

    // Add more fields as needed
  ];

  try {
    // Convert leads to CSV format
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(leads);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
    const contentLength = Buffer.byteLength(csv, "utf8");
    res.setHeader("Content-Length", contentLength);
    res.send(csv);
  } catch (error) {
    console.error("Error exporting leads:", error);
    res.status(500).json({ message: "Failed to export leads" });
  }
});

const exportWarmLeads = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const leads = await Lead.find({
    status: "Warm",
    deleted: false,
    user: userId,
  });

  if (!leads || leads.length === 0) {
    return res.status(404).json({ message: "No leads found" });
  }

  // Define CSV fields based on lead schema (you might need to adjust this based on your schema)
  const fields = [
    "account",
    "email",
    "number",
    "status",
    "tags",
    "notes",
    "source",
    "address",
    "company",
    "column",
    "value"
    // Add more fields as needed
  ];

  try {
    // Convert leads to CSV format
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(leads);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=warmleads.csv");
    const contentLength = Buffer.byteLength(csv, "utf8");
    res.setHeader("Content-Length", contentLength);
    res.send(csv);
  } catch (error) {
    console.error("Error exporting leads:", error);
    res.status(500).json({ message: "Failed to export leads" });
  }
});

const exportColdLeads = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const leads = await Lead.find({ user: userId, status: "Cold", deleted: false});

  if (!leads || leads.length === 0) {
    return res.status(404).json({ message: "No leads found" });
  }

  // Define CSV fields based on lead schema (you might need to adjust this based on your schema)
  const fields = [
    "account",
    "email",
    "status",
    "source",
    "expirationDate"

    // Add more fields as needed
  ];

  try {
    // Convert leads to CSV format
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(leads);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=coldleads.csv");
    const contentLength = Buffer.byteLength(csv, "utf8");
    res.setHeader("Content-Length", contentLength);
    res.send(csv);
  } catch (error) {
    console.error("Error exporting leads:", error);
    res.status(500).json({ message: "Failed to export leads" });
  }
});

const exportDeadLeads = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const leads = await Lead.find({ user: userId, status: "Dead", deleted: false});

  if (!leads || leads.length === 0) {
    return res.status(404).json({ message: "No leads found" });
  }

  // Define CSV fields based on lead schema (you might need to adjust this based on your schema)
  const fields = [
    "account",
    "email",
    "status",
    "source",
    // Add more fields as needed
  ];

  try {
    // Convert leads to CSV format
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(leads);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=deadleads.csv");
    const contentLength = Buffer.byteLength(csv, "utf8");
    res.setHeader("Content-Length", contentLength);
    res.send(csv);
  } catch (error) {
    console.error("Error exporting leads:", error);
    res.status(500).json({ message: "Failed to export leads" });
  }
});

const exportColumn = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const columns = await Column.find({ user: userId });

  if (!columns || columns.length === 0) {
    return res.status(404).json({ message: "No columns found" });
  }

  // Define CSV fields based on lead schema (you might need to adjust this based on your schema)
  const fields = [
    "title",
    "leads",
    // Add more fields as needed
  ];

  try {
    // Convert leads to CSV format
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(columns);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=columns.csv");
    const contentLength = Buffer.byteLength(csv, "utf8");
    res.setHeader("Content-Length", contentLength);
    res.send(csv);
  } catch (error) {
    console.error("Error exporting leads:", error);
    res.status(500).json({ message: "Failed to export leads" });
  }
});

const exportDeals = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const deals = await Deal.find({ user: userId });

  if (!deals || deals.length === 0) {
    return res.status(404).json({ message: "No deals found" });
  }

  // Define CSV fields based on lead schema (you might need to adjust this based on your schema)
  const fields = [
    "name",
    "email",
    "phone",
    "project",
    "value",
    "deadline"
    // Add more fields as needed
  ];

  try {
    // Convert leads to CSV format
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(deals);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=deals.csv");
    const contentLength = Buffer.byteLength(csv, "utf8");
    res.setHeader("Content-Length", contentLength);
    res.send(csv);
  } catch (error) {
    console.error("Error exporting leads:", error);
    res.status(500).json({ message: "Failed to export leads" });
  }
});



export {
  logUser,
  logOut,
  getUserTasks,
  getDateTasks,
  getLeadDetails,
  exportAllLeads,
  exportWarmLeads,
  exportColdLeads,
  exportDeadLeads,
  exportColumn,
  exportDeals
};
