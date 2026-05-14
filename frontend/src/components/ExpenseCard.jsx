/**
 * ExpenseCard — A single general expense item (bills, utilities, etc.)
 *
 * ─── Props ─────────────────────────────────────────────────────────────────
 *   id          : string | number  — unique ID
 *   name        : string           — expense category name, e.g. "Electricity"
 *   description : string           — one-liner detail
 *   amount      : string           — e.g. "₹1,240"
 *   category_id : number           — category FK used for edit
 *   date        : string           — ISO date string
 *   onEdit      : fn(itemData)     — called when Edit is tapped; parent opens EditSheet
 *   onDelete    : fn(id)           — optional callback after delete (triggers re-fetch)
 *
 * ─── Internal state ────────────────────────────────────────────────────────
 *   menuOpen : bool — controls the ⋮ three-dot dropdown visibility
 *
 * ─── Layout ────────────────────────────────────────────────────────────────
 *   [colored bar | name + description]        [amount | ⋮ menu]
 *   ─────────────────────────────────────────────────────────────────────────
 *   (empty left)                              date (right)
 */

import { useState, useRef, useEffect } from "react";
import { MoreVerticalIcon } from "../icons/dashboardIcons";
import { removeGeneralExpense } from "../services/generalExpenseService.js";

export function ExpenseCard(props) {
  const { id, name, description, amount, category_id, date, onEdit, onDelete } = props;

  // Controls the three-dot context menu dropdown
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking anywhere outside this card's menu area
  useEffect(() => {
    function handleOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  async function handleDelete() {
    const res = await removeGeneralExpense(id);
    console.log("[HomeFlow] Delete expense:", id);
    setMenuOpen(false);
    if (res && onDelete) onDelete(id);
  }

  function handleEdit() {
    if (onEdit) onEdit(props);
    setMenuOpen(false);
  }

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4
                 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      style={{ borderLeft: `4px solid #3660F9` }}
    >
      {/* ── Top row: name + description + amount + menu ── */}
      <div className="flex items-start justify-between gap-2">

        {/* Left: expense name + description */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-extrabold text-[#17161A] leading-snug truncate">
            {name}
          </p>
          {/* Description — one-liner */}
          <p className="mt-1 text-[11px] text-gray-400 font-medium truncate">
            {description}
          </p>
        </div>

        {/* Right: amount + three-dot menu */}
        <div className="flex items-start gap-2 flex-shrink-0">
          <div className="text-right">
            <p className="text-sm font-extrabold text-[#17161A]">{amount}</p>
          </div>

          {/* Three-dot menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400
                         hover:bg-gray-100 hover:text-gray-600 transition-all duration-150
                         active:scale-90"
              aria-label="More options"
            >
              <MoreVerticalIcon className="w-4 h-4" />
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div
                className="absolute right-0 top-8 z-30 w-32
                           bg-white rounded-xl shadow-xl border border-gray-100
                           overflow-hidden"
              >
                {/* Edit option */}
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700
                             hover:bg-[#EEF2FF] hover:text-[#3660F9] transition-colors flex items-center gap-2"
                >
                  ✏️ Edit
                </button>

                {/* Delete option */}
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-500
                             hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom row: date right-aligned ── */}
      <div className="flex items-center justify-end mt-2.5 pt-2.5 border-t border-gray-50">
        <p className="text-[10px] text-gray-400 font-medium">
          {(date ?? "").slice(0, 10)}
        </p>
      </div>
    </div>
  );
}
