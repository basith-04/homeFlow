/**
 * CategoryCards — Two summary cards: Groceries and General.
 *
 * ─── Props ─────────────────────────────────────────────────────────────────
 *   categories    : array   — override default mock data (optional)
 *   onGroceryClick: fn()    — called when the Groceries card is tapped.
 *                             Dashboard passes navigate("/grocery") here.
 *   onGeneralClick: fn()    — called when the General card is tapped (future).
 *
 * ─── How navigation works ──────────────────────────────────────────────────
 *   Dashboard owns sheetOpen state AND navigation.
 *   It passes onGroceryClick={()=> navigate("/grocery")} to this component.
 *   CategoryCard calls it via its own onClick handler.
 *   This keeps navigation logic in the page layer, not the card component.
 */

import { useState } from "react";

const CATEGORIES = [
  {
    id: "groceries",
    emoji: "🛒",
    label: "Groceries",
    amount: "₹2,940",
    entries: 8,
    accentColor: "#3660F9",
    bgColor: "#EEF2FF",
  },
  {
    id: "general",
    emoji: "📋",
    label: "General",
    amount: "₹1,340",
    entries: 4,
    accentColor: "#7C3AED",
    bgColor: "#F5F3FF",
  },
];

/**
 * CategoryCard — individual card.
 * Receives onClick so the parent (CategoryCards) can route it by card id.
 */
function CategoryCard({ emoji, label, amount, entries, accentColor, bgColor, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100
                 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
                 cursor-pointer active:scale-[0.98]"
    >
      {/* Icon pill */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3"
        style={{ backgroundColor: bgColor }}
      >
        {emoji}
      </div>

      {/* Label */}
      <p className="text-xs text-gray-400 font-semibold mb-1">{label}</p>

      {/* Amount */}
      <p className="text-lg font-extrabold text-[#17161A] tracking-tight leading-none mb-1.5">
        {amount}
      </p>

      {/* Entries badge */}
      <span
        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{ color: accentColor, backgroundColor: bgColor }}
      >
        {entries} entries
      </span>

      {/* "View all →" hint on hover */}
      <p className="text-[10px] mt-2 font-semibold" style={{ color: accentColor }}>
        View all →
      </p>
    </div>
  );
}

export default function CategoryCards({
  generalData,
  groceryData,
  onGroceryClick,
  onGeneralClick,
}) {
  // Route click to the correct prop based on card id

  function getClickHandler(id) {
    if (id === "groceries" && onGroceryClick) return onGroceryClick;
    if (id === "general" && onGeneralClick) return onGeneralClick;
    return undefined;
  }

  return (
    <div className="flex gap-3 mb-5">
      <CategoryCard
        id="groceries"
        emoji="🛒"
        label="Groceries"
        amount={groceryData.totalSpend}
        entries={groceryData.totalEntries}
        accentColor="#3660F9"
        bgColor="#EEF2FF"
        onClick={onGroceryClick}
      />
      <CategoryCard
        id="general"
        emoji="📋"
        label="General"
        amount={generalData.totalGeneralSpend}
        entries={generalData.totalGeneralEntries}
        accentColor="#7C3AED"
        bgColor="#F5F3FF"
        onClick={onGeneralClick}
      />
    </div>
  );
}

