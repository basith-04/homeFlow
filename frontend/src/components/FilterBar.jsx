/**
 * FilterBar — Horizontal scrollable pill filters + search input.
 *
 * ─── Props ─────────────────────────────────────────────────────────────────
 *   filters      : string[]  — list of filter labels, e.g. ["All","This Week",…]
 *   activeFilter : string    — currently active filter (controlled from parent)
 *   onFilter     : fn(label) — called when a pill is tapped
 *   searchQuery  : string    — current search text (controlled from parent)
 *   onSearch     : fn(str)   — called on search input change
 *
 * ─── Layout ────────────────────────────────────────────────────────────────
 *   [All] [This Week] [This Month]   ← horizontally scrollable, no wrap
 *   [🔍 Search items...            ] ← full-width search bar below
 *
 * The active filter pill gets #3660F9 background + white text.
 * Inactive pills are white with gray text and a light border.
 */

import { SearchIcon } from "../icons/dashboardIcons";

export default function FilterBar({
  filters = ["All", "This Week", "This Month"],
  activeFilter,
  onFilter,
  searchQuery,
  onSearch,
}) {
  return (
    <div className="mb-4">
      {/* ── Pill filter row — horizontally scrollable on small screens ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-3 scrollbar-hide">
        {filters.map((f) => {
          const isActive = f === activeFilter;
          return (
            <button
              key={f}
              id={`filter-${f.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => onFilter(f)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold
                border transition-all duration-200 whitespace-nowrap
                ${isActive
                  ? "bg-[#3660F9] text-white border-[#3660F9] shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[#3660F9]/40 hover:text-[#3660F9]"
                }
              `}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* ── Search bar ── */}
      <div className="relative flex items-center">
        {/* Search icon absolutely positioned on the left */}
        <span className="absolute left-3.5 text-gray-400 pointer-events-none">
          <SearchIcon className="w-4 h-4" />
        </span>

        <input
          id="grocery-search"
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="
            w-full bg-white border border-gray-200 rounded-xl
            pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400
            outline-none transition-all duration-200
            focus:border-[#3660F9] focus:ring-2 focus:ring-[#3660F9]/10
            hover:border-gray-300
          "
        />
      </div>
    </div>
  );
}
