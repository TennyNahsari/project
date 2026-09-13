import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext.jsx";

const COLUMNS = [
  { id: "To Do", key: "todo", color: "border-soft-stone/40 bg-soft-mist/40" },
  { id: "In Progress", key: "inProgress", color: "border-sky-400/40 bg-sky-50/40" },
  { id: "Review", key: "review", color: "border-amber-400/40 bg-amber-50/40" },
  { id: "Done", key: "done", color: "border-emerald-400/40 bg-emerald-50/40" },
];

export default function KanbanBoard({ tasks, onStatusChange, onTaskClick, onEditTask }) {
  const { t } = useLanguage();
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const navigate = useNavigate();

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData("taskId") || draggedTaskId;
    if (taskId) {
      await onStatusChange(Number(taskId), targetStatus);
    }
    setDraggedTaskId(null);
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-muted-rose/10 text-muted-rose border-muted-rose/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);
        const isTarget = dragOverColumn === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex flex-col rounded-xl border-2 p-3.5 transition-all duration-150 min-h-[500px] ${
              col.color
            } ${isTarget ? "border-soft-coral ring-2 ring-soft-coral/20 scale-[1.01]" : ""}`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-light-grey mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-dark-slate">
                  {t(`dashboard.status.${col.key}`)}
                </h3>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-soft-stone shadow-sm">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Task Cards Container */}
            <div className="flex flex-col gap-3 flex-1">
              {columnTasks.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-light-grey/80 text-xs text-soft-stone">
                  {t("kanban.dropHere")}
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={() => (onEditTask ? onEditTask(task) : null)}
                    className={`group relative flex flex-col gap-2.5 rounded-xl border border-light-grey bg-white p-4 shadow-sm hover:shadow-md hover:border-soft-coral/40 transition-all cursor-pointer ${
                      draggedTaskId === task.id ? "opacity-40 scale-95" : ""
                    }`}
                  >
                    {/* Project Name & Priority */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[11px] font-semibold text-soft-coral uppercase tracking-wide">
                        {task.project?.name || "General"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${getPriorityStyle(task.priority)}`}>
                          {task.priority === "High" ? t("tasks.priorities.high") : task.priority === "Medium" ? t("tasks.priorities.medium") : t("tasks.priorities.low")}
                        </span>
                        <span className="text-[11px] text-soft-stone opacity-0 group-hover:opacity-100 transition-opacity" title={t("kanban.clickToEdit")}>
                          ✏️
                        </span>
                      </div>
                    </div>

                    {/* Task Title (Clicking Title goes to Task Detail) */}
                    <h4
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onTaskClick) onTaskClick(task.id);
                        else navigate(`/tasks/${task.id}`);
                      }}
                      className="font-semibold text-sm text-dark-slate line-clamp-2 hover:text-soft-coral hover:underline transition-colors cursor-pointer"
                      title={t("kanban.clickToDetail")}
                    >
                      {task.title}
                    </h4>

                    {/* Progress Bar */}
                    <div className="w-full bg-light-grey/50 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-soft-coral h-full transition-all duration-300"
                        style={{ width: `${task.progress || 0}%` }}
                      />
                    </div>

                    {/* Footer Info: Assignee & Meta */}
                    <div className="flex items-center justify-between text-xs text-soft-stone pt-1 border-t border-light-grey/40">
                      <div className="flex items-center gap-1.5">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-deep-indigo text-[10px] font-bold text-white uppercase">
                          {task.assignee ? task.assignee.name.charAt(0) : "?"}
                        </div>
                        <span className="truncate max-w-[100px] font-medium text-dark-slate">
                          {task.assignee ? task.assignee.name : t("tasks.unassigned")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px]">
                        {task.subtasks?.length > 0 && (
                          <span title={t("subtasks.title")}>
                            ☑ {task.subtasks.filter((st) => st.isCompleted).length}/{task.subtasks.length}
                          </span>
                        )}
                        {task.attachments?.length > 0 && (
                          <span title={t("attachments.title")}>📎 {task.attachments.length}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
