import Project from "../models/Project.js";
import User from "../models/User.js";

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name required" });
    }

    const project = await Project.create({
      name,
      description: description || "",
      admin: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json(project);
  } catch {
    res.status(500).json({ message: "Failed to create project" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user.id })
      .populate("admin", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

export const addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json();

    if (project.admin.toString() !== req.user.id) return res.status(403).json();

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!project.members.includes(user._id)) {
      project.members.push(user._id);
      await project.save();
    }

    res.json(project);
  } catch {
    res.status(500).json();
  }
};
