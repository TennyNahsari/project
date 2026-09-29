import { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { apiFetch } from "../api.js";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import Pagination from "../components/Pagination.jsx";

export default function Activities() {
  const { t } = useLanguage();
  const [activities, setActivities] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [pagination.page]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/api/activities?page=${pagination.page}&limit=${pagination.limit}`);
      setActivities(data.data || data);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "comment":
        return "💬";
      case "task_update":
        return "📝";
      default:
        return "📌";
    }
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t("activities.justNow");
    if (diffMins < 60) return `${diffMins}${t("activities.minutesAgo")}`;
    if (diffHours < 24) return `${diffHours}${t("activities.hoursAgo")}`;
    if (diffDays < 7) return `${diffDays}${t("activities.daysAgo")}`;
    return time.toLocaleDateString();
  };

  return (
    <Layout title={t("activities.title")}>
      <div className="p-4 md:px-8 md:pb-8">
        <h2 className="mb-6 text-2xl font-semibold text-dark-slate md:hidden">{t("activities.title")}</h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-xs font-semibold text-soft-stone">{t("activities.loadingActivities")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="rounded-xl border border-light-grey bg-pure-white p-4 shadow-soft transition-transform hover:-translate-y-0.5 sm:p-5">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-deep-indigo/10 text-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-dark-slate text-sm">{activity.message}</p>
                    <p className="mt-0.5 text-xs text-soft-stone leading-relaxed">{activity.detail}</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-grey">
                      <span className="truncate font-medium text-dark-slate">👤 {activity.user}</span>
                      <span className="truncate">📁 {activity.project}</span>
                      <span className="flex-shrink-0">🕒 {getRelativeTime(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {activities.length === 0 && !loading && (
              <div className="rounded-xl border border-light-grey bg-pure-white p-12 text-center shadow-soft">
                <p className="text-xs text-soft-stone">{t("activities.noActivities")}</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(newPage) => setPagination({ ...pagination, page: newPage })}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
