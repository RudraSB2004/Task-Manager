import { useEffect, useState } from "react";
import API from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { setProjects } from "../features/projectSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  EnvelopeIcon,
  FolderIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
const Button = ({ children, icon: Icon, primary, ...props }) => (
  <button
    {...props}
    className={`flex items-center gap-2.5 px-6 py-3 rounded-xl transition duration-300 font-medium ${
      primary
        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }`}
  >
    {Icon && <Icon className="w-5 h-5" />}
    {children}
  </button>
);

const Input = ({ icon: Icon, placeholder, error, ...props }) => (
  <div className="relative">
    {Icon && (
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    )}
    <input
      {...props}
      placeholder={placeholder}
      className={`w-full ${
        Icon ? "pl-12" : "pl-4"
      } pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 focus:outline-none placeholder-gray-400 transition ${
        error ? "border-red-400" : ""
      }`}
    />
    {error && (
      <span className="text-xs text-red-500 absolute -bottom-4 right-1">
        {error}
      </span>
    )}
  </div>
);

const Loader = () => (
  <div className="fixed inset-0 flex flex-col gap-4 items-center justify-center bg-gray-50/70 backdrop-blur-sm z-50">
    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    <span className="text-gray-600 font-medium text-lg">
      Loading Projects...
    </span>
  </div>
);

const EmptyState = ({ onAddProject }) => (
  <div className="text-center bg-white border border-gray-100 p-12 rounded-2xl shadow-sm flex flex-col items-center gap-6">
    <div className="bg-blue-50 p-6 rounded-full">
      <PlusCircleIcon className="w-16 h-16 text-blue-500" />
    </div>
    <div className="space-y-1">
      <h2 className="text-2xl font-semibold text-gray-900">No projects yet</h2>
      <p className="text-gray-600 max-w-sm">
        Create your first project to start managing tasks with your team
        effectively.
      </p>
    </div>
    <Button primary onClick={onAddProject} icon={PlusIcon}>
      Create First Project
    </Button>
  </div>
);

const ProjectCard = ({ project, onClick }) => {
  const todoCount = project.taskCounts?.todo || 0;
  const inProgressCount = project.taskCounts?.inprogress || 0;
  const doneCount = project.taskCounts?.done || 0;

  const totalTasks = todoCount + inProgressCount + doneCount;
  const progressPercentage =
    totalTasks === 0 ? 0 : Math.round((doneCount / totalTasks) * 100);

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm cursor-pointer transition-all hover:border-gray-200 group flex flex-col gap-5"
    >
      <div className="flex items-center gap-4">
        <div className="bg-gray-100 p-3.5 rounded-xl text-blue-600 group-hover:bg-blue-50 transition">
          <FolderIcon className="w-7 h-7" />
        </div>
        <div className="flex-1 space-y-0.5">
          <h2 className="font-semibold text-xl text-gray-950 group-hover:text-blue-700 transition">
            {project.name}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-1">
            {project.description}
          </p>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-5 flex flex-col gap-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Overall Progress</span>
          <span className="font-bold text-gray-900">{progressPercentage}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Task Number Badges */}
        <div className="flex gap-2 pt-1">
          <div className="flex-1 text-center py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100">
            To Do: {todoCount}
          </div>
          <div className="flex-1 text-center py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-semibold border border-yellow-100">
            In Progress: {inProgressCount}
          </div>
          <div className="flex-1 text-center py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold border border-green-100">
            Done: {doneCount}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const projects = useSelector((state) => state.projects);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorName, setErrorName] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects");
        dispatch(setProjects(res.data));
      } catch {
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const createProject = async () => {
    setErrorName("");
    if (!name.trim()) {
      setErrorName("Project name is required.");
      return;
    }
    try {
      const res = await API.post("/projects", { name, description });
      dispatch(setProjects([res.data, ...projects]));
      setShowModal(false);
      setName("");
      setDescription("");
      toast.success("Project created successfully!");
    } catch {
      toast.error("Failed to create project");
    }
  };

  return (
    <>
      {loading && <Loader />}

      {/* Background with a subtle gradient */}
      <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 text-gray-900">
        <div className="max-w-[1400px] mx-auto space-y-10">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <div className="space-y-1">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-950">
                Projects Overview
              </h1>
              <p className="text-gray-600 text-lg">
                Manage all your projects and collaborate with your team.
              </p>
            </div>
            <Button primary onClick={() => setShowModal(true)} icon={PlusIcon}>
              Add New Project
            </Button>
          </div>

          {/* Project List */}
          {projects.length === 0 ? (
            <EmptyState onAddProject={() => setShowModal(true)} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((p) => (
                <ProjectCard
                  key={p._id}
                  project={p}
                  onClick={() => navigate(`/project/${p._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center p-6 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-white p-8 md:p-10 rounded-3xl w-full max-w-lg shadow-2xl space-y-8"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-gray-950">
                    Create a New Project
                  </h2>
                  <p className="text-gray-600">
                    Provide details to define your project.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <XMarkIcon className="w-7 h-7" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="font-semibold text-gray-800 pl-1">
                    Project Name *
                  </label>
                  <Input
                    placeholder="E.g., SkyNet Alpha"
                    icon={FolderIcon}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errorName}
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-gray-800 pl-1">
                    Description (Optional)
                  </label>
                  <Input
                    placeholder="Short summary of the project."
                    icon={PencilSquareIcon}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 justify-end pt-2">
                <Button onClick={() => setShowModal(false)}>Cancel</Button>
                <Button primary onClick={createProject} icon={PlusCircleIcon}>
                  Create Project
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
