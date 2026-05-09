/**
 * AddEntry — Bottom Sheet modal for logging grocery or general expenses.
 *
 * ─── Data Flow ────────────────────────────────────────────────────────────
 *
 *  Dashboard.jsx
 *    └─ useState: sheetOpen (bool)
 *    └─ <FAB onClick={() => setSheetOpen(true)} />
 *    └─ <AddEntry isOpen={sheetOpen} onClose={() => setSheetOpen(false)} />
 *
 *  AddEntry (this file)
 *    ├─ activeTab  : "grocery" | "general"  → controls which form renders
 *    ├─ showSuggestions : bool              → autocomplete dropdown visibility
 *    │
 *    ├─ Grocery form state:
 *    │   item, quantity, unit, price, groceryDate
 *    │
 *    └─ General form state:
 *        description, amount, category, generalDate
 *
 * ─── Component Tree ───────────────────────────────────────────────────────
 *
 *  <AddEntry>
 *    ├─ Overlay (dark bg, onClick closes sheet)
 *    └─ Sheet panel (slides up from bottom)
 *        ├─ DragHandle (decorative pill)
 *        ├─ SheetHeader (title + X close button)
 *        ├─ TabToggle (Grocery / General pill switcher)
 *        ├─ GroceryForm  ─ rendered when activeTab === "grocery"
 *        │   ├─ ItemAutocomplete (text + dropdown)
 *        │   ├─ Quantity + Unit (side by side)
 *        │   ├─ Price
 *        │   └─ Date
 *        ├─ GeneralForm  ─ rendered when activeTab === "general"
 *        │   ├─ Description
 *        │   ├─ Amount
 *        │   ├─ Category select
 *        │   └─ Date
 *        └─ LogItButton (color switches by tab)
 *
 * ─── Props ────────────────────────────────────────────────────────────────
 *  isOpen  : bool    — controls slide-up animation
 *  onClose : fn()    — called by overlay click or X button
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
import { getItems } from "../services/itemServices.js"
import { addGroceryPurchase } from "../services/groceryServices.js";

// ─── Constants ──────────────────────────────────────────────────────────────

/** Unit options for quantity field */
const UNITS = ["kg", "L", "pcs", "g", "dozen", "ml", "pack"];

/** Expense categories for General tab */
const EXPENSE_CATEGORIES = [
  "Food", "Transport", "Utilities", "Medical", "Shopping", "Other",
];

// ─── Shared input className ─────────────────────────────────────────────────
// All <input> and <select> elements share this class string for visual consistency.
const INPUT_CLS = `
  w-full bg-white border border-gray-200 rounded-xl
  pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400
  outline-none transition-all duration-200
  focus:border-[#3660F9] focus:ring-2 focus:ring-[#3660F9]/10
  hover:border-gray-300 appearance-none
`.trim();

// ─── Helper — today's date as yyyy-mm-dd ────────────────────────────────────
function todayISO() {
  return new Date().toISOString().split("T")[0];
}

// ════════════════════════════════════════════════════════════════════════════
// GroceryForm
// Renders: Item (with autocomplete), Quantity + Unit (row), Price, Date
// ════════════════════════════════════════════════════════════════════════════
function GroceryForm({ form, setForm }) {


  // Controls the visibility of the autocomplete dropdown
  const [grocerySuggestions, setGrocerySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  useEffect(() => {
    fetchData()
  }, [])
  async function fetchData() {
    const res = await getItems()
    console.log("basith", res)
    setGrocerySuggestions(res)

  }

  // Filter suggestions based on current item input value (case-insensitive)
  let filtered = grocerySuggestions.filter((s) =>
    s.name.toLowerCase().includes(form.item.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-4">

      {/* ── Item with Autocomplete ── */}
      <div ref={wrapperRef} className="relative">
        <SheetField label="Item" icon={<SearchIcon />}>
          <input
            id="entry-item"
            type="text"
            placeholder="e.g. Tomato"
            value={form.item}
            className={INPUT_CLS}
            onChange={(e) => {
              setForm((f) => ({ ...f, item: e.target.value }));
              // Only show dropdown when user is actively typing something
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => form.item.length > 0 && setShowSuggestions(true)}
            autoComplete="off"
          />
        </SheetField>

        {/* Autocomplete dropdown — floats below the input */}
        {showSuggestions && filtered.length > 0 && (
          <ul
            className="
              absolute left-0 right-0 top-full mt-1 z-50
              bg-white border border-gray-200 rounded-xl shadow-lg
              overflow-hidden max-h-44 overflow-y-auto
            "
          >
            {filtered.map((s) => (
              <li
                key={s.id}
                className="
                  px-4 py-2.5 text-sm text-gray-700 cursor-pointer
                  hover:bg-[#EEF2FF] hover:text-[#3660F9] transition-colors
                  flex items-center gap-2
                "
                // On select: fill the input and close the dropdown
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

      {/* ── Quantity + Unit — side by side ── */}
      <div className="flex gap-3">
        {/* Quantity takes more space */}
        <div className="flex-1">
          <SheetField label="Quantity" icon={<PackageIcon />}>
            <input
              id="entry-quantity"
              type="number"
              min="0"
              placeholder="0"
              value={form.quantity}
              onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
              className={INPUT_CLS}
            />
          </SheetField>
        </div>

        {/* Unit select is narrower */}
        <div className="w-28">
          <SheetField label="Unit" icon={<RulerIcon />}>
            <select
              id="entry-unit"
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
          id="entry-price"
          type="number"
          min="0"
          placeholder="0.00"
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          className={INPUT_CLS}
        />
      </SheetField>

      {/* ── Date — defaults to today ── */}
      <SheetField label="Date" icon={<CalendarIcon />}>
        <input
          id="entry-grocery-date"
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
// GeneralForm
// Renders: Description, Amount, Category select, Date
// ════════════════════════════════════════════════════════════════════════════
function GeneralForm({ form, setForm }) {
  return (
    <div className="flex flex-col gap-4">

      {/* ── Description ── */}
      <SheetField label="Description" icon={<FileTextIcon />}>
        <input
          id="entry-description"
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
          id="entry-amount"
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
          id="entry-category"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className={INPUT_CLS + " cursor-pointer"}
        >
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </SheetField>

      {/* ── Date ── */}
      <SheetField label="Date" icon={<CalendarIcon />}>
        <input
          id="entry-general-date"
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
// AddEntry — Root export
// Manages all state and composes the sheet layout
// ════════════════════════════════════════════════════════════════════════════
export default function AddEntry({ isOpen, onClose }) {
  // Which tab is active — drives form render and button color
  const [activeTab, setActiveTab] = useState("grocery");//grocery or general

  // ── Grocery form state ──────────────────────────────────────────────────
  const [groceryForm, setGroceryForm] = useState({
    itemId: 0,
    item: "",
    quantity: "",
    unit: "kg",
    amount: "",
    groceryDate: todayISO(),
  });

  // ── General form state ──────────────────────────────────────────────────
  const [generalForm, setGeneralForm] = useState({
    description: "",
    amount: "",
    category: "Food",
    generalDate: todayISO(),
  });

  /**
   * handleLogIt — fires on "Log It ✓" press.
   * Logs the active form data to console.
   * In a real app this would dispatch to a store / call an API.S
   */
  async function handleLogIt() {
    const payload =
      activeTab === "grocery"
        ? { type: "grocery", ...groceryForm }
        : { type: "general", ...generalForm };

    if (payload.type === "grocery" && groceryForm.itemId != 0) {

      const res = await addGroceryPurchase(groceryForm)
      if (res) {
        setGroceryForm({
          itemId: 0,
          item: "",
          quantity: "",
          unit: "kg",
          amount: "",
          groceryDate: todayISO(),
        })
        onClose()
      }

    }
    console.log("[HomeFlow] New entry logged:", payload);

    onClose(); // close the sheet after logging
  }

  // Prevent body scroll when sheet is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* ── Dark overlay ── ─────────────────────────────────────────────────
          Fades in/out with the sheet. Clicking it closes the sheet.         */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]
          transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Sheet panel ── ──────────────────────────────────────────────────
          Slides up from bottom using translateY.
          rounded-t-3xl gives the "card popping up" feel.                    */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add entry"
        className={`
          fixed bottom-0 left-0 right-0 z-50
          max-h-[90vh] overflow-y-auto
          bg-white rounded-t-3xl
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `}
        style={{ boxShadow: "0 -12px 48px rgba(54,96,249,0.12), 0 -4px 16px rgba(0,0,0,0.08)" }}
      >

        {/* ── Drag Handle — decorative pill at top ─────────────────────── */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* ── Padded content area ─────────────────────────────────────── */}
        <div className="px-5 pb-8 pt-2">

          {/* ── Sheet Header: title + X close ─────────────────────────── */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-extrabold text-[#17161A] tracking-tight">
                Add Entry
              </h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                What did you spend on today?
              </p>
            </div>

            {/* X close button */}
            <button
              id="sheet-close-btn"
              onClick={onClose}
              className="
                w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center
                text-gray-500 hover:bg-gray-200 hover:text-gray-700
                transition-all duration-150 active:scale-95
              "
              aria-label="Close sheet"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {/* ── Tab Toggle: Grocery / General ─────────────────────────── 
              A pill-switcher that controls which form is shown below.
              Active tab gets #3660F9 bg + white text.
              Inactive tab is ghost/gray.                                   */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl mb-6">
            {[
              { key: "grocery", label: "🛒 Grocery" },
              { key: "general", label: "📋 General" },
            ].map(({ key, label }) => (
              <button
                key={key}
                id={`tab-${key}`}
                onClick={() => setActiveTab(key)}
                className={`
                  flex-1 py-2.5 rounded-xl text-sm font-bold
                  transition-all duration-200
                  ${activeTab === key
                    ? "bg-[#3660F9] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Form area — swaps based on activeTab ─────────────────── */}
          {activeTab === "grocery" ? (
            <GroceryForm form={groceryForm} setForm={setGroceryForm} />
          ) : (
            <GeneralForm form={generalForm} setForm={setGeneralForm} />
          )}

          {/* ── Log It button ─────────────────────────────────────────── 
              Color and shadow change based on active tab:
              - Grocery → #3660F9 blue + blue glow
              - General → #D1FD57 lime + lime glow + dark text             */}
          <button
            id="log-it-btn"
            onClick={handleLogIt}
            className={`
              w-full mt-7 py-4 rounded-full font-extrabold text-[15px]
              tracking-wide transition-all duration-200
              active:scale-[0.97] hover:opacity-90
              flex items-center justify-center gap-2
            `}
            style={
              activeTab === "grocery"
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
            Log It ✓
          </button>

          {/* Bottom safe-area spacer for phones with home indicator */}
          <div className="h-4" />
        </div>
      </div>
    </>
  );
}
