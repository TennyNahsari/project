import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { apiFetch } from "../api.js";
import * as XLSX from 'xlsx';
import { useLanguage } from "../contexts/LanguageContext.jsx";
import KanbanBoard from "../components/KanbanBoard.jsx";

export default function Tasks() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 100, total: 0, totalPages: 0 });
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [viewMode, setViewMode] = useState("kanban"); // "table", "kanban", "gantt"

  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    assigneeId: "",
    startDate: "",
    dueDate: "",
    progress: 0,
    estimatedHours: ""
  });

  useEffect(() => {
    loadTasks();
  }, [pagination.page]);

  useEffect(() => {
    loadProjects();
    loadUsers();
    apiFetch("/api/users/me/profile")
      .then(setCurrentUser)
      .catch(console.error);
  }, []);

  const loadTasks = async () => {
    try {
      const data = await apiFetch(`/api/tasks?page=${pagination.page}&limit=${pagination.limit}`);
      setTasks(data.data || data);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await apiFetch("/api/projects?limit=1000");
      const projects = data.data || data;
      setProjects(Array.isArray(projects) ? projects.filter(p => p.status !== "Archived") : []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await apiFetch("/api/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      await apiFetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error(err);
      loadTasks(); // Rollback on error
    }
  };

  const handleExportExcel = async () => {
    try {
      const allData = await apiFetch(`/api/tasks?limit=10000`);
      let allTasks = allData.data || allData;

      let filteredTasks = allTasks;
      if (filterStatus !== "all") {
        filteredTasks = filteredTasks.filter(task => task.status === filterStatus);
      }
      if (filterProject !== "all") {
        filteredTasks = filteredTasks.filter(task => task.projectId === parseInt(filterProject));
      }

      const excelData = filteredTasks.map((task, index) => ({
        'No': index + 1,
        'Task Title': task.title,
        'Project': task.project?.name || '-',
        'Status': task.status,
        'Priority': task.priority,
        'Assignee': task.assignee?.name || t("tasks.unassigned"),
        'Progress': task.progress + '%',
        'Start Date': task.startDate ? new Date(task.startDate).toLocaleDateString('id-ID') : '-',
        'Due Date': task.dueDate ? new Date(task.dueDate).toLocaleDateString('id-ID') : '-',
        'Description': task.description || '-',
        'Created': new Date(task.createdAt).toLocaleDateString('id-ID')
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      ws['!cols'] = [
        { wch: 5 }, { wch: 35 }, { wch: 25 }, { wch: 12 }, { wch: 10 },
        { wch: 20 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 40 }, { wch: 15 }
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
      XLSX.writeFile(wb, `Tasks_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (err) {
      alert('Failed to export: ' + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        projectId: parseInt(formData.projectId),
        assigneeId: formData.assigneeId ? parseInt(formData.assigneeId) : null,
        progress: parseInt(formData.progress),
        estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : null
      };

      if (editingId) {
        await apiFetch(`/api/tasks/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      } else {
        await apiFetch("/api/tasks", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }
      loadTasks();
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (task) => {
    setFormData({
      projectId: task.projectId.toString(),
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      assigneeId: task.assigneeId ? task.assigneeId.toString() : "",
      startDate: task.startDate ? task.startDate.split("T")[0] : "",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      progress: task.progress,
      estimatedHours: task.estimatedHours ? task.estimatedHours.toString() : ""
    });
    setEditingId(task.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm(t("tasks.deleteConfirm"))) return;
    try {
      await apiFetch(`/api/tasks/${id}`, { method: "DELETE" });
      loadTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      projectId: "",
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      assigneeId: "",
      startDate: "",
      dueDate: "",
      progress: 0,
      estimatedHours: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus !== "all" && task.status !== filterStatus) return false;
    if (filterProject !== "all" && task.projectId !== parseInt(filterProject)) return false;
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "To Do": return "bg-muted-grey/20 text-soft-stone border border-muted-grey/30";
      case "In Progress": return "bg-soft-sky/15 text-soft-sky border border-soft-sky/30";
      case "Review": return "bg-soft-amber/15 text-soft-amber border border-soft-amber/30";
      case "Done": return "bg-muted-emerald/15 text-muted-emerald border border-muted-emerald/30";
      default: return "bg-muted-grey/20 text-soft-stone";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low": return "bg-muted-sage/15 text-muted-sage border border-muted-sage/30";
      case "Medium": return "bg-soft-amber/15 text-soft-amber border border-soft-amber/30";
      case "High": return "bg-soft-coral/15 text-soft-coral border border-soft-coral/30";
      default: return "bg-muted-sage/15 text-muted-sage";
    }
  };

  return (
    <Layout title={t("tasks.title")}>
      <div className="p-4 md:px-8 md:pb-8">
        {/* Header bar with controls */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-dark-slate md:hidden">{t("tasks.title")}</h2>
            
            {/* View Mode Switcher */}
            <div className="flex rounded-lg border border-light-grey bg-white p-1 shadow-sm">
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === "kanban"
                    ? "bg-deep-indigo text-white shadow-sm"
                    : "text-soft-stone hover:text-dark-slate"
                }`}
              >
                <span>📌</span> {t("views.kanban")}
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === "table"
                    ? "bg-deep-indigo text-white shadow-sm"
                    : "text-soft-stone hover:text-dark-slate"
                }`}
              >
                <span>☰</span> {t("views.table")}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportExcel}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-emerald-700 active:scale-[0.98] sm:flex-initial sm:px-4"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{t("common.export")}</span>
            </button>

            {(!currentUser || currentUser.role === "PM" || currentUser.role === "Admin") && (
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex-1 btn-coral text-xs py-2 px-3 sm:flex-initial sm:px-4"
              >
                <span>+ {t("tasks.newTask")}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <select
            className="flex-1 input-field"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">{t("tasks.allStatus")}</option>
            <option value="To Do">{t("tasks.statuses.todo")}</option>
            <option value="In Progress">{t("tasks.statuses.inProgress")}</option>
            <option value="Review">{t("tasks.statuses.review")}</option>
            <option value="Done">{t("tasks.statuses.done")}</option>
          </select>
          <select
            className="flex-1 input-field"
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
          >
            <option value="all">{t("tasks.allProjects")}</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Task Form Modal / Inline */}
        {showForm && (
          <div className="mb-6 rounded-xl border border-light-grey bg-pure-white p-5 shadow-soft sm:p-6">
            <h3 className="mb-4 text-base font-semibold text-dark-slate sm:text-lg">
              {editingId ? t("tasks.editTask") : t("tasks.createTask")}
            </h3>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-soft-stone">{t("projects.title")}</label>
                <select
                  className="input-field"
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  required
                >
                  <option value="">{t("tasks.selectProject")}</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-soft-stone">{t("tasks.taskTitle")}</label>
                <input
                  type="text"
                  placeholder={t("tasks.taskTitle")}
                  className="input-field"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-soft-stone">{t("tasks.description")}</label>
                <textarea
                  placeholder={t("tasks.description")}
                  className="input-field"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-soft-stone">Status</label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option>{t("tasks.statuses.todo")}</option>
                    <option>{t("tasks.statuses.inProgress")}</option>
                    <option>{t("tasks.statuses.review")}</option>
                    <option>{t("tasks.statuses.done")}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-soft-stone">Priority</label>
                  <select
                    className="input-field"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option>{t("tasks.priorities.low")}</option>
                    <option>{t("tasks.priorities.medium")}</option>
                    <option>{t("tasks.priorities.high")}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-soft-stone">Assignee</label>
                <select
                  className="input-field"
                  value={formData.assigneeId}
                  onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                >
                  <option value="">{t("tasks.unassigned")}</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-soft-stone">{t("tasks.startDate")}</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-soft-stone">{t("tasks.dueDate")}</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="flex-1 btn-primary text-xs py-2.5">
                  {t("common.save")}
                </button>
                <button type="button" onClick={resetForm} className="flex-1 btn-secondary text-xs py-2.5">
                  {t("common.cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* View Switching Logic */}
        {viewMode === "kanban" && (
          <KanbanBoard
            tasks={filteredTasks}
            onStatusChange={handleStatusChange}
            onTaskClick={(id) => navigate(`/tasks/${id}`)}
            onEditTask={handleEdit}
          />
        )}

        {viewMode === "table" && (
          <div className="grid grid-cols-1 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleEdit(task)}
                className="group flex flex-col rounded-xl border border-light-grey bg-pure-white p-5 shadow-soft hover:-translate-y-0.5 hover:border-soft-coral/40 cursor-pointer transition-all"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 
                        className="cursor-pointer truncate text-base font-semibold text-dark-slate transition hover:text-soft-coral hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tasks/${task.id}`);
                        }}
                        title={t("kanban.clickToDetail")}
                      >
                        {task.title}
                      </h3>
                      <select
                        value={task.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(task.id, e.target.value);
                        }}
                        className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold cursor-pointer border focus:outline-none transition-colors ${getStatusColor(task.status)}`}
                        title="Click to change status"
                      >
                        <option value="To Do" className="bg-white text-dark-slate font-medium">{t("tasks.statuses.todo")}</option>
                        <option value="In Progress" className="bg-white text-dark-slate font-medium">{t("tasks.statuses.inProgress")}</option>
                        <option value="Review" className="bg-white text-dark-slate font-medium">{t("tasks.statuses.review")}</option>
                        <option value="Done" className="bg-white text-dark-slate font-medium">{t("tasks.statuses.done")}</option>
                      </select>
                      <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getPriorityColor(task.priority)}`}>
                        {task.priority === "High" ? t("tasks.priorities.high") : task.priority === "Medium" ? t("tasks.priorities.medium") : t("tasks.priorities.low")}
                      </span>
                      <span className="text-[11px] text-soft-stone opacity-0 group-hover:opacity-100 transition-opacity ml-auto" title={t("kanban.clickToEdit")}>
                        ✏️ {t("kanban.edit")}
                      </span>
                    </div>
                    {task.description && <p className="mb-3 line-clamp-2 text-xs text-soft-stone leading-relaxed">{task.description}</p>}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-soft-stone">
                      <div className="truncate font-medium text-dark-slate">📁 {task.project.name}</div>
                      {task.assignee && (
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-soft-coral text-[10px] font-semibold text-white">
                            {task.assignee.name.charAt(0).toUpperCase()}
                          </span>
                          <span>{task.assignee.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {(!currentUser || currentUser.role === "PM" || currentUser.role === "Admin") && (
                  <div className="mt-auto flex gap-2 border-t border-light-grey pt-3">
                    <button onClick={() => handleEdit(task)} className="flex-1 rounded-lg border border-light-grey bg-white py-1.5 text-xs font-semibold text-dark-slate hover:bg-soft-mist">
                      {t("common.edit")}
                    </button>
                    <button onClick={() => handleDelete(task.id)} className="flex-1 rounded-lg border border-muted-rose/30 bg-muted-rose/10 py-1.5 text-xs font-semibold text-muted-rose hover:bg-muted-rose/20">
                      {t("common.delete")}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

