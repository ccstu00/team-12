import { Router } from "express";
import * as healthController from "../controllers/healthController.js";

const router = Router();

router.get("/", healthController.index);

export default router;
