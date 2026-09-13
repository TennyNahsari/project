import { useState, useEffect } from "react";
import { apiFetch } from "../api.js";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function AttachmentList({ taskId, initialAttachments = [] }) {
  const [attachments, setAttachments] = useState(initialAttachments);
  const [uploading, setUploading] = useState(false);
  const { t } = useLanguage();

  const fetchAttachments = async () => {
    try {
      const data = await apiFetch(`/api/attachments/task/${taskId}`);
      setAttachments(data);
    } catch (err) {
      console.error("Fetch attachments error:", err);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchAttachments();
    }
  }, [taskId]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("taskId", taskId);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/attachments/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const newAttachment = await res.json();
        setAttachments((prev) => [newAttachment, ...prev]);
      } else {
        const error = await res.json();
        alert(error.message || "Failed to upload file");
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/api/attachments/${id}`, { method: "DELETE" });
      setAttachments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="rounded-xl border border-light-grey bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-dark-slate text-sm flex items-center gap-2">
          <span>📎</span> {t("attachments.title")} ({attachments.length})
        </h3>
        <label className="cursor-pointer rounded-lg bg-soft-coral/10 hover:bg-soft-coral/20 px-3 py-1.5 text-xs font-semibold text-soft-coral transition-all">
          {uploading ? t("common.loading") : `+ ${t("attachments.upload")}`}
          <input type="file" onChange={handleFileUpload} disabled={uploading} className="hidden" />
        </label>
      </div>

      <div className="space-y-2">
        {attachments.length === 0 ? (
          <p className="text-center text-xs text-soft-stone py-4">{t("attachments.noFiles")}</p>
        ) : (
          attachments.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 rounded-lg border border-light-grey hover:bg-soft-mist/40 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-deep-indigo/10 text-deep-indigo font-bold text-xs">
                  📄
                </div>
                <div className="min-w-0 flex-1">
                  <a
                    href={`http://localhost:4000${file.filepath}`}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate font-semibold text-xs text-dark-slate hover:text-soft-coral block"
                  >
                    {file.filename}
                  </a>
                  <span className="text-[10px] text-soft-stone">
                    {formatFileSize(file.fileSize)} • {file.user?.name || "User"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`http://localhost:4000${file.filepath}`}
                  download
                  className="text-xs text-soft-coral font-medium hover:underline"
                >
                  Download
                </a>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="text-xs text-muted-rose hover:underline"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
