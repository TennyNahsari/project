import React from "react";

/**
 * Helper to compute page numbers with initial pages, current area, ellipsis, and final pages.
 */
export const getPaginationItems = (currentPage, totalPages) => {
  if (totalPages <= 1) return [];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set();
  
  // Halaman awal (misal: 1, 2)
  pages.add(1);
  pages.add(2);
  
  // Sekitar halaman aktif
  pages.add(Math.max(1, currentPage - 1));
  pages.add(currentPage);
  pages.add(Math.min(totalPages, currentPage + 1));
  
  // Halaman akhir (misal: totalPages - 1, totalPages)
  pages.add(totalPages - 1);
  pages.add(totalPages);

  const sortedPages = Array.from(pages).filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const result = [];
  for (let i = 0; i < sortedPages.length; i++) {
    if (i > 0 && sortedPages[i] - sortedPages[i - 1] > 1) {
      result.push("...");
    }
    result.push(sortedPages[i]);
  }

  return result;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isDark = false,
  className = ""
}) {
  if (totalPages <= 1) return null;

  const items = getPaginationItems(currentPage, totalPages);

  const baseBtnClass = "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 min-w-[34px] flex items-center justify-center";

  const prevNextDark = "border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed";
  const prevNextLight = "border-light-grey bg-white text-dark-slate hover:bg-soft-mist disabled:opacity-40 disabled:cursor-not-allowed";

  const activeDark = "border-rose-500 bg-rose-500 text-white shadow-md shadow-rose-500/20 font-bold";
  const inactiveDark = "border-slate-800 bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white";

  const activeLight = "border-deep-indigo bg-deep-indigo text-white shadow-sm font-bold";
  const inactiveLight = "border-light-grey bg-white text-dark-slate hover:bg-soft-mist";

  return (
    <div className={`flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 ${className}`}>
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseBtnClass} ${isDark ? prevNextDark : prevNextLight}`}
        aria-label="Previous Page"
      >
        ‹ Prev
      </button>

      {/* Page Numbers */}
      {items.map((item, idx) => {
        if (item === "...") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className={`px-1.5 py-1 text-xs font-bold select-none ${isDark ? "text-slate-500" : "text-soft-stone"}`}
            >
              ...
            </span>
          );
        }

        const isCurrent = item === currentPage;
        return (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`${baseBtnClass} ${
              isDark
                ? isCurrent ? activeDark : inactiveDark
                : isCurrent ? activeLight : inactiveLight
            }`}
          >
            {item}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${baseBtnClass} ${isDark ? prevNextDark : prevNextLight}`}
        aria-label="Next Page"
      >
        Next ›
      </button>
    </div>
  );
}
