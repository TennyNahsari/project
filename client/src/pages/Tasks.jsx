import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { apiFetch } from "../api.js";
import * as XLSX from 'xlsx';
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function Tasks() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    assigneeId: "",
    startDate: "",
    dueDate: "",
    progress: 0
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

  const handleExportExcel = async () => {
    try {
      // Fetch all tasks without pagination
      const allData = await apiFetch(`/api/tasks?limit=10000`);
      let allTasks = allData.data || allData;

      // Apply filters
      let filteredTasks = allTasks;
      
      // Filter by status
      if (filterStatus !== "all") {
        filteredTasks = filteredTasks.filter(task => task.status === filterStatus);
      }
      
      // Filter by project
      if (filterProject !== "all") {
        filteredTasks = filteredTasks.filter(task => task.projectId === parseInt(filterProject));
      }

      // Prepare data for Excel
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

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      ws['!cols'] = [
        { wch: 5 },  // No
        { wch: 35 }, // Task Title
        { wch: 25 }, // Project
        { wch: 12 }, // Status
        { wch: 10 }, // Priority
        { wch: 20 }, // Assignee
        { wch: 10 }, // Progress
        { wch: 15 }, // Start Date
        { wch: 15 }, // Due Date
        { wch: 40 }, // Description
        { wch: 15 }  // Created
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Tasks');

      // Generate filename with current date and filter info
      let fileName = `Tasks_${new Date().toISOString().split('T')[0]}`;
      if (filterProject !== "all") {
        const projectName = projects.find(p => p.id === parseInt(filterProject))?.name || 'Project';
        fileName += `_${projectName.replace(/[^a-zA-Z0-9]/g, '_')}`;
      }
      if (filterStatus !== "all") {
        fileName += `_${filterStatus.replace(/\s+/g, '_')}`;
      }
      fileName += '.xlsx';

      // Download file
      XLSX.writeFile(wb, fileName);
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
        progress: parseInt(formData.progress)
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
      progress: task.progress
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
      progress: 0
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

  const getPriorityDot = (priority) => {
    switch (priority) {
      case "Low": return "bg-muted-sage";
      case "Medium": return "bg-soft-amber";
      case "High": return "bg-soft-coral";
      default: return "bg-muted-sage";
    }
  };

  return (
    <Layout title={t("tasks.title")}>
      <div className="p-4 md:px-8 md:pb-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-dark-slate md:hidden">{t("tasks.title")}</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportExcel}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-muted-emerald px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-opacity-90 active:scale-[0.98] sm:flex-initial sm:px-4"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden xs:inline">{t("common.export")}</span>
              <span className="xs:hidden">Excel</span>
            </button>
            {(!currentUser || currentUser.role === "PM" || currentUser.role === "Admin") && (
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex-1 btn-coral text-xs py-2 px-3 sm:flex-initial sm:px-4"
              >
                <span className="hidden xs:inline">{t("tasks.newTask")}</span>
                <span className="xs:hidden">+ {t("common.create")}</span>
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

        {/* Task Form */}
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
              <div>
                <label className="mb-1 block text-xs font-medium text-soft-stone">{t("tasks.progress")}: <span className="font-semibold text-soft-coral">{formData.progress}%</span></label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  className="w-full accent-soft-coral cursor-pointer"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="flex-1 btn-primary text-xs py-2.5"
                >
                  {editingId ? t("common.save") : t("common.save")}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 btn-secondary text-xs py-2.5"
                >
                  {t("common.cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="flex flex-col rounded-xl border border-light-grey bg-pure-white p-5 shadow-soft transition-transform hover:-translate-y-0.5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${getPriorityDot(task.priority)}`} title={`Priority: ${task.priority}`} />
                    <h3 
                      className="cursor-pointer truncate text-base font-semibold text-dark-slate transition hover:text-soft-coral"
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    >
                      {task.title}
                    </h3>
                    <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getPriorityColor(task.priority)}`}>
                      {task.priority}
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
                    {task.startDate && (
                      <div className="truncate text-muted-grey">🗓️ {t("tasks.start")}: {new Date(task.startDate).toLocaleDateString()}</div>
                    )}
                    {task.dueDate && (
                      <div className="truncate text-muted-grey">📅 {t("tasks.due")}: {new Date(task.dueDate).toLocaleDateString()}</div>
                    )}
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-xs text-soft-stone">
                      <span>{t("tasks.progress")}</span>
                      <span className="font-semibold text-dark-slate">{task.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-light-grey">
                      <div
                        className="h-full rounded-full bg-soft-coral transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {(!currentUser || currentUser.role === "PM" || currentUser.role === "Admin") && (
                <div className="mt-auto flex flex-col gap-2 border-t border-light-grey pt-3 sm:flex-row">
                  <button
                    onClick={() => handleEdit(task)}
                    className="flex-1 rounded-lg border border-light-grey bg-white py-1.5 text-xs font-semibold text-dark-slate transition hover:bg-soft-mist"
                  >
                    {t("common.edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="flex-1 rounded-lg border border-muted-rose/30 bg-muted-rose/10 py-1.5 text-xs font-semibold text-muted-rose transition hover:bg-muted-rose/20"
                  >
                    {t("common.delete")}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="rounded-xl border border-light-grey bg-pure-white p-12 text-center shadow-soft">
            <p className="text-sm text-soft-stone">{t("tasks.noTasks")}</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="rounded-lg border border-light-grey bg-white px-4 py-2 text-xs font-semibold text-dark-slate transition hover:bg-soft-mist disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("common.previous")}
            </button>
            <span className="px-4 py-2 text-xs text-soft-stone font-medium">
              {t("common.page")} {pagination.page} {t("common.of")} {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.totalPages}
              className="rounded-lg border border-light-grey bg-white px-4 py-2 text-xs font-semibold text-dark-slate transition hover:bg-soft-mist disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("common.next")}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
