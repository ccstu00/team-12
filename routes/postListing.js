import { Router } from "express";
import * as postListingController from "../controllers/postListingController.js";
import { asyncHandler } from "../asyncHandler.js";

const router = Router();

//using mongoDB
//create post feature and have it save on the server
//this file handles everything about posting

router.get("/", asyncHandler(postListingController.index));
router.post("/", asyncHandler(postListingController.create));
router.post("/classic", asyncHandler(postListingController.createClassic));
router.put("/:id", asyncHandler(postListingController.update));
router.delete("/:id", asyncHandler(postListingController.destroy));

export default router;
