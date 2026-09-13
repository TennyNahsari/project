import { useState, useEffect } from "react";
import { apiFetch } from "../api.js";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function WorklogList({ taskId, estimatedHours, initialWorklogs = [] }) {
  const [worklogs, setWorklogs] = useState(initialWorklogs);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [hoursInput, setHoursInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const fetchWorklogs = async () => {
    try {
      const data = await apiFetch(`/api/worklogs/task/${taskId}`);
      setWorklogs(data);
    } catch (err) {
      console.error("Fetch worklogs error:", err);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchWorklogs();
    }
  }, [taskId]);

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
    const hoursLogged = (timerSeconds / 3600).toFixed(2);
    setHoursInput(hoursLogged > 0 ? hoursLogged : "0.25");
  };

  const handleSaveLog = async (e) => {
    e.preventDefault();
    const hoursNum = parseFloat(hoursInput);
    if (isNaN(hoursNum) || hoursNum <= 0) return;

    setLoading(true);
    try {
      const created = await apiFetch(`/api/worklogs/task/${taskId}`, {
        method: "POST",
        body: JSON.stringify({
          hours: hoursNum,
          description: descInput.trim(),
        }),
      });
      setWorklogs((prev) => [created, ...prev]);
      setHoursInput("");
      setDescInput("");
      setTimerSeconds(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/api/worklogs/${id}`, { method: "DELETE" });
      setWorklogs((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const totalSpent = worklogs.reduce((sum, w) => sum + (w.hours || 0), 0);

  return (
    <div className="rounded-xl border border-light-grey bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-dark-slate text-sm flex items-center gap-2">
          <span>⏱</span> {t("worklogs.title")}
        </h3>
        <div className="flex items-center gap-3 text-xs">
          <span className="font-semibold text-soft-coral">
            {t("worklogs.totalSpent")}: {totalSpent.toFixed(2)} {t("worklogs.hours")}
          </span>
          {estimatedHours && (
            <span className="text-soft-stone">
              / {estimatedHours}h est.
            </span>
          )}
        </div>
      </div>

      {/* Timer Stopwatch Box */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-soft-mist/60 border border-light-grey">
        <div className="flex items-center gap-3">
          <span className="font-mono text-2xl font-bold tracking-wider text-deep-indigo">
            {formatTimer(timerSeconds)}
          </span>
          <span className="text-xs text-soft-stone">{t("worklogs.timer")}</span>
        </div>

        <div className="flex items-center gap-2">
          {!isTimerRunning ? (
            <button
              type="button"
              onClick={() => setIsTimerRunning(true)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-all"
            >
              ▶ {t("worklogs.startTimer")}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStopTimer}
              className="rounded-lg bg-muted-rose px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 transition-all"
            >
              ⏹ {t("worklogs.stopTimer")}
            </button>
          )}
        </div>
      </div>

      {/* Log Form */}
      <form onSubmit={handleSaveLog} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input
          type="number"
          step="0.1"
          min="0.1"
          value={hoursInput}
          onChange={(e) => setHoursInput(e.target.value)}
          placeholder={`${t("worklogs.hours")} (e.g. 1.5)`}
          className="rounded-lg border border-light-grey px-3 py-2 text-xs focus:border-soft-coral focus:outline-none"
        />
        <input
          type="text"
          value={descInput}
          onChange={(e) => setDescInput(e.target.value)}
          placeholder={t("worklogs.description")}
          className="rounded-lg border border-light-grey px-3 py-2 text-xs focus:border-soft-coral focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !hoursInput}
          className="rounded-lg bg-deep-indigo px-4 py-2 text-xs font-semibold text-white hover:bg-deep-indigo/90 disabled:opacity-50 transition-all"
        >
          {t("worklogs.log")}
        </button>
      </form>

      {/* History List */}
      <div className="space-y-2 pt-2">
        {worklogs.map((wl) => (
          <div
            key={wl.id}
            className="flex items-center justify-between p-2.5 rounded-lg border border-light-grey/60 text-xs"
          >
            <div>
              <span className="font-bold text-dark-slate">{wl.hours} hrs</span>
              <span className="text-soft-stone ml-2 font-medium">by {wl.user?.name}</span>
              {wl.description && <p className="text-soft-stone text-[11px] mt-0.5">{wl.description}</p>}
            </div>
            <button
              onClick={() => handleDelete(wl.id)}
              className="text-muted-rose hover:underline text-[11px]"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
