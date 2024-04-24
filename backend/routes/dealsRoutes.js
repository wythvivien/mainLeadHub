import express from "express";
import isAuthenticated from "../middleware/auth.js";
import {createDeal, retrieveDeals, completeDeal} from "../controller/dealsController.js";

const router = express.Router();

//Routes related to leads
router.route("/").post(isAuthenticated, createDeal).get(isAuthenticated, retrieveDeals).put(isAuthenticated, completeDeal)

export default router; //test
