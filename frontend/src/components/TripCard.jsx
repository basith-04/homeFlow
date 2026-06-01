/**
 * TripCard — A single trip list item.
 *
 * ─── Props ───────────────────────────────────────────────────────────────────
 *   id         : string  — trip UUID
 *   name       : string  — e.g. "Goa Trip"
 *   type       : string  — "trip" | "outing"
 *   start_date : string  — ISO date "2024-12-20"
 *   end_date   : string  — ISO date "2024-12-26"
 *   onClick    : fn()    — called when card is tapped
 */

import PlaneIcon from "../icons/PlaneIcon";
import ShoppingBagIcon from "../icons/ShoppingBagIcon";
import { ChevronRightIcon } from "../icons/dashboardIcons";

// ── Date helpers (no date-fns required) ──────────────────────────────────────
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function parseIso(isoStr) {
  const [y, m, d] = isoStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatShort(isoStr) {
  const d = parseIso(isoStr);
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

function formatYear(isoStr) {
  return parseIso(isoStr).getFullYear();
}

function nightCount(startIso, endIso) {
  const diff = Math.abs(parseIso(endIso) - parseIso(startIso));
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

// ── Badge styles ──────────────────────────────────────────────────────────────
const TYPE_BADGE = {
  trip:   { bg: "bg-[#EEF2FF]", text: "text-[#3660F9]", label: "Trip" },
  outing: { bg: "bg-[#D1FD57]", text: "text-[#17161A]", label: "Outing" },
};

export default function TripCard({ id, name, type, start_date, end_date, onClick }) {
  const badge = TYPE_BADGE[type] ?? TYPE_BADGE.trip;
  const nights = nightCount(start_date, end_date);
  const nightLabel = nights === 1 ? "1 night" : `${nights} nights`;
  const dateRange = `${formatShort(start_date)} – ${formatShort(end_date)}, ${formatYear(end_date)}`;

  return (
    <div
      id={`trip-card-${id}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4
                 hover:shadow-md hover:border-[#3660F9]/20 transition-all duration-200 cursor-pointer"
    >
      {/* Icon circle */}
      <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
        {type === "outing"
          ? <ShoppingBagIcon size={18} color="#3660F9" />
          : <PlaneIcon size={18} color="#3660F9" />
        }
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Top row: name + badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-base font-semibold text-[#17161A] truncate">{name}</p>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
        </div>

        {/* Bottom row: date range + duration */}
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-gray-500 font-normal">{dateRange}</p>
          <span className="text-gray-300">·</span>
          <p className="text-xs text-gray-400 font-medium">{nightLabel}</p>
        </div>
      </div>

      {/* Chevron */}
      <ChevronRightIcon className="w-4 h-4 text-gray-400 shrink-0" />
    </div>
  );
}
