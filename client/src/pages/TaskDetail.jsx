import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { apiFetch } from "../api.js";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import SubtaskList from "../components/SubtaskList.jsx";
import AttachmentList from "../components/AttachmentList.jsx";
import WorklogList from "../components/WorklogList.jsx";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");

  useEffect(() => {
    loadTask();
    loadComments();
    loadUsers();
  }, [id]);

  const loadTask = async () => {
    try {
      const data = await apiFetch(`/api/tasks/${id}`);
      setTask(data);
    } catch (err) {
      console.error(err);
      navigate("/tasks");
    }
  };

  const loadComments = async () => {
    try {
      const data = await apiFetch(`/api/comments/task/${id}`);
      setComments(data);
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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await apiFetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({
          taskId: parseInt(id),
          message: commentText
        })
      });
      setCommentText("");
      loadComments();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await apiFetch(`/api/comments/${commentId}`, { method: "DELETE" });
      loadComments();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setCommentText(value);

    const lastAtIndex = value.lastIndexOf("@");
    if (lastAtIndex !== -1) {
      const textAfterAt = value.slice(lastAtIndex + 1);
      if (!textAfterAt.includes(" ")) {
        setMentionSearch(textAfterAt.toLowerCase());
        setShowMentions(true);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionSelect = (user) => {
    const lastAtIndex = commentText.lastIndexOf("@");
    const newText = commentText.slice(0, lastAtIndex) + `@${user.name} `;
    setCommentText(newText);
    setShowMentions(false);
  };

  const filteredUsers = mentionSearch
    ? users.filter((u) => u.name.toLowerCase().includes(mentionSearch))
    : users;

  const getStatusColor = (status) => {
    switch (status) {
      case "To Do":
        return "bg-muted-grey/20 text-soft-stone border border-muted-grey/30";
      case "In Progress":
        return "bg-soft-sky/15 text-soft-sky border border-soft-sky/30";
      case "Review":
        return "bg-soft-amber/15 text-soft-amber border border-soft-amber/30";
      case "Done":
        return "bg-muted-emerald/15 text-muted-emerald border border-muted-emerald/30";
      default:
        return "bg-muted-grey/20 text-soft-stone";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "bg-muted-sage/15 text-muted-sage border border-muted-sage/30";
      case "Medium":
        return "bg-soft-amber/15 text-soft-amber border border-soft-amber/30";
      case "High":
        return "bg-soft-coral/15 text-soft-coral border border-soft-coral/30";
      default:
        return "bg-muted-sage/15 text-muted-sage";
    }
  };

  const renderCommentWithMentions = (text) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith("@")) {
        return (
          <span key={i} className="font-semibold text-soft-coral">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  if (!task) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center">
          <p className="text-xs font-semibold text-soft-stone">{t("common.loading")}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:px-8 md:pb-8 space-y-6">
        <button
          onClick={() => navigate("/tasks")}
          className="flex items-center gap-1.5 text-xs font-semibold text-deep-indigo hover:text-soft-coral transition"
        >
          ← {t("taskDetail.backToTasks")}
        </button>

        {/* Header Task Details */}
        <div className="rounded-xl border border-light-grey bg-pure-white p-6 shadow-soft">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold text-dark-slate sm:text-2xl">{task.title}</h2>
                <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${getStatusColor(task.status)}`}>
                  {task.status === "To Do" ? t("tasks.statuses.todo") : task.status === "In Progress" ? t("tasks.statuses.inProgress") : task.status === "Review" ? t("tasks.statuses.review") : t("tasks.statuses.done")}
                </span>
                <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                  {task.priority === "High" ? t("tasks.priorities.high") : task.priority === "Medium" ? t("tasks.priorities.medium") : t("tasks.priorities.low")}
                </span>
              </div>
              {task.description && (
                <p className="mb-4 text-xs text-soft-stone leading-relaxed">{task.description}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 border-t border-light-grey pt-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-lg bg-soft-mist p-3 border border-light-grey">
              <p className="text-[11px] font-medium text-soft-stone uppercase tracking-wider">{t("tasks.project")}</p>
              <p className="font-semibold text-dark-slate text-xs mt-0.5">{task.project.name}</p>
            </div>
            <div className="rounded-lg bg-soft-mist p-3 border border-light-grey">
              <p className="text-[11px] font-medium text-soft-stone uppercase tracking-wider">{t("tasks.assignee")}</p>
              <p className="font-semibold text-dark-slate text-xs mt-0.5">{task.assignee?.name || t("tasks.unassigned")}</p>
            </div>
            <div className="rounded-lg bg-soft-mist p-3 border border-light-grey">
              <p className="text-[11px] font-medium text-soft-stone uppercase tracking-wider">{t("tasks.startDate")}</p>
              <p className="font-semibold text-dark-slate text-xs mt-0.5">
                {task.startDate ? new Date(task.startDate).toLocaleDateString() : t("taskDetail.notSet")}
              </p>
            </div>
            <div className="rounded-lg bg-soft-mist p-3 border border-light-grey">
              <p className="text-[11px] font-medium text-soft-stone uppercase tracking-wider">{t("tasks.dueDate")}</p>
              <p className="font-semibold text-dark-slate text-xs mt-0.5">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : t("taskDetail.noDeadline")}
              </p>
            </div>
            <div className="rounded-lg bg-soft-mist p-3 border border-light-grey">
              <p className="text-[11px] font-medium text-soft-stone uppercase tracking-wider">{t("tasks.progress")}</p>
              <p className="font-semibold text-soft-coral text-xs mt-0.5">{task.progress}%</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-light-grey">
              <div
                className="h-full rounded-full bg-soft-coral transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Grid for Features C, D, E */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SubtaskList
            taskId={task.id}
            initialSubtasks={task.subtasks || []}
            onProgressChange={loadTask}
          />

          <WorklogList
            taskId={task.id}
            estimatedHours={task.estimatedHours}
            initialWorklogs={task.worklogs || []}
          />
        </div>

        <AttachmentList
          taskId={task.id}
          initialAttachments={task.attachments || []}
        />

        {/* Comments Section */}
        <div className="rounded-xl border border-light-grey bg-pure-white p-6 shadow-soft">
          <h3 className="mb-4 text-base font-semibold text-dark-slate">
            {t("taskDetail.comments")} ({comments.length})
          </h3>

          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="relative">
              <textarea
                className="input-field"
                rows="3"
                placeholder={t("taskDetail.addCommentPlaceholder")}
                value={commentText}
                onChange={handleCommentChange}
              />
              
              {showMentions && filteredUsers.length > 0 && (
                <div className="absolute bottom-full left-0 mb-2 w-64 rounded-xl border border-light-grey bg-pure-white p-1.5 shadow-modal z-20">
                  {filteredUsers.slice(0, 5).map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleMentionSelect(user)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition hover:bg-soft-mist"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-soft-coral text-[10px] font-semibold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-dark-slate">{user.name}</p>
                        <p className="truncate text-[11px] text-soft-stone">{user.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="mt-3 btn-coral text-xs py-2 px-4"
            >
              {t("taskDetail.postComment")}
            </button>
          </form>

          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-xl border border-light-grey bg-soft-mist/50 p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-deep-indigo text-xs font-semibold text-white">
                      {comment.user.name ? comment.user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-dark-slate text-xs">{comment.user.name}</p>
                      <p className="text-[11px] text-muted-grey">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-[11px] font-semibold text-muted-rose hover:underline"
                  >
                    {t("common.delete")}
                  </button>
                </div>
                <p className="mt-2 text-xs text-dark-slate leading-relaxed pl-10">{renderCommentWithMentions(comment.message)}</p>
              </div>
            ))}

            {comments.length === 0 && (
              <p className="py-8 text-center text-xs text-soft-stone">
                {t("taskDetail.noComments")}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
