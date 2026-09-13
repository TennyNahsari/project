import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api.js";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const fetchNotifications = async () => {
    try {
      const data = await apiFetch("/api/notifications");
      setNotifications(data);
    } catch (err) {
      console.error("Fetch notifications error:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiFetch("/api/notifications/read-all", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = (item) => {
    if (!item.isRead) {
      apiFetch(`/api/notifications/${item.id}/read`, { method: "PATCH" }).catch(console.error);
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      );
    }
    if (item.link) {
      navigate(item.link);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-light-grey bg-white text-dark-slate transition-all hover:bg-soft-mist hover:border-soft-stone"
        title={t("notifications.title")}
      >
        <svg className="h-5 w-5 text-dark-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-soft-coral text-[10px] font-bold text-white shadow-sm animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-light-grey bg-white p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-light-grey pb-3 mb-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-dark-slate text-sm">{t("notifications.title")}</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-soft-coral/15 px-2 py-0.5 text-xs font-semibold text-soft-coral">
                  {unreadCount} {t("notifications.unread")}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-soft-coral hover:underline"
              >
                {t("notifications.markAllRead")}
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-light-grey/60 space-y-1">
            {notifications.length === 0 ? (
              <p className="py-6 text-center text-xs text-soft-stone">{t("notifications.noNotifications")}</p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`group relative flex flex-col gap-1 p-2.5 rounded-lg cursor-pointer transition-all ${
                    item.isRead ? "bg-white hover:bg-soft-mist/60 opacity-80" : "bg-soft-coral/5 hover:bg-soft-coral/10 font-medium"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold text-dark-slate">{item.title}</p>
                    <span className="text-[10px] text-soft-stone">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-soft-stone leading-relaxed">{item.message}</p>
                  {!item.isRead && (
                    <button
                      onClick={(e) => handleMarkRead(item.id, e)}
                      className="self-end text-[10px] text-soft-coral hover:underline mt-1"
                    >
                      ✓ Mark read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
