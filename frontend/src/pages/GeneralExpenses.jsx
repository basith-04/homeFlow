/**
 * GeneralExpenses — Full list view of logged general expenses.
 *
 * ─── Navigation ────────────────────────────────────────────────────────────
 *   Route: /general
 *   Entry point: Dashboard → CategoryCards (General Expenses card) → navigate("/general")
 *   Back: TopBar back arrow → navigate(-1)  [browser history]
 *
 * ─── State ─────────────────────────────────────────────────────────────────
 *   activeFilter : string  — "All" | "This Week" | "This Month"
 *                            used to filter MOCK_PURCHASES by date bucket
 *   searchQuery  : string  — live text filter on item name (case-insensitive)
 *   sheetOpen    : bool    — controls AddEntry bottom sheet (same as Dashboard)
 *
 * ─── Derived data ──────────────────────────────────────────────────────────
 *   displayedItems — MOCK_PURCHASES filtered by activeFilter AND searchQuery.
 *                    Recalculated on every render (no heavy memoization needed
 *                    for this scale of mock data).
 *
 * ─── Component tree ────────────────────────────────────────────────────────
 *   GeneralExpenses
 *     ├─ PageTopBar         — back arrow + "General Expenses" + filter icon
 *     ├─ SummaryStrip       — quick totals (entries count + total spend)
 *     ├─ FilterBar          — pill tabs + search input
 *     ├─ List of PurchaseCard — one per displayedItems entry
 *     ├─ EmptyState         — shown when displayedItems is empty
 *     ├─ FAB                — opens AddEntry sheet
 *     └─ AddEntry           — bottom sheet modal
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PurchaseCard from "../components/PurchaseCard";
import FilterBar from "../components/FilterBar";
import FAB from "../components/FAB";
import AddEntry from "../components/AddEntry";
import PageTopBar from "../components/PageTopBar";
import SummaryStrip from "../components/SummaryStrip";
import EmptyState from "../components/EmptyState";
import { getGeneralExpenses } from "../services/generalExpenseService";
import {ExpenseCard} from "../components/ExpenseCard.jsx";


// ─── Filter logic ─────────────────────────────────────────────────────────────
// "All" → no date filter
// "This Week" → bucket === "This Week"
// "This Month" → bucket === "This Week" OR "This Month"
function applyFilter(items, filter) {
  if (filter === "All") return items;
  if (filter === "This Week") return items.filter((i) => i.bucket === "This Week");
  if (filter === "This Month") return items.filter(
    (i) => i.bucket === "This Week" || i.bucket === "This Month"
  );
  return items;
}

// Components extracted to src/components/*

// ─── GeneralExpenses — root export ──────────────────────────────────────────
export default function GeneralExpenses() {

  const navigate = useNavigate();

  const [generalExpenses, setGeneralExpenses] = useState([])

  // Filter pill state — "All" | "This Week" | "This Month"
  const [activeFilter, setActiveFilter] = useState("All");

  // Search input state — filters by item name
  const [searchQuery, setSearchQuery] = useState("");

  // AddEntry bottom sheet — same pattern as Dashboard
  const [sheetOpen, setSheetOpen] = useState(false);



  useEffect(() => {
    fetchData()
  }, [])
  async function fetchData() {

    const data = await getGeneralExpenses()
    setGeneralExpenses(data)
    console.log(data)
  }
  // ── Derived: filtered + searched purchase list ──────────────────────────
  // 1. Apply date filter bucket first
  // 2. Then narrow by search query (case-insensitive substring on item name)
  const displayedItems = applyFilter(generalExpenses, activeFilter).filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Quick totals for SummaryStrip ────────────────────────────────────────
  const totalSpend = displayedItems.reduce((acc, p) => {
    // Strip "₹" and parse to number for summation
    return acc + parseInt(p.amount.replace("₹", ""), 10);
  }, 0);
  
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#EEF2FF" }}>
      {/* Centered, mobile-first container — same max-w-md as Dashboard */}
      <div className="mx-auto max-w-md px-4 pt-10 pb-28">

        {/* 1. Top bar — back arrow + title + filter icon */}
        <PageTopBar
          pageTitle="General Expenses"
          onBack={() => navigate(-1)}
          filterActive={activeFilter !== "All"}
        />

        {/* 2. Summary strip — quick totals for the current filter view */}
        <SummaryStrip
          count={displayedItems.length}
          total={`₹${totalSpend.toLocaleString("en-IN")}`}
        />

        {/* 3. Filter bar — pill toggles + search input
                Both states are controlled here and passed down as props.     */}
        <FilterBar
          activeFilter={activeFilter}
          onFilter={setActiveFilter}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />

        {/* 4. Purchase list — rendered from displayedItems (derived state) */}
        {displayedItems.length > 0 ? (
          <div className="flex flex-col gap-3">
            {displayedItems.map((p) => (
              // PurchaseCard manages its own menuOpen state internally
              <ExpenseCard key={p.id} {...p} />
            ))}
          </div>
        ) : (
          // 5. Empty state — only shown when filters/search yield nothing
          <EmptyState />
        )}
      </div>

      {/* 6. FAB — same as Dashboard, opens AddEntry sheet */}
      <FAB onClick={() => setSheetOpen(true)} />

      {/* 7. AddEntry sheet — reused from Dashboard, defaults to general tab */}
      <AddEntry
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
