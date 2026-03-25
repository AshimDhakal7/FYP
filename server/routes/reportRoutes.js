import express from "express";
import { downloadOwnerReport } from "../controllers/reportController.js";

const router = express.Router();

router.post("/owner/pdf", downloadOwnerReport);

export default router;