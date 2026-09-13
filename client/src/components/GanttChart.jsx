import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function GanttChart({ tasks }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Generate 14-day date range starting from today or earliest task
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i - 2); // Show 2 days in past, 12 days in future
    return d;
  });

  const startDateRange = days[0];
  const endDateRange = days[days.length - 1];

  const calculateBarPosition = (task) => {
    const start = task.startDate ? new Date(task.startDate) : (task.createdAt ? new Date(task.createdAt) : today);
    const end = task.dueDate ? new Date(task.dueDate) : new Date(start.getTime() + 86400000 * 3);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const totalDaysRange = 14;
    const diffStartDays = Math.max(0, Math.floor((start - startDateRange) / (1000 * 60 * 60 * 24)));
    const durationDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

    const leftPercent = Math.min(100, (diffStartDays / totalDaysRange) * 100);
    const widthPercent = Math.min(100 - leftPercent, (durationDays / totalDaysRange) * 100);

    return { leftPercent, widthPercent: Math.max(7, widthPercent) };
  };

  return (
    <div className="rounded-xl border border-light-grey bg-white p-5 shadow-sm overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Timeline Header Row */}
        <div className="grid grid-cols-12 gap-2 border-b border-light-grey pb-3 mb-4">
          <div className="col-span-4 font-semibold text-xs text-soft-stone uppercase tracking-wider">
            {t("tasks.taskTitle")} & {t("tasks.project")}
          </div>
          <div className="col-span-8 grid grid-cols-14 gap-1">
            {days.map((day, idx) => {
              const isToday = day.toDateString() === today.toDateString();
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center p-1 rounded-md text-[10px] ${
                    isToday ? "bg-soft-coral text-white font-bold" : "text-soft-stone font-medium"
                  }`}
                >
                  <span>{day.toLocaleDateString("en-US", { weekday: "narrow" })}</span>
                  <span className="font-semibold">{day.getDate()}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Rows */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-center text-xs text-soft-stone py-8">{t("tasks.noTasks")}</p>
          ) : (
            tasks.map((task) => {
              const { leftPercent, widthPercent } = calculateBarPosition(task);
              return (
                <div
                  key={task.id}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="grid grid-cols-12 gap-2 items-center rounded-lg p-2 hover:bg-soft-mist/50 transition-all cursor-pointer group border border-transparent hover:border-light-grey"
                >
                  {/* Task Info Column */}
                  <div className="col-span-4 flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-semibold text-dark-slate truncate group-hover:text-soft-coral transition-colors">
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-soft-stone">
                      <span className="truncate text-soft-coral font-medium">{task.project?.name}</span>
                      <span>•</span>
                      <span>{task.progress || 0}%</span>
                    </div>
                  </div>

                  {/* Gantt Bar Column */}
                  <div className="col-span-8 relative h-7 bg-light-grey/30 rounded-lg flex items-center px-1 overflow-hidden">
                    <div
                      className="absolute h-5 rounded-md bg-gradient-to-r from-deep-indigo to-soft-coral flex items-center justify-between px-2 text-[10px] font-semibold text-white shadow-sm transition-all duration-300"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    >
                      <span className="truncate max-w-[80%]">{task.title}</span>
                      <span className="text-[9px] opacity-80">{task.progress || 0}%</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
