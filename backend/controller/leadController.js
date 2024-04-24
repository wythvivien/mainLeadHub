import asyncHandler from "express-async-handler";
import Lead from "../models/leadModel.js";
import Column from "../models/columnModel.js";

// @desc    Create a new Lead Entry
// route    POST /api/leads
// @access  Private

const createLead = asyncHandler(async (req, res) => {
  // Extracting the data submitted in request body
  const { name, email, number, status } = req.body;

  // Get the user ID from the authenticated user
  const { _id: userId } = req.user;

  // Create a new lead record into the database
  const lead = await Lead.create({ userId, name, email, number, status });

  if (lead) {
    res.status(201).json(lead);
  } else {
    res.status(400);
    throw new Error("Invalid Lead Data");
  }
});

// @desc    Retrieve Lead Collection
// route    GET /api/leads
// @access  Private

const retrieveLeads = asyncHandler(async (req, res) => {
  // Get the userId from the authenticated user
  const { _id: userId } = req.user;

  // Retrieve lead collection from the database
  const leads = await Lead.find({ user: userId, deleted: false });
  res.status(200).json(leads);
});

// @desc    Get One Lead Document
// route    GET /api/leads/:id
// @access  Private

const getLead = asyncHandler(async (req, res) => {
  // Get lead account parameter from the route path
  const { leadAccount } = req.params;

  // Get the userId from the authenticated user
  const { _id: userId } = req.user;

  // Find a lead document with specified values
  const lead = await Lead.findOne({
    user: userId,
    account: leadAccount,
    deleted: false,
  });

  if (!lead) {
    res.status(404).json({ message: "Lead not found" });
    return;
  }
  res.status(200).json(lead);
});

// @desc    Update a Lead
// route    PUT /api/leads/:id
// @access  Private

const updateLead = asyncHandler(async (req, res) => {
  // Get lead account parameter from the route path
  const { leadId } = req.query;

  // Get the userId from the authenticated user
  const { _id: userId } = req.user;

  const column = await Column.findOneAndUpdate(
    {
      "leads._id": leadId, // Match the lead ID
    },
    {
      $pull: {
        leads: { _id: leadId }, // Remove the lead with the specified ID
      },
    },
    {
      new: true,
    }
  );

  if (!column) {
    res.status(404).json({ message: "The lead is not in the pipeline" });
  }

  // Find and update a lead document
  const lead = await Lead.findOne({
    user: userId,
    _id: leadId,
    deleted: false,
  });

  if (!lead) {
    res.status(404).json({ message: "Lead not updated successfully" });
    return;
  }

  lead.set(req.body);
  await lead.save();

  res.status(200).json({ message: "Updated successfully", lead });
});

// @desc    Update a Lead
// route    PUT /api/leads/:id
// @access  Private

const updateLeadDetails = asyncHandler(async (req, res) => {
  // Get lead account parameter from the route path
  const { leadAccount } = req.params;

  // Get the userId from the authenticated user
  const { _id: userId } = req.user;

  // Find and update a lead document
  const lead = await Lead.findOneAndUpdate(
    { user: userId, account: leadAccount, deleted: false },
    req.body,
    { new: true }
  );

  if (!lead) {
    res.status(404).json({ message: "Lead not updated successfully" });
    return;
  }

  res.status(200).json({ message: "Updated successfully", lead });
});

// @desc    Delete a Lead
// route    DELETE /api/leads/:id
// @access  Private

const deleteLead = asyncHandler(async (req, res) => {
  const { leadId } = req.query;
  // Get the userId from the authenticated user
  const { _id: userId } = req.user;
  // Find and delete a lead account
  const lead = await Lead.findOneAndUpdate(
    {
      user: userId,
      _id: leadId,
    },
    { deleted: true, $unset: { column: 1 } },
    { new: true }
  );

  const column = await Column.findOneAndUpdate(
    {
      "leads._id": leadId, // Match the lead ID
    },
    {
      $pull: {
        leads: { _id: leadId }, // Remove the lead with the specified ID
      },
    },
    {
      new: true,
    }
  );

  if (!column) {
    res.status(404).json({ message: "The lead is not in the pipeline" });
  }

  if (!lead) {
    res.status(404).json({ message: "Lead Not Found" });
    return;
  }

  res.status(200).json({ message: "Lead Deleted Successfully" });
});

const updateLeadColumn = asyncHandler(async (req, res) => {
  const { title, leadId } = req.query;
  const { _id: userId } = req.user;

  const lead = await Lead.findOneAndUpdate(
    { user: userId, _id: leadId, deleted: false },
    { $set: { column: title } },
    { new: true }
  );

  if (!lead) {
    res.status(404).json({ message: "Lead Not Updated" });
    return;
  }

  res.status(200).json({ message: "Lead Updated Successfully" });
});

const getLeadId = asyncHandler(async (req, res) => {
  // Get lead account parameter from the route path
  const { leadId } = req.query;

  // Get the userId from the authenticated user
  const { _id: userId } = req.user;

  // Find a lead document with specified values
  const lead = await Lead.findOne({
    user: userId,
    _id: leadId,
    deleted: false,
  });

  if (!lead) {
    res.status(404).json({ message: "Lead not found" });
    return;
  }
  res.status(200).json(lead);
});

const listLeads = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const leads = await Lead.find({ user: userId }, { _id: 0, account: 1, image: 1, status: 1 });
  

  if (!leads) {
    res.status(404).json({ message: "Leads not found" });
    return;
  }

  res.status(200).json(leads);
});

export {
  retrieveLeads,
  getLead,
  updateLeadDetails,
  createLead,
  updateLead,
  deleteLead,
  updateLeadColumn,
  getLeadId,
  listLeads
};
