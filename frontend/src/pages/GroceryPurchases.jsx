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
 *   searchQuery  : string  — live text filter on item name (case-insensitive)
 *   sheetOpen    : bool    — controls AddEntry bottom sheet
 *   editOpen     : bool    — controls EditSheet bottom sheet
 *   editTarget   : object  — the item currently being edited
 *   isSaving     : bool    — loading state while PUT is in flight
 *
 * ─── Component tree ────────────────────────────────────────────────────────
 *   GroceryPurchases
 *     ├─ PageTopBar
 *     ├─ SummaryStrip
 *     ├─ FilterBar
 *     ├─ List of PurchaseCard (onEdit / onDelete wired)
 *     ├─ EmptyState
 *     ├─ FAB
 *     ├─ AddEntry
 *     └─ EditSheet
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PurchaseCard from "../components/PurchaseCard";
import FilterBar from "../components/FilterBar";
import FAB from "../components/FAB";
import AddEntry from "../components/AddEntry";
import EditSheet from "../components/EditSheet";
import { getGroceryPurchases, editGroceryPurchase } from "../services/groceryServices";
import PageTopBar from "../components/PageTopBar";
import SummaryStrip from "../components/SummaryStrip";
import EmptyState from "../components/EmptyState";

// ─── Filter logic ─────────────────────────────────────────────────────────────
function applyFilter(items, filter) {
  if (filter === "All") return items;
  if (filter === "This Week") return items.filter((i) => i.bucket === "This Week");
  if (filter === "This Month") return items.filter(
    (i) => i.bucket === "This Week" || i.bucket === "This Month"
  );
  return items;
}

// ─── GroceryPurchases — root export ──────────────────────────────────────────
export default function GroceryPurchases() {
  const navigate = useNavigate();

  const [groceryPurchases, setGroceryPurchases] = useState([]);
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
    const data = await getGroceryPurchases();
    setGroceryPurchases(data);
  }

  // ── Derived: filtered + searched purchase list ──────────────────────────
  const displayedItems = applyFilter(groceryPurchases, activeFilter).filter((p) =>
    p.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Quick totals for SummaryStrip ────────────────────────────────────────
  const totalSpend = displayedItems.reduce((acc, p) => {
    return acc + parseInt((p.totalprice ?? "0").replace("₹", ""), 10);
  }, 0);

  // ── Edit handlers ────────────────────────────────────────────────────────
  function handleEditOpen(item) {
    setEditTarget(item);
    setEditOpen(true);
  }

  async function handleEditSave(updatedForm) {
    if (!editTarget) return;
    setIsSaving(true);
    const res = await editGroceryPurchase(editTarget.purchase_id, updatedForm);
    setIsSaving(false);
    if (res) {
      setEditOpen(false);
      setEditTarget(null);
      fetchData(); // re-fetch to show updated data
    }
  }

  // ── Delete handler ───────────────────────────────────────────────────────
  function handleDelete() {
    fetchData(); // re-fetch after delete
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#EEF2FF" }}>
      {/* Centered, mobile-first container */}
      <div className="mx-auto max-w-md px-4 pt-10 pb-28">

        {/* 1. Top bar */}
        <PageTopBar
          pageTitle="Grocery Purchases"
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
          activeFilter={activeFilter}
          onFilter={setActiveFilter}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />

        {/* 4. Purchase list */}
        {displayedItems.length > 0 ? (
          <div className="flex flex-col gap-3">
            {displayedItems.map((p) => (
              <PurchaseCard
                key={p.purchase_id}
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

      {/* 7. EditSheet — opens when Edit is tapped on a PurchaseCard */}
      <EditSheet
        isOpen={editOpen}
        onClose={() => { setEditOpen(false); setEditTarget(null); }}
        type="grocery"
        initialData={editTarget}
        onSave={handleEditSave}
        isSaving={isSaving}
      />
    </div>
  );
}
