import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createProject,
  getProjects,
  addMember,
} from "../controllers/projectController.js";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.post("/:projectId/add-member", protect, addMember);

export default router;
