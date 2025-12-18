import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8000";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    const res = await axios.get(`${API}/tasks`);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title) return;
    await axios.post(`${API}/tasks`, { title });
    setTitle("");
    fetchTasks();
  };

  const toggleTask = async (id) => {
    await axios.put(`${API}/tasks/${id}`);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/tasks/${id}`);
    fetchTasks();
  };

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (tasks.filter((t) => t.completed).length / tasks.length) * 100
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-6">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1 text-gray-800">
          🧠 Smart Task Board
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          Stay focused. Get things done.
        </p>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            className="border border-gray-300 p-2 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="What do you need to do?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{progress}% completed</p>
        </div>

        {/* Task List */}
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between p-3 rounded-xl border bg-gray-50 hover:shadow-md transition"
            >
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="mt-1"
                />

                <div>
                  <p
                    className={`text-sm font-medium ${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </p>

                  <span
                    className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                      task.tag === "Quick"
                        ? "bg-green-100 text-green-700"
                        : task.tag === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {task.tag}
                  </span>
                </div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
