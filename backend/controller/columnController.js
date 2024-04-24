import asyncHandler from "express-async-handler";
import Column from "../models/columnModel.js";
import Lead from "../models/leadModel.js";
// @desc    Create a new Column
// route    POST /api/column
// @access  Private

const createColumn = asyncHandler(async (req, res) => {
  // Extracting the data submitted in request body
  const { title } = req.body;

  // Get the user ID from the authenticated user
  const { _id: userId } = req.user;

  // Create a new lead record into the database
  const column = await Column.create({ user: userId, title });

  if (column) {
    res.status(201).json(column);
  } else {
    res.status(400);
    throw new Error("Invalid Column Data");
  }
});

const updateColumn = asyncHandler(async (req, res) => {
  const { title, leadId } = req.query;
  const { _id: userId } = req.user;

  const column = await Column.findOne({ user: userId, title });

  if (!column) {
    res.status(404).json({ message: "Column Not Found" });
    return;
  }

  // Find the lead document based on its ID and populate the specified fields
  const lead = await Lead.findById(leadId).populate(
    "account email image updatedAt number tags"
  );

  if (!lead) {
    res.status(404).json({ message: "Lead Not Found" });
    return;
  }

  // Add the populated lead to the column's leads array
  column.leads.push(lead);

  // Save the changes to the column
  await column.save();

  res.status(200).json({ message: "Column Updated Successfully" });
});

const deleteColumn = asyncHandler(async (req, res) => {
  // Get lead account parameter from the route path
  const { columnId } = req.query;

  // Get the userId from the authenticated user
  const { _id: userId } = req.user;

  const column = await Column.findOne({
    user: userId,
    _id: columnId,
  });

  if (!column) {
    res.status(404).json({ message: "Column Not Found" });
    return;
  }

  // Find and delete a lead account
  if (column.leads.length === 0) {
    // If the leads array is empty, delete the column
    await Column.findOneAndDelete({ user: userId, _id: columnId });
    return res.status(200).json({ message: "Column Deleted Successfully" });
  }

  res.status(200).json({ message: "Column Deleted Successfully" });
});

const retrieveColumn = asyncHandler(async (req, res) => {
  // Get the userId from the authenticated user
  const { _id: userId } = req.user;

  // Retrieve lead collection from the database
  const column = await Column.find({ user: userId });
  res.status(200).json(column);
});

const updColumnPos = asyncHandler(async (req, res) => {
  const { title, position } = req.body;
  const { _id: userId } = req.user;

  const column = await Column.findOneAndUpdate(
    { user: userId, title },
    { $set: { position } }, // Using $push to add 'key' to the 'leads' array
    { new: true }
  );

  if (!column) {
    res.status(404).json({ message: "Column Not Updated" });
    return;
  }

  res.status(200).json({ message: "Column Updated Successfully" });
});

const updColumnLead = asyncHandler(async (req, res) => {
  const { title, leads } = req.body;
  const { _id: userId } = req.user;

  const column = await Column.findOneAndUpdate(
    { user: userId, title },
    { $set: { leads } }, // Using $push to add 'key' to the 'leads' array
    { new: true }
  );

  if (!column) {
    res.status(404).json({ message: "Column Not Updated" });
    return;
  }

  res.status(200).json({ message: "Column Updated Successfully" });
});

const listColumn = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const columns = await Column.find({ user: userId }, { _id: 0, title: 1 });
  const columnsOptions = columns.map((column) => column.title);
  if (columnsOptions.length > 0) {
    columnsOptions.unshift("Default"); // Add "Default" to the beginning of the array
  }
  res.json(columnsOptions);
});

const setOpportunityVal = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { leadId } = req.params;
  const { oppVal } = req.body;

  const column = await Column.findOneAndUpdate(
    {
      user: userId,
      // Query to find the column containing the specific lead
      leads: {
        $elemMatch: { _id: leadId }, // Replace "your_lead_id_here" with the ID you're searching for
      },
    },
    {
      // Update operation using the $set operator and positional $ operator
      $set: {
        "leads.$.oppVal": oppVal, // Replace "new_opportunity_value" with the new value you want to set
      },
    },
    {
      // Options for findOneAndUpdate
      new: true, // To return the updated document
    }
  );

  const lead = await Lead.findOneAndUpdate(
    {
      _id: leadId,
      user: userId,
    },
    { $set: { value: oppVal } },
    { new: true }
  );

  if (!lead) {
    res.status(404).json({ message: "Opportunity value not set" });
    return;
  }

  if (!column) {
    res.status(404).json({ message: "Opportunity value not set" });
    return;
  }

  res.status(200).json({ message: "Opportunity value set" });
});

const removeCard = asyncHandler(async (req, res) => {
  const { leadId } = req.query;
  const { _id: userId } = req.user;
  const column = await Column.findOneAndUpdate(
    {
      user: userId,
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

  await Lead.findOneAndUpdate(
    { _id: leadId },
    { $unset: { column: 1, value: 1 } },
    { new: true }
  );

  if (!column) {
    res.status(404).json({ message: "Board Card not removed" });
    return;
  }
  res.status(200).json({ message: "Board Card removed successfully" });
});

const listLeadsColumn = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;

  const leads = await Column.find(
    { user: userId, "leads.0": { $exists: true } },
    { _id: 0, leads: { $slice: 1 }, title: 1 }
  );

  if (!leads) {
    res.status(404).json({ message: "Could not retrieve Leads" });
  }

 const pipelinedata = leads.map((column) => ({
   title: column.title,
   leads: column.leads.map((lead) => ({
     image: lead.image,
     account: lead.account,
     oppVal: lead.oppVal,
   })),
 }));

  res.status(200).json(pipelinedata);
});

export {
  createColumn,
  deleteColumn,
  updateColumn,
  retrieveColumn,
  updColumnPos,
  updColumnLead,
  listColumn,
  setOpportunityVal,
  removeCard,
  listLeadsColumn,
};
