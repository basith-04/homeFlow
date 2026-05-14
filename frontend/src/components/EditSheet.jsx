/**
 * EditSheet — Bottom Sheet modal for editing an existing grocery purchase or
 *             general expense. Mirrors the AddEntry design exactly.
 *
 * ─── Props ────────────────────────────────────────────────────────────────
 *  isOpen      : bool       — controls slide-up animation
 *  onClose     : fn()       — called by overlay click or X button
 *  type        : "grocery" | "general"  — determines which form to render
 *  initialData : object     — pre-populated field values (see below)
 *  onSave      : fn(form)   — called with updated form data on "Update" press
 *  isSaving    : bool       — shows loading state on button while API call runs
 *
 * ─── initialData shape ────────────────────────────────────────────────────
 *  Grocery:
 *    { itemId, item, quantity, unit, amount, groceryDate }
 *  General:
 *    { description, amount, category, generalDate }
 *
 * ─── Component Tree ───────────────────────────────────────────────────────
 *  <EditSheet>
 *    ├─ Overlay
 *    └─ Sheet panel
 *        ├─ DragHandle
 *        ├─ SheetHeader (title + X close)
 *        ├─ Type badge (read-only pill showing grocery / general)
 *        ├─ GroceryEditForm  — when type === "grocery"
 *        └─ GeneralEditForm  — when type === "general"
 *        └─ UpdateButton
 */

import { useState, useRef, useEffect } from "react";
import SheetField from "./SheetField";
import {
  XIcon,
  CalendarIcon,
  PackageIcon,
  RulerIcon,
  CurrencyIcon,
  FileTextIcon,
  TagIcon,
  SearchIcon,
} from "../icons/dashboardIcons";
import { getItems } from "../services/itemServices.js";
import { getExpenseCategories } from "../services/generalExpenseService.js";

// ─── Constants ──────────────────────────────────────────────────────────────
const UNITS = ["kg", "L", "pcs", "g", "dozen", "ml", "pack"];

// ─── Shared input className ─────────────────────────────────────────────────
const INPUT_CLS = `
  w-full bg-white border border-gray-200 rounded-xl
  pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400
  outline-none transition-all duration-200
  focus:border-[#3660F9] focus:ring-2 focus:ring-[#3660F9]/10
  hover:border-gray-300 appearance-none
`.trim();

// ════════════════════════════════════════════════════════════════════════════
// GroceryEditForm
// ════════════════════════════════════════════════════════════════════════════
function GroceryEditForm({ form, setForm }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    getItems().then(setSuggestions);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = suggestions.filter((s) =>
    s.name.toLowerCase().includes(form.item.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      {/* ── Item with Autocomplete ── */}
      <div ref={wrapperRef} className="relative">
        <SheetField label="Item" icon={<SearchIcon />}>
          <input
            id="edit-item"
            type="text"
            placeholder="e.g. Tomato"
            value={form.item}
            className={INPUT_CLS}
            onChange={(e) => {
              setForm((f) => ({ ...f, item: e.target.value }));
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => form.item.length > 0 && setShowSuggestions(true)}
            autoComplete="off"
          />
        </SheetField>

        {showSuggestions && filtered.length > 0 && (
          <ul className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-44 overflow-y-auto">
            {filtered.map((s) => (
              <li
                key={s.id}
                className="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-[#EEF2FF] hover:text-[#3660F9] transition-colors flex items-center gap-2"
                onMouseDown={() => {
                  setForm((f) => ({ ...f, itemId: s.id, item: s.name, unit: s.default_unit }));
                  setShowSuggestions(false);
                }}
              >
                <span className="text-base">🛒</span>
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Quantity + Unit ── */}
      <div className="flex gap-3">
        <div className="flex-1">
          <SheetField label="Quantity" icon={<PackageIcon />}>
            <input
              id="edit-quantity"
              type="number"
              min="0"
              placeholder="0"
              value={form.quantity}
              onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
              className={INPUT_CLS}
            />
          </SheetField>
        </div>
        <div className="w-28">
          <SheetField label="Unit" icon={<RulerIcon />}>
            <select
              id="edit-unit"
              value={form.unit}
              onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
              className={INPUT_CLS + " cursor-pointer"}
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </SheetField>
        </div>
      </div>

      {/* ── Price ── */}
      <SheetField label="Price (₹)" icon={<CurrencyIcon />}>
        <input
          id="edit-price"
          type="number"
          min="0"
          placeholder="0.00"
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          className={INPUT_CLS}
        />
      </SheetField>

      {/* ── Date ── */}
      <SheetField label="Date" icon={<CalendarIcon />}>
        <input
          id="edit-grocery-date"
          type="date"
          value={form.groceryDate}
          onChange={(e) => setForm((f) => ({ ...f, groceryDate: e.target.value }))}
          className={INPUT_CLS}
        />
      </SheetField>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// GeneralEditForm
// ════════════════════════════════════════════════════════════════════════════
function GeneralEditForm({ form, setForm }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getExpenseCategories().then(setCategories);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* ── Description ── */}
      <SheetField label="Description" icon={<FileTextIcon />}>
        <input
          id="edit-description"
          type="text"
          placeholder="e.g. Electricity bill"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className={INPUT_CLS}
        />
      </SheetField>

      {/* ── Amount ── */}
      <SheetField label="Amount (₹)" icon={<CurrencyIcon />}>
        <input
          id="edit-amount"
          type="number"
          min="0"
          placeholder="0.00"
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          className={INPUT_CLS}
        />
      </SheetField>

      {/* ── Category ── */}
      <SheetField label="Category" icon={<TagIcon />} hint="Choose the expense type">
        <select
          id="edit-category"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className={INPUT_CLS + " cursor-pointer"}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </SheetField>

      {/* ── Date ── */}
      <SheetField label="Date" icon={<CalendarIcon />}>
        <input
          id="edit-general-date"
          type="date"
          value={form.generalDate}
          onChange={(e) => setForm((f) => ({ ...f, generalDate: e.target.value }))}
          className={INPUT_CLS}
        />
      </SheetField>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// EditSheet — Root export
// ════════════════════════════════════════════════════════════════════════════
export default function EditSheet({ isOpen, onClose, type, initialData, onSave, isSaving }) {
  const isGrocery = type === "grocery";

  // ── Grocery form state ─────────────────────────────────────────────────
  const [groceryForm, setGroceryForm] = useState({
    itemId: 0,
    item: "",
    quantity: "",
    unit: "kg",
    amount: "",
    groceryDate: new Date().toISOString().split("T")[0],
  });

  // ── General form state ─────────────────────────────────────────────────
  const [generalForm, setGeneralForm] = useState({
    description: "",
    amount: "",
    category: 1,
    generalDate: new Date().toISOString().split("T")[0],
  });

  // Sync form state whenever the sheet opens with new initialData
  useEffect(() => {
    if (isOpen && initialData) {
      if (isGrocery) {
        setGroceryForm({
          itemId: initialData.item_id ?? initialData.itemId ?? 0,
          item: initialData.item ?? "",
          quantity: initialData.quantity ?? "",
          unit: initialData.unit ?? "kg",
          amount: initialData.totalprice ?? initialData.amount ?? "",
          groceryDate: (initialData.date ?? "").slice(0, 10) || new Date().toISOString().split("T")[0],
        });
      } else {
        setGeneralForm({
          description: initialData.description ?? "",
          amount: initialData.amount ?? "",
          category: initialData.category_id ?? initialData.category ?? 1,
          generalDate: (initialData.date ?? "").slice(0, 10) || new Date().toISOString().split("T")[0],
        });
      }
    }
  }, [isOpen, initialData, isGrocery]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function handleUpdate() {
    if (isGrocery) {
      onSave(groceryForm);
    } else {
      onSave(generalForm);
    }
  }

  return (
    <>
      {/* ── Dark overlay ── */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]
          transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Sheet panel ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit entry"
        className={`
          fixed bottom-0 left-0 right-0 z-50
          max-h-[90vh] overflow-y-auto
          bg-white rounded-t-3xl
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `}
        style={{ boxShadow: "0 -12px 48px rgba(54,96,249,0.12), 0 -4px 16px rgba(0,0,0,0.08)" }}
      >
        {/* ── Drag Handle ── */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* ── Padded content area ── */}
        <div className="px-5 pb-8 pt-2">

          {/* ── Sheet Header ── */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-extrabold text-[#17161A] tracking-tight">
                Edit Entry
              </h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                Update the details below
              </p>
            </div>

            {/* X close button */}
            <button
              id="edit-sheet-close-btn"
              onClick={onClose}
              className="
                w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center
                text-gray-500 hover:bg-gray-200 hover:text-gray-700
                transition-all duration-150 active:scale-95
              "
              aria-label="Close edit sheet"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {/* ── Type badge — read-only pill ── */}
          <div className="mb-6">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={
                isGrocery
                  ? { background: "#EEF2FF", color: "#3660F9" }
                  : { background: "#F5FCD4", color: "#5a6e00" }
              }
            >
              {isGrocery ? "🛒 Grocery Purchase" : "📋 General Expense"}
            </span>
          </div>

          {/* ── Form area ── */}
          {isGrocery ? (
            <GroceryEditForm form={groceryForm} setForm={setGroceryForm} />
          ) : (
            <GeneralEditForm form={generalForm} setForm={setGeneralForm} />
          )}

          {/* ── Update button ── */}
          <button
            id="edit-update-btn"
            onClick={handleUpdate}
            disabled={isSaving}
            className={`
              w-full mt-7 py-4 rounded-full font-extrabold text-[15px]
              tracking-wide transition-all duration-200
              active:scale-[0.97] hover:opacity-90
              flex items-center justify-center gap-2
              disabled:opacity-60 disabled:cursor-not-allowed
            `}
            style={
              isGrocery
                ? {
                    background: "linear-gradient(135deg,#3660F9,#2a50e0)",
                    color: "#ffffff",
                    boxShadow: "0 8px 24px rgba(54,96,249,0.35)",
                  }
                : {
                    background: "#D1FD57",
                    color: "#17161A",
                    boxShadow: "0 8px 24px rgba(209,253,87,0.45)",
                  }
            }
          >
            {isSaving ? "Saving…" : "Update ✓"}
          </button>

          {/* Bottom safe-area spacer */}
          <div className="h-4" />
        </div>
      </div>
    </>
  );
}
