/**
 * GroceryPurchases — Full list view of logged grocery entries.
 *
 * ─── Navigation ────────────────────────────────────────────────────────────
 *   Route: /grocery
 *   Entry point: Dashboard → CategoryCards (Groceries card) → navigate("/grocery")
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
 *   GroceryPurchases
 *     ├─ PageTopBar         — back arrow + "Grocery Purchases" + filter icon
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
import { ArrowLeftIcon, FilterIcon } from "../icons/dashboardIcons";
import { getGroceryPurchases } from "../services/groceryServices";

// ─── Mock data ───────────────────────────────────────────────────────────────
// In a real app these would come from a store / API call.
// Each entry has a `bucket` field for easy filter matching.


const MOCK_PURCHASES = [
  {
    id: 1,
    item: "Tomato",
    category: "Vegetable",
    quantity: "2 kg",
    totalPrice: "₹60",
    unitPrice: "₹30/kg",
    by: "Basith",
    when: "Today",
    bucket: "This Week",          // "This Week" also belongs to "This Month"
    accentColor: "#3660F9",
    tagColor: "#3660F9",
    tagBg: "#EEF2FF",
  },
  {
    id: 2,
    item: "Milk",
    category: "Dairy",
    quantity: "1 L",
    totalPrice: "₹28",
    unitPrice: "₹28/L",
    by: "Basith",
    when: "Today",
    bucket: "This Week",
    accentColor: "#0EA5E9",
    tagColor: "#0EA5E9",
    tagBg: "#F0F9FF",
  },
  {
    id: 3,
    item: "Rice",
    category: "Grain",
    quantity: "5 kg",
    totalPrice: "₹320",
    unitPrice: "₹64/kg",
    by: "Basith",
    when: "Yesterday",
    bucket: "This Week",
    accentColor: "#F59E0B",
    tagColor: "#B45309",
    tagBg: "#FFFBEB",
  },
  {
    id: 4,
    item: "Eggs",
    category: "Poultry",
    quantity: "1 dozen",
    totalPrice: "₹84",
    unitPrice: "₹7/egg",
    by: "Basith",
    when: "Yesterday",
    bucket: "This Week",
    accentColor: "#F97316",
    tagColor: "#C2410C",
    tagBg: "#FFF7ED",
  },
  {
    id: 5,
    item: "Onion",
    category: "Vegetable",
    quantity: "3 kg",
    totalPrice: "₹75",
    unitPrice: "₹25/kg",
    by: "Basith",
    when: "3 days ago",
    bucket: "This Week",
    accentColor: "#A855F7",
    tagColor: "#7E22CE",
    tagBg: "#FAF5FF",
  },
  {
    id: 6,
    item: "Potato",
    category: "Vegetable",
    quantity: "2 kg",
    totalPrice: "₹40",
    unitPrice: "₹20/kg",
    by: "Basith",
    when: "4 days ago",
    bucket: "This Week",
    accentColor: "#10B981",
    tagColor: "#065F46",
    tagBg: "#ECFDF5",
  },
  {
    id: 7,
    item: "Spinach",
    category: "Leafy Green",
    quantity: "1 kg",
    totalPrice: "₹35",
    unitPrice: "₹35/kg",
    by: "Basith",
    when: "Last week",
    bucket: "This Month",         // older than this week but within month
    accentColor: "#22C55E",
    tagColor: "#15803D",
    tagBg: "#F0FDF4",
  },
  {
    id: 8,
    item: "Bread",
    category: "Bakery",
    quantity: "2 pcs",
    totalPrice: "₹80",
    unitPrice: "₹40/pc",
    by: "Basith",
    when: "10 days ago",
    bucket: "This Month",
    accentColor: "#F43F5E",
    tagColor: "#BE123C",
    tagBg: "#FFF1F2",
  },
];

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

// ─── PageTopBar ───────────────────────────────────────────────────────────────
// Separate inner component so the layout is readable at a glance.
// Receives navigate fn + filter active state for the filter icon badge.
function PageTopBar({ onBack, filterActive }) {
  return (
    <div className="flex items-center justify-between mb-5">
      {/* Back button */}
      <button
        id="grocery-back-btn"
        onClick={onBack}
        className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm
                   flex items-center justify-center text-gray-600
                   hover:border-[#3660F9]/30 hover:text-[#3660F9] transition-all duration-200"
        aria-label="Go back"
      >
        <ArrowLeftIcon className="w-4 h-4" />
      </button>

      {/* Page title */}
      <div className="text-center">
        <h1 className="text-base font-extrabold text-[#17161A] tracking-tight">
          Grocery Purchases
        </h1>
        <p className="text-[10px] text-gray-400 font-medium">May 2026</p>
      </div>

      {/* Filter icon — shows a blue dot badge when a non-All filter is active */}
      <div className="relative">
        <button
          id="grocery-filter-btn"
          className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm
                     flex items-center justify-center text-gray-600
                     hover:border-[#3660F9]/30 hover:text-[#3660F9] transition-all duration-200"
          aria-label="Filter options"
        >
          <FilterIcon className="w-4 h-4" />
        </button>
        {/* Active filter indicator dot */}
        {filterActive && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#3660F9] border-2 border-white" />
        )}
      </div>
    </div>
  );
}

// ─── SummaryStrip ─────────────────────────────────────────────────────────────
// Two quick-stat chips above the filter row — total entries + total spend.
function SummaryStrip({ count, total }) {
  return (
    <div className="flex gap-3 mb-4">
      {/* Entries count chip */}
      <div className="flex-1 bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm text-center">
        <p className="text-lg font-extrabold text-[#3660F9]">{count}</p>
        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Entries</p>
      </div>

      {/* Total spend chip */}
      <div className="flex-1 bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm text-center">
        <p className="text-lg font-extrabold text-[#17161A]">{total}</p>
        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Total Spend</p>
      </div>

      {/* Avg per entry chip */}
      <div className="flex-1 bg-[#EEF2FF] rounded-2xl p-3.5 border border-[#3660F9]/10 text-center">
        <p className="text-lg font-extrabold text-[#3660F9]">🛒</p>
        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Grocery</p>
      </div>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">🛒</span>
      <p className="text-sm font-bold text-gray-400">No entries found</p>
      <p className="text-xs text-gray-300 mt-1">Try a different filter or search term</p>
    </div>
  );
}

// ─── GroceryPurchases — root export ──────────────────────────────────────────
export default function GroceryPurchases() {

  const navigate = useNavigate();

  const [groceryPurchases, setGroceryPurchases] = useState([])

  // Filter pill state — "All" | "This Week" | "This Month"
  const [activeFilter, setActiveFilter] = useState("All");

  // Search input state — filters by item name
  const [searchQuery, setSearchQuery] = useState("");

  // AddEntry bottom sheet — same pattern as Dashboard
  const [sheetOpen, setSheetOpen] = useState(false);



  useEffect(() => {
    console.log("reached 1 here")
    fetchData()
  }, [])
  async function fetchData() {

    const data = await getGroceryPurchases()
    setGroceryPurchases(data)
    console.log(data)
  }
  // ── Derived: filtered + searched purchase list ──────────────────────────
  // 1. Apply date filter bucket first
  // 2. Then narrow by search query (case-insensitive substring on item name)
  const displayedItems = applyFilter(groceryPurchases, activeFilter).filter((p) =>
    p.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Quick totals for SummaryStrip ────────────────────────────────────────
  const totalSpend = displayedItems.reduce((acc, p) => {
    // Strip "₹" and parse to number for summation
    return acc + parseInt(p.totalprice.replace("₹", ""), 10);
  }, 0);

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#EEF2FF" }}>
      {/* Centered, mobile-first container — same max-w-md as Dashboard */}
      <div className="mx-auto max-w-md px-4 pt-10 pb-28">

        {/* 1. Top bar — back arrow + title + filter icon */}
        <PageTopBar
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
              <PurchaseCard key={p.id} {...p} />
            ))}
          </div>
        ) : (
          // 5. Empty state — only shown when filters/search yield nothing
          <EmptyState />
        )}
      </div>

      {/* 6. FAB — same as Dashboard, opens AddEntry sheet */}
      <FAB onClick={() => setSheetOpen(true)} />

      {/* 7. AddEntry sheet — reused from Dashboard, defaults to grocery tab */}
      <AddEntry
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
