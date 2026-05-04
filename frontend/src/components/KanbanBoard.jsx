import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { setTasks } from "../features/taskSlice";
import API from "../services/api";

export default function KanbanBoard() {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const columns = {
    todo: {
      title: "To Do",
      color: "border-blue-500",
      items: tasks.filter((t) => t.status === "todo"),
    },
    inprogress: {
      title: "In Progress",
      color: "border-yellow-500",
      items: tasks.filter((t) => t.status === "inprogress"),
    },
    done: {
      title: "Done",
      color: "border-green-500",
      items: tasks.filter((t) => t.status === "done"),
    },
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const updated = tasks.map((t) =>
      t._id === result.draggableId
        ? { ...t, status: result.destination.droppableId }
        : t,
    );

    dispatch(setTasks(updated));

    try {
      await API.put(`/tasks/${result.draggableId}`, {
        status: result.destination.droppableId,
      });
    } catch {}
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(columns).map(([key, column]) => (
          <Droppable droppableId={key} key={key}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`rounded-2xl p-4 bg-gray-50 border ${column.color} border-opacity-40 min-h-[500px] transition ${
                  snapshot.isDraggingOver ? "bg-gray-100" : ""
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-lg text-gray-900">
                    {column.title}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {column.items.length}
                  </span>
                </div>

                {column.items.map((task, index) => (
                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`mb-3 p-4 rounded-xl bg-white border border-gray-200 shadow-sm transition-all ${
                          snapshot.isDragging
                            ? "scale-105 rotate-1 shadow-lg border-blue-400"
                            : "hover:bg-gray-50 hover:scale-[1.02]"
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {task.title}
                        </p>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
