import { useState, useEffect } from "react";
import { apiFetch } from "../api.js";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function SubtaskList({ taskId, initialSubtasks = [], onProgressChange }) {
  const [subtasks, setSubtasks] = useState(initialSubtasks);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const fetchSubtasks = async () => {
    try {
      const data = await apiFetch(`/api/subtasks/task/${taskId}`);
      setSubtasks(data);
    } catch (err) {
      console.error("Fetch subtasks error:", err);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchSubtasks();
    }
  }, [taskId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setLoading(true);
    try {
      const created = await apiFetch(`/api/subtasks/task/${taskId}`, {
        method: "POST",
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      setSubtasks((prev) => [...prev, created]);
      setNewTitle("");
      if (onProgressChange) onProgressChange();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await apiFetch(`/api/subtasks/${id}/toggle`, { method: "PATCH" });
      setSubtasks((prev) => prev.map((st) => (st.id === id ? updated : st)));
      if (onProgressChange) onProgressChange();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/api/subtasks/${id}`, { method: "DELETE" });
      setSubtasks((prev) => prev.filter((st) => st.id !== id));
      if (onProgressChange) onProgressChange();
    } catch (err) {
      console.error(err);
    }
  };

  const completedCount = subtasks.filter((st) => st.isCompleted).length;
  const progressPercent = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

  return (
    <div className="rounded-xl border border-light-grey bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-dark-slate text-sm flex items-center gap-2">
          <span>☑</span> {t("subtasks.title")}
        </h3>
        <span className="text-xs text-soft-stone font-medium">
          {completedCount}/{subtasks.length} {t("subtasks.completed")} ({progressPercent}%)
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-light-grey/60 rounded-full h-2 overflow-hidden">
        <div
          className="bg-soft-coral h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Add Subtask Form */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder={t("subtasks.placeholder")}
          className="flex-1 rounded-lg border border-light-grey px-3 py-2 text-xs focus:border-soft-coral focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !newTitle.trim()}
          className="rounded-lg bg-deep-indigo px-4 py-2 text-xs font-semibold text-white hover:bg-deep-indigo/90 disabled:opacity-50 transition-all"
        >
          {t("subtasks.add")}
        </button>
      </form>

      {/* Subtask Items */}
      <div className="space-y-2">
        {subtasks.map((st) => (
          <div
            key={st.id}
            className="flex items-center justify-between p-2.5 rounded-lg border border-light-grey/60 hover:bg-soft-mist/40 transition-all"
          >
            <label className="flex items-center gap-3 cursor-pointer flex-1">
              <input
                type="checkbox"
                checked={st.isCompleted}
                onChange={() => handleToggle(st.id)}
                className="h-4 w-4 rounded border-light-grey text-soft-coral focus:ring-soft-coral"
              />
              <span className={`text-xs ${st.isCompleted ? "line-through text-soft-stone" : "text-dark-slate font-medium"}`}>
                {st.title}
              </span>
            </label>

            <button
              onClick={() => handleDelete(st.id)}
              className="text-muted-rose hover:text-red-700 text-xs px-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
