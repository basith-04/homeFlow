/**
 * PurchaseCard — A single grocery purchase list item.
 *
 * ─── Props ─────────────────────────────────────────────────────────────────
 *   item        : string  — product name, e.g. "Tomato"
 *   category    : string  — e.g. "Vegetable", "Dairy"
 *   quantity    : string  — e.g. "2 kg"
 *   totalPrice  : string  — e.g. "₹60"
 *   unitPrice   : string  — e.g. "₹30/kg"
 *   by          : string  — who logged it, e.g. "Basith"
 *   when        : string  — "Today" | "Yesterday" | date string
 *   accentColor : string  — left border color (hex), different per category
 *   tagColor    : string  — category pill text color
 *   tagBg       : string  — category pill bg color
 *
 * ─── Internal state ────────────────────────────────────────────────────────
 *   menuOpen : bool — controls the ⋮ three-dot dropdown visibility
 *                     Clicking outside the card closes it via document listener.
 *
 * ─── Layout ────────────────────────────────────────────────────────────────
 *   [colored bar | item + tag]        [amount + unit price | ⋮ menu]
 *   ─────────────────────────────────────────────────────────────────
 *   quantity (left)                   "by X • When" (right)
 */

import { useState, useRef, useEffect } from "react";
import { MoreVerticalIcon } from "../icons/dashboardIcons";
import { removeGroceryPurchase } from "../services/groceryServices";

export default function PurchaseCard(item) {
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

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4
                 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      // Colored left accent bar via border-left
      style={{ borderLeft: `4px solid #3660F9` }}
    >
      {/* ── Top row: item info + amount + menu ── */}
      <div className="flex items-start justify-between gap-2">

        {/* Left: item name + category tag */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-extrabold text-[#17161A] leading-snug truncate">
            {item.item}
          </p>
          {/* Category pill */}
          <span
            className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ color: "#3660F9", backgroundColor: "#EEF2FF" }}
          >
            {item.category}
          </span>
        </div>

        {/* Right: amount + unit price + three-dot menu */}
        <div className="flex items-start gap-2 flex-shrink-0">
          <div className="text-right">
            <p className="text-sm font-extrabold text-[#17161A]">{item.totalprice}</p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">{item.unitprice}</p>
          </div>

          {/* Three-dot menu — positioned relatively so dropdown aligns below */}
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

            {/* Dropdown menu — absolutely positioned, appears on click */}
            {menuOpen && (
              <div
                className="absolute right-0 top-8 z-30 w-32
                           bg-white rounded-xl shadow-xl border border-gray-100
                           overflow-hidden"
              >
                {/* Edit option */}
                <button
                  onClick={() => {
                    console.log("[HomeFlow] Edit:", item);
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700
                             hover:bg-[#EEF2FF] hover:text-[#3660F9] transition-colors flex items-center gap-2"
                >
                  ✏️ Edit
                </button>

                {/* Delete option */}
                <button
                  onClick={async () => {
                    const res= await removeGroceryPurchase(item.purchase_id)
                    console.log("[HomeFlow] Delete:", item);
                    setMenuOpen(false);
                  }}
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

      {/* ── Bottom row: quantity left, "by • when" right ── */}
      <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-gray-50">
        {/* Quantity badge */}
        <span
          className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
          style={{ color: "#3660F9", backgroundColor: "#EEF2FF" }}
        >
          {item.quantity}
        </span>

        {/* Logged-by info */}
        <p className="text-[10px] text-gray-400 font-medium">
          by {item.by} • {item.date.slice(0, 10)}
        </p>
      </div>
    </div>
  );
}
