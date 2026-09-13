import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function LandingPage() {
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-rose-500 selection:text-white">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-rose-400 transition-colors">
              PM<span className="text-rose-500">Flow</span>
            </span>
          </div>

          {/* Desktop Nav Links & Actions */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
            <a href="#stats" className="hover:text-white transition-colors">Impact</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:border-slate-600 transition-all"
              title={language === "en" ? "Switch to Indonesian" : "Ganti ke Bahasa Inggris"}
            >
              <svg className="h-4 w-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="uppercase">{language}</span>
            </button>

            {isLoggedIn ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-semibold text-xs shadow-md hover:shadow-rose-500/25 hover:opacity-95 transition-all"
              >
                {t("landing.goToDashboard")} →
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-lg bg-rose-500 text-white font-semibold text-xs shadow-md hover:bg-rose-600 transition-all"
              >
                {t("landing.signIn")}
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-md border border-slate-700 bg-slate-800 text-xs font-bold text-slate-200 uppercase"
            >
              {language}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-900/95 px-4 pt-3 pb-6 space-y-3">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-300 hover:text-white">Features</a>
            <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-300 hover:text-white">Workflow</a>
            <a href="#stats" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-300 hover:text-white">Impact</a>
            <div className="pt-2">
              {isLoggedIn ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full py-2.5 rounded-lg bg-rose-500 text-white font-semibold text-xs text-center"
                >
                  {t("landing.goToDashboard")} →
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-2.5 rounded-lg bg-rose-500 text-white font-semibold text-xs text-center"
                >
                  {t("landing.signIn")}
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-semibold mb-6 shadow-sm">
          {t("landing.badge")}
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          {t("landing.heroTitle")}
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {t("landing.heroSubtitle")}
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-rose-500/20 hover:scale-105 transition-all"
          >
            {isLoggedIn ? t("landing.goToDashboard") : t("landing.getStarted")}
          </button>
          <a
            href="#features"
            className="px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-200 font-semibold text-sm hover:bg-slate-700 hover:border-slate-600 transition-all"
          >
            Explore Features ↓
          </a>
        </div>

        {/* Live Interactive Kanban Preview Mockup */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-6 shadow-2xl backdrop-blur-sm text-left">
          {/* Mock Window Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="ml-3 text-xs font-mono text-slate-400">pm-app.internal/dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold">
                ● Live Board
              </span>
            </div>
          </div>

          {/* Mock Kanban Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Column 1: To Do */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300">To Do</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">2</span>
              </div>

              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900 hover:border-rose-500/40 transition-colors">
                <div className="flex justify-between text-[10px] text-rose-400 font-semibold mb-1">
                  <span>UI REDESIGN</span>
                  <span className="text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">HIGH</span>
                </div>
                <h4 className="text-xs font-semibold text-white">Create Dark Mode Theme Switcher</h4>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>👤 Sarah</span>
                  <span>☑ 2/3</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900 hover:border-rose-500/40 transition-colors">
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold mb-1">
                  <span>BACKEND</span>
                  <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">LOW</span>
                </div>
                <h4 className="text-xs font-semibold text-white">Update Express Auth Middleware</h4>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>👤 Alex</span>
                  <span>📎 1</span>
                </div>
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="rounded-xl border border-sky-900/40 bg-sky-950/20 p-3 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-sky-400">In Progress</span>
                <span className="text-[10px] bg-sky-950 text-sky-400 px-2 py-0.5 rounded-full font-bold">1</span>
              </div>

              <div className="p-3 rounded-lg border border-sky-900/50 bg-slate-900 shadow-md">
                <div className="flex justify-between text-[10px] text-amber-400 font-semibold mb-1">
                  <span>ANALYTICS</span>
                  <span className="text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">MEDIUM</span>
                </div>
                <h4 className="text-xs font-semibold text-white">Build Excel & CSV Exporter</h4>
                <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-sky-400 h-full rounded-full" style={{ width: '65%' }} />
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>👤 Budi</span>
                  <span>⏱ 1.5h</span>
                </div>
              </div>
            </div>

            {/* Column 3: Review */}
            <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-3 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400">Review</span>
                <span className="text-[10px] bg-amber-950 text-amber-400 px-2 py-0.5 rounded-full font-bold">1</span>
              </div>

              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900">
                <div className="flex justify-between text-[10px] text-rose-400 font-semibold mb-1">
                  <span>API</span>
                  <span className="text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">HIGH</span>
                </div>
                <h4 className="text-xs font-semibold text-white">Multer File Upload Service</h4>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>👤 Michael</span>
                  <span>📎 3</span>
                </div>
              </div>
            </div>

            {/* Column 4: Done */}
            <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-3 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-emerald-400">Done</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full font-bold">2</span>
              </div>

              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900 opacity-80">
                <div className="flex justify-between text-[10px] text-emerald-400 font-semibold mb-1">
                  <span>DATABASE</span>
                  <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">COMPLETED</span>
                </div>
                <h4 className="text-xs font-semibold text-white line-through">Prisma PostgreSQL Migration</h4>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>👤 Developer</span>
                  <span>✓ 100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section id="stats" className="py-12 border-y border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-rose-500">100%</p>
            <p className="mt-1 text-xs text-slate-400 font-medium uppercase tracking-wider">Real-time Localization (EN/ID)</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-indigo-400">4 Columns</p>
            <p className="mt-1 text-xs text-slate-400 font-medium uppercase tracking-wider">Interactive Drag & Drop Kanban</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">Instant</p>
            <p className="mt-1 text-xs text-slate-400 font-medium uppercase tracking-wider">Excel & CSV Data Exporter</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-sky-400">Built-in</p>
            <p className="mt-1 text-xs text-slate-400 font-medium uppercase tracking-wider">Subtask Tracker & Worklogs</p>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {t("landing.featuresTitle")}
          </h2>
          <p className="mt-4 text-base text-slate-400">
            {t("landing.featuresSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-rose-500/50 hover:bg-slate-900 transition-all group">
            <div className="h-12 w-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center text-2xl font-bold mb-5 group-hover:scale-110 transition-transform">
              📌
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t("landing.kanbanTitle")}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t("landing.kanbanDesc")}</p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-indigo-500/50 hover:bg-slate-900 transition-all group">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-2xl font-bold mb-5 group-hover:scale-110 transition-transform">
              ☑️
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t("landing.subtasksTitle")}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t("landing.subtasksDesc")}</p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-emerald-500/50 hover:bg-slate-900 transition-all group">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl font-bold mb-5 group-hover:scale-110 transition-transform">
              ⏱️
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t("landing.timeTrackingTitle")}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t("landing.timeTrackingDesc")}</p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-sky-500/50 hover:bg-slate-900 transition-all group">
            <div className="h-12 w-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center text-2xl font-bold mb-5 group-hover:scale-110 transition-transform">
              📎
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t("landing.attachmentsTitle")}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t("landing.attachmentsDesc")}</p>
          </div>

          {/* Feature 5 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-amber-500/50 hover:bg-slate-900 transition-all group">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-2xl font-bold mb-5 group-hover:scale-110 transition-transform">
              🔔
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t("landing.notificationsTitle")}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t("landing.notificationsDesc")}</p>
          </div>

          {/* Feature 6 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-purple-500/50 hover:bg-slate-900 transition-all group">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-2xl font-bold mb-5 group-hover:scale-110 transition-transform">
              📊
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t("landing.exportTitle")}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t("landing.exportDesc")}</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-rose-600 via-indigo-600 to-purple-600 p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t("landing.ctaTitle")}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/80">
              {t("landing.ctaSubtitle")}
            </p>
            <button
              onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")}
              className="mt-8 px-8 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm shadow-xl hover:bg-slate-100 hover:scale-105 transition-all"
            >
              {isLoggedIn ? t("landing.goToDashboard") : t("landing.getStarted")}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white">PM<span className="text-rose-500">Flow</span></span>
            <span className="text-xs text-slate-500">© 2026 {t("landing.footerRights")}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <button onClick={toggleLanguage} className="hover:text-white uppercase font-bold">
              {language === "en" ? "🇮🇩 Bahasa Indonesia" : "🇺🇸 English"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
