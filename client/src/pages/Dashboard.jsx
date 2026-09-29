import { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { apiFetch } from "../api.js";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import Pagination from "../components/Pagination.jsx";

export default function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ 
    activeProjects: 0, 
    todayTasks: 0, 
    overdueTasks: 0,
    statusDistribution: { todo: 0, inProgress: 0, review: 0, done: 0 },
    projectProgress: []
  });
  const [projectPage, setProjectPage] = useState(1);
  const PROJECTS_PER_PAGE = 3;

  useEffect(() => {
    apiFetch("/api/dashboard")
      .then(setStats)
      .catch(console.error);
  }, []);

  const { statusDistribution, projectProgress } = stats;
  const totalTasks = statusDistribution.todo + statusDistribution.inProgress + 
                     statusDistribution.review + statusDistribution.done;

  return (
    <Layout title={t("dashboard.title")}>
      <div className="p-4 md:px-8 md:pb-8">
        {/* Mobile Title */}
        <h2 className="mb-6 text-2xl font-semibold text-dark-slate md:hidden">{t("dashboard.title")}</h2>
        
        {/* Main Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-light-grey bg-pure-white p-6 shadow-soft transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-soft-stone">{t("dashboard.activeProjects")}</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-deep-indigo/10 text-deep-indigo">
                📁
              </div>
            </div>
            <p className="text-3xl font-bold text-dark-slate">{stats.activeProjects}</p>
          </div>
          <div className="rounded-xl border border-light-grey bg-pure-white p-6 shadow-soft transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-soft-stone">{t("dashboard.tasksToday")}</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft-coral/10 text-soft-coral">
                📋
              </div>
            </div>
            <p className="text-3xl font-bold text-dark-slate">{stats.todayTasks}</p>
          </div>
          <div className="rounded-xl border border-light-grey bg-pure-white p-6 shadow-soft transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-soft-stone">{t("dashboard.overdueTasks")}</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted-rose/10 text-muted-rose">
                ⚠️
              </div>
            </div>
            <p className="text-3xl font-bold text-muted-rose">{stats.overdueTasks}</p>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="rounded-xl border border-light-grey bg-pure-white p-6 shadow-soft">
          <h3 className="mb-4 text-base font-semibold text-dark-slate">{t("dashboard.taskStatusDistribution")}</h3>
          
          {/* Visual Bar */}
          {totalTasks > 0 && (
            <div className="mb-6 flex h-6 w-full overflow-hidden rounded-lg bg-light-grey/50 p-1">
              {statusDistribution.todo > 0 && (
                <div
                  className="flex items-center justify-center bg-muted-grey text-[11px] font-semibold text-white rounded-sm transition-all"
                  style={{ width: `${(statusDistribution.todo / totalTasks) * 100}%` }}
                >
                  {statusDistribution.todo > 0 && Math.round((statusDistribution.todo / totalTasks) * 100) > 8 && `${statusDistribution.todo}`}
                </div>
              )}
              {statusDistribution.inProgress > 0 && (
                <div
                  className="flex items-center justify-center bg-soft-sky text-[11px] font-semibold text-white rounded-sm transition-all"
                  style={{ width: `${(statusDistribution.inProgress / totalTasks) * 100}%` }}
                >
                  {statusDistribution.inProgress > 0 && Math.round((statusDistribution.inProgress / totalTasks) * 100) > 8 && `${statusDistribution.inProgress}`}
                </div>
              )}
              {statusDistribution.review > 0 && (
                <div
                  className="flex items-center justify-center bg-soft-amber text-[11px] font-semibold text-white rounded-sm transition-all"
                  style={{ width: `${(statusDistribution.review / totalTasks) * 100}%` }}
                >
                  {statusDistribution.review > 0 && Math.round((statusDistribution.review / totalTasks) * 100) > 8 && `${statusDistribution.review}`}
                </div>
              )}
              {statusDistribution.done > 0 && (
                <div
                  className="flex items-center justify-center bg-muted-emerald text-[11px] font-semibold text-white rounded-sm transition-all"
                  style={{ width: `${(statusDistribution.done / totalTasks) * 100}%` }}
                >
                  {statusDistribution.done > 0 && Math.round((statusDistribution.done / totalTasks) * 100) > 8 && `${statusDistribution.done}`}
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-soft-mist border border-light-grey">
              <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-muted-grey"></div>
              <div className="min-w-0">
                <p className="truncate text-xs text-soft-stone">{t("dashboard.status.todo")}</p>
                <p className="text-base font-bold text-dark-slate">{statusDistribution.todo}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-soft-mist border border-light-grey">
              <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-soft-sky"></div>
              <div className="min-w-0">
                <p className="truncate text-xs text-soft-stone">{t("dashboard.status.inProgress")}</p>
                <p className="text-base font-bold text-dark-slate">{statusDistribution.inProgress}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-soft-mist border border-light-grey">
              <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-soft-amber"></div>
              <div className="min-w-0">
                <p className="truncate text-xs text-soft-stone">{t("dashboard.status.review")}</p>
                <p className="text-base font-bold text-dark-slate">{statusDistribution.review}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-soft-mist border border-light-grey">
              <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-muted-emerald"></div>
              <div className="min-w-0">
                <p className="truncate text-xs text-soft-stone">{t("dashboard.status.done")}</p>
                <p className="text-base font-bold text-dark-slate">{statusDistribution.done}</p>
              </div>
            </div>
          </div>

          {totalTasks > 0 && (
            <div className="mt-4 border-t border-light-grey pt-4 text-xs text-soft-stone">
              {t("dashboard.totalTasks")}: <span className="font-semibold text-dark-slate">{totalTasks}</span>
            </div>
          )}
        </div>

        {/* Project Progress Chart */}
        {projectProgress && projectProgress.length > 0 && (() => {
          const totalPages = Math.ceil(projectProgress.length / PROJECTS_PER_PAGE);
          const paginatedProjects = projectProgress.slice(
            (projectPage - 1) * PROJECTS_PER_PAGE,
            projectPage * PROJECTS_PER_PAGE
          );
          return (
            <div className="mt-8 rounded-xl border border-light-grey bg-pure-white p-6 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-dark-slate">{t("dashboard.projectProgress")}</h3>
                {totalPages > 1 && (
                  <span className="text-xs text-soft-stone font-medium">
                    {projectProgress.length} Projects
                  </span>
                )}
              </div>
              <div className="space-y-4">
                {paginatedProjects.map((project) => (
                  <div key={project.id}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-dark-slate text-sm">{project.name}</p>
                        <p className="text-xs text-soft-stone">{project.taskCount} {t("dashboard.tasks")}</p>
                      </div>
                      <span className="flex-shrink-0 text-xs font-semibold text-dark-slate">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-light-grey">
                      <div
                        className="h-full rounded-full bg-soft-coral transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 border-t border-light-grey pt-4">
                  <Pagination
                    currentPage={projectPage}
                    totalPages={totalPages}
                    onPageChange={setProjectPage}
                  />
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </Layout>
  );
}
