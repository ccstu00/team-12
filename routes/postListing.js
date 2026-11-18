import { Router } from "express";
import * as postListingController from "../controllers/postListingController.js";
// ---------------
import { requireLogin } from "../middleware/requireLogin.js";
// ---------------
import { asyncHandler } from "../asyncHandler.js";

const router = Router();

//using mongoDB
//create post feature and have it save on the server
//this file handles everything about posting

// ---------------
// Reading listings is open to everyone; anything that changes a listing
// needs a logged-in user. Whether *this* user may change *this* listing is
// checked in the service, once the listing is loaded.
router.get("/", asyncHandler(postListingController.index));
router.post("/", requireLogin, asyncHandler(postListingController.create));
router.post("/classic", requireLogin, asyncHandler(postListingController.createClassic));
router.put("/:id", requireLogin, asyncHandler(postListingController.update));
router.delete("/:id", requireLogin, asyncHandler(postListingController.destroy));
// ---------------

export default router;
