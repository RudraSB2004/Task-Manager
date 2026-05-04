import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTask,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", protect, createTask);
router.get("/:projectId", protect, getTasks);
router.put("/:id", protect, updateTask);

export default router;
