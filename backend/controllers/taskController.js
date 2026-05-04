import Task from "../models/Task.js";
import Project from "../models/Project.js";

export const createTask = async (req, res) => {
  try {
    const { title, project, assignedTo, status } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: "Title and project required" });
    }

    const proj = await Project.findById(project);

    if (!proj) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (proj.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only admin can create tasks" });
    }

    if (assignedTo && !proj.members.includes(assignedTo)) {
      return res.status(400).json({ message: "User not in project" });
    }

    const task = await Task.create({
      ...req.body,
      status: status || "todo",
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const proj = await Project.findById(projectId);

    if (!proj) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!proj.members.includes(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const proj = await Project.findById(task.project);

    const isAdmin = proj.admin.toString() === req.user.id;
    const isAssigned =
      task.assignedTo && task.assignedTo.toString() === req.user.id;

    if (!isAdmin && !isAssigned) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (req.body.assignedTo) {
      if (!proj.members.includes(req.body.assignedTo)) {
        return res.status(400).json({ message: "User not in project" });
      }
    }

    const updated = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("assignedTo", "name email");

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
  }
};
