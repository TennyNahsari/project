import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../api.js";
import { useLanguage } from "../contexts/LanguageContext.jsx";

const navItem = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 border-l-4 ${
    isActive
      ? "border-soft-coral bg-white/10 text-white font-semibold"
      : "border-transparent text-[#A0A0B0] hover:bg-white/5 hover:text-white"
  }`;

export default function Sidebar({ isOpen, onClose }) {
  const [currentUser, setCurrentUser] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    apiFetch("/api/users/me/profile")
      .then(setCurrentUser)
      .catch(console.error);
  }, []);

  const isPMorAdmin = currentUser && (currentUser.role === "PM" || currentUser.role === "Admin");

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-deep-indigo/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col bg-deep-indigo text-white p-6 transition-transform duration-200 md:static md:flex ${
        isOpen ? 'flex translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="font-brand text-2xl font-bold italic tracking-wide text-white">
            {t("sidebar.appName")}
          </h1>
          <p className="mt-1 text-xs text-[#A0A0B0] font-sans">{t("sidebar.appDescription")}</p>
          {currentUser && (
            <div className="mt-4 rounded-xl bg-white/10 p-3.5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-soft-coral text-sm font-semibold text-white">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{currentUser.name}</p>
                  <p className="text-xs text-soft-coral font-medium">{currentUser.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <nav className="flex flex-col gap-1.5 flex-1">
          <NavLink to="/" className={navItem} onClick={onClose}>
            <span>📊</span> {t("sidebar.dashboard")}
          </NavLink>
          <NavLink to="/projects" className={navItem} onClick={onClose}>
            <span>📁</span> {t("sidebar.projects")}
          </NavLink>
          <NavLink to="/tasks" className={navItem} onClick={onClose}>
            <span>📋</span> {t("sidebar.tasks")}
          </NavLink>
          <NavLink to="/activities" className={navItem} onClick={onClose}>
            <span>⚡</span> {t("sidebar.activities")}
          </NavLink>
          {isPMorAdmin && (
            <NavLink to="/users" className={navItem} onClick={onClose}>
              <span>👥</span> {t("sidebar.userManagement")}
            </NavLink>
          )}
        </nav>
      </aside>
    </>
  );
}
