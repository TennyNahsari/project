import { useLanguage } from "../contexts/LanguageContext.jsx";
import NotificationBell from "./NotificationBell.jsx";

export default function Topbar({ title, onLogout }) {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="flex items-center justify-between rounded-xl border border-light-grey bg-pure-white p-4 sm:p-5 shadow-soft">
      <div>
        <p className="text-xs uppercase tracking-wider text-soft-stone font-medium">{t("common.welcome")}</p>
        <h2 className="text-2xl font-semibold text-dark-slate tracking-tight">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <NotificationBell />

        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 rounded-lg border border-light-grey bg-white px-3 py-2 text-xs font-semibold text-dark-slate transition-all hover:bg-soft-mist hover:border-soft-stone"
          title={language === "en" ? "Switch to Indonesian" : "Ganti ke Bahasa Inggris"}
        >
          <svg className="h-4 w-4 text-soft-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <span className="uppercase">{language}</span>
        </button>
        
        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="rounded-lg border border-light-grey bg-white px-4 py-2 text-xs font-semibold text-muted-rose hover:bg-muted-rose/10 transition-all"
        >
          {t("common.logout")}
        </button>
      </div>
    </header>
  );
}
