import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../features/taskSlice";
import KanbanBoard from "../components/KanbanBoard";
import toast from "react-hot-toast";

export default function Project() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks);
  const user = useSelector((state) => state.auth.user);

  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get(`/tasks/${id}`);
        dispatch(setTasks(res.data));
      } catch {
        toast.error("Failed to load tasks");
      }
    };
    fetchTasks();
  }, [id]);

  const createTask = async () => {
    try {
      const res = await API.post("/tasks", {
        title,
        project: id,
        assignedTo: user._id,
      });

      dispatch(setTasks([res.data, ...tasks]));
      setTitle("");
      toast.success("Task created");
    } catch {
      toast.error("Task creation failed");
    }
  };

  const addMember = async () => {
    try {
      await API.post(`/projects/${id}/add-member`, { email });
      setEmail("");
      toast.success("Member added");
    } catch {
      toast.error("Failed to add member");
    }
  };

  return (
    <div className="space-y-8 text-gray-900">
      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6 justify-between">
        <div className="flex gap-3 w-full">
          <input
            placeholder="Create new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
          />
          <button
            onClick={createTask}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm font-medium"
          >
            Add
          </button>
        </div>

        <div className="flex gap-3 w-full">
          <input
            type="email"
            placeholder="Add member (email)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 transition"
          />
          <button
            onClick={addMember}
            className="px-5 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition shadow-sm font-medium"
          >
            Add
          </button>
        </div>
      </div>

      <KanbanBoard />
    </div>
  );
}
