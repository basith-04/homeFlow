/**
 * GeneralExpenses — Full list view of logged general expenses.
 *
 * ─── Navigation ────────────────────────────────────────────────────────────
 *   Route: /general
 *
 * ─── State ─────────────────────────────────────────────────────────────────
 *   activeFilter : string  — "All" | "This Week" | "This Month"
 *   searchQuery  : string  — live text filter on expense name
 *   sheetOpen    : bool    — controls AddEntry bottom sheet
 *   editOpen     : bool    — controls EditSheet bottom sheet
 *   editTarget   : object  — the expense currently being edited
 *   isSaving     : bool    — loading state while PUT is in flight
 *
 * ─── Component tree ────────────────────────────────────────────────────────
 *   GeneralExpenses
 *     ├─ PageTopBar
 *     ├─ SummaryStrip
 *     ├─ FilterBar
 *     ├─ List of ExpenseCard (onEdit / onDelete wired)
 *     ├─ EmptyState
 *     ├─ FAB
 *     ├─ AddEntry
 *     └─ EditSheet
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import FAB from "../components/FAB";
import AddEntry from "../components/AddEntry";
import EditSheet from "../components/EditSheet";
import PageTopBar from "../components/PageTopBar";
import SummaryStrip from "../components/SummaryStrip";
import EmptyState from "../components/EmptyState";
import { getGeneralExpenses, editGeneralExpense } from "../services/generalExpenseService";
import { ExpenseCard } from "../components/ExpenseCard.jsx";

// ─── Filter logic ─────────────────────────────────────────────────────────────
function applyFilter(items, filter) {
  if (filter === "All") return items;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const day = today.getDay();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + (day === 0 ? -6 : 1 - day));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return items.filter((item) => {
    if (!item.date) return false;
    const [year, month, date] = item.date.split("-").map(Number);
    const itemDate = new Date(year, month - 1, date);
    if (isNaN(itemDate.getTime())) return false;

    switch (filter) {
      case "Today":     return itemDate.getTime() === today.getTime();
      case "This Week": return itemDate >= weekStart && itemDate <= weekEnd;
      case "This Month":return itemDate >= monthStart && itemDate <= monthEnd;
      default:          return false;
    }
  });
}

// ─── GeneralExpenses — root export ──────────────────────────────────────────
export default function GeneralExpenses() {
  const navigate = useNavigate();

  const [generalExpenses, setGeneralExpenses] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // AddEntry bottom sheet
  const [sheetOpen, setSheetOpen] = useState(false);

  // EditSheet state
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const data = await getGeneralExpenses();
    setGeneralExpenses(data);
  }

  // ── Derived: filtered + searched expense list ──────────────────────────
  const displayedItems = applyFilter(generalExpenses, activeFilter).filter((p) =>
    (p.name ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Quick totals for SummaryStrip ────────────────────────────────────────
  const totalSpend = displayedItems.reduce((acc, p) => {
    return acc + parseInt((p.amount ?? "0").toString().replace("₹", ""), 10);
  }, 0);

  // ── Edit handlers ────────────────────────────────────────────────────────
  function handleEditOpen(expense) {
    setEditTarget(expense);
    setEditOpen(true);
  }

  async function handleEditSave(updatedForm) {
    if (!editTarget) return;
    setIsSaving(true);
    const res = await editGeneralExpense(editTarget.id, updatedForm);
    setIsSaving(false);
    if (res) {
      setEditOpen(false);
      setEditTarget(null);
      fetchData(); // re-fetch to show updated data
    }
  }

  // ── Delete handler ───────────────────────────────────────────────────────
  function handleDelete() {
    fetchData();
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#EEF2FF" }}>
      {/* Centered, mobile-first container */}
      <div className="mx-auto max-w-md px-4 pt-10 pb-28">

        {/* 1. Top bar */}
        <PageTopBar
          pageTitle="General Expenses"
          onBack={() => navigate(-1)}
          filterActive={activeFilter !== "All"}
        />

        {/* 2. Summary strip */}
        <SummaryStrip
          count={displayedItems.length}
          total={`₹${totalSpend.toLocaleString("en-IN")}`}
        />

        {/* 3. Filter bar */}
        <FilterBar
          filters={["All", "Today", "This Week", "This Month"]}
          activeFilter={activeFilter}
          onFilter={setActiveFilter}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />

        {/* 4. Expense list */}
        {displayedItems.length > 0 ? (
          <div className="flex flex-col gap-3">
            {displayedItems.map((p) => (
              <ExpenseCard
                key={p.id}
                {...p}
                onEdit={handleEditOpen}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* 5. FAB */}
      <FAB onClick={() => setSheetOpen(true)} />

      {/* 6. AddEntry sheet */}
      <AddEntry
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />

      {/* 7. EditSheet — opens when Edit is tapped on an ExpenseCard */}
      <EditSheet
        isOpen={editOpen}
        onClose={() => { setEditOpen(false); setEditTarget(null); }}
        type="general"
        initialData={editTarget}
        onSave={handleEditSave}
        isSaving={isSaving}
      />
    </div>
  );
}
