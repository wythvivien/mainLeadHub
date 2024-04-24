import asyncHandler from "express-async-handler";
import Deal from "../models/dealModel.js";
import Lead from "../models/leadModel.js";

const createDeal = asyncHandler(async (req, res) => {
  // Extracting the data submitted in request body

  // Get the user ID from the authenticated user
  const { _id: userId } = req.user;
  const { name } = req.body;
  const contacts = await Lead.find({ account: name, user: userId });

  if (!contacts) {
    res.status(404).json({ message: "Lead not Found" });
  }

  const { email, image, number } = contacts[0];

  console.log(email , number)
  // Create a new lead record into the database
  const deal = await Deal.create({
    user: userId, image, email, phone:number,
    ...req.body,
  });

  if (deal) {
    res.status(201).json(deal);
  } else {
    res.status(400);
    throw new Error("Invalid Deal Data");
  }
});

const retrieveDeals = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;

  const deals = await Deal.find({ user: userId });

  if (!deals) {
    res.status(404).json({ message: "Task not Found" });
  }

  res.status(201).json(deals);
});

const completeDeal = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { dealId, boolean } = req.query;
  const deal = await Deal.findOneAndUpdate(
    {
      user: userId,
      _id: dealId,
    },
    { completed: boolean},
    { new: true }
  );

  if (!deal) {
    res.status(404).json({ message: "Deal not updated successfully" });
    return;
  }

  res.status(200).json({ message: "Updated successfully", deal });
});
export { createDeal, retrieveDeals, completeDeal };
