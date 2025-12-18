import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

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
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const quickTasks = tasks.filter((t) => t.tag === "Quick").length;
  const mediumTasks = tasks.filter((t) => t.tag === "Medium").length;
  const deepTasks = tasks.filter((t) => t.tag === "Deep").length;

  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const productivityMessage = () => {
    if (completionRate === 100 && totalTasks > 0)
      return "🔥 Amazing! You completed all your tasks.";
    if (completionRate >= 70) return "💪 Great progress! You're almost there.";
    if (completionRate >= 40) return "🙂 Good start. Keep the momentum going.";
    return "🚀 Let's get started — small wins matter.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Glowing Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white border-opacity-20 p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center items-center gap-3 mb-2">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform rotate-3 animate-pulse">
                🧠
              </div>
              <h1 className="text-5xl font-black text-white">
                Smart Task Board
              </h1>
            </div>
            <p className="text-purple-200 opacity-70 text-sm font-medium tracking-wide">
              Stay focused. Finish what matters.
            </p>
          </div>

          {/* Input */}
          <div className="flex gap-3 mb-8">
            <input
              className="flex-1 px-6 py-4 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              placeholder="What do you want to work on?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask()}
            />
            <button
              onClick={addTask}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
            >
              Add
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-purple-200 opacity-80 mb-3 font-medium">
              <span>Overall Progress</span>
              <span className="text-purple-200 font-bold">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-white bg-opacity-10 rounded-full overflow-hidden backdrop-blur-sm border border-white border-opacity-10">
              <div
                className="h-3 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 transition-all duration-700 ease-out rounded-full shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-5 text-center transform transition-all duration-300 hover:scale-105 hover:bg-opacity-15">
              <p className="text-3xl font-black text-white mb-1">
                {totalTasks}
              </p>
              <p className="text-purple-200 opacity-70 text-xs font-medium uppercase tracking-wide">
                Total
              </p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-5 text-center transform transition-all duration-300 hover:scale-105 hover:bg-opacity-15">
              <p className="text-3xl font-black text-green-400 mb-1">
                {completedTasks}
              </p>
              <p className="text-purple-200 opacity-70 text-xs font-medium uppercase tracking-wide">
                Done
              </p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-5 text-center transform transition-all duration-300 hover:scale-105 hover:bg-opacity-15">
              <p className="text-3xl font-black text-orange-400 mb-1">
                {pendingTasks}
              </p>
              <p className="text-purple-200 opacity-70 text-xs font-medium uppercase tracking-wide">
                Pending
              </p>
            </div>
          </div>

          {/* Task Distribution */}
          <div className="bg-gradient-to-br from-purple-500 from-opacity-20 to-pink-500 to-opacity-20 backdrop-blur-sm border border-purple-300 border-opacity-30 rounded-2xl p-5 mb-6">
            <h2 className="text-sm font-bold text-purple-200 mb-4 flex items-center gap-2">
              <span className="text-lg">📊</span>
              Task Distribution
            </h2>

            <div className="flex justify-between text-sm mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-purple-100 font-medium">
                  Quick: {quickTasks}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span className="text-purple-100 font-medium">
                  Medium: {mediumTasks}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span className="text-purple-100 font-medium">
                  Deep: {deepTasks}
                </span>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
              <p className="text-sm text-purple-100 font-semibold text-center">
                {productivityMessage()}
              </p>
            </div>
          </div>

          {/* Task List */}
          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4 animate-bounce">✨</div>
              <p className="text-purple-200 opacity-60 text-lg font-medium">
                No tasks yet. Add one to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex justify-between items-start bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-5 hover:bg-opacity-15 hover:border-opacity-30 transition-all duration-300 transform hover:scale-102 hover:shadow-xl"
                >
                  <div className="flex gap-4 flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="mt-1 w-5 h-5 rounded-lg cursor-pointer accent-purple-500"
                    />

                    <div className="flex-1">
                      <p
                        className={`text-base font-semibold mb-2 transition-all duration-300 ${
                          task.completed
                            ? "line-through text-purple-300 opacity-50"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </p>

                      <span
                        className={`inline-block text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wide ${
                          task.tag === "Quick"
                            ? "bg-green-500 bg-opacity-30 text-green-300 border border-green-400 border-opacity-50"
                            : task.tag === "Medium"
                            ? "bg-yellow-500 bg-opacity-30 text-yellow-300 border border-yellow-400 border-opacity-50"
                            : "bg-red-500 bg-opacity-30 text-red-300 border border-red-400 border-opacity-50"
                        }`}
                      >
                        {task.tag}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-purple-300 opacity-50 hover:text-red-400 transition-all duration-300 text-2xl font-bold ml-4 opacity-0 group-hover:opacity-100 transform hover:scale-125"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
