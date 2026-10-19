import { Router } from "express";
import * as searchController from "../controllers/searchController.js";
import { asyncHandler } from "../asyncHandler.js";

const router = Router();

// GET /search?q=bike
router.get("/", asyncHandler(searchController.index));

export default router;