/**
 * Dashboard — Root page for the HomeFlow app.
 *
 * ─── State ─────────────────────────────────────────────────────────────────
 *   sheetOpen : bool — controls whether the AddEntry bottom sheet is visible.
 *               Lifted here because both FAB (opener) and AddEntry (closer)
 *               need access to the same piece of state.
 *
 * ─── Component tree ────────────────────────────────────────────────────────
 *   Dashboard
 *     ├─ TopBar            — greeting, month, bell, avatar
 *     ├─ SpendCard         — big blue monthly total card
 *     ├─ CategoryCards     — Groceries + General side-by-side
 *     ├─ RestockAlerts     — dashed coming-soon strip
 *     ├─ RecentActivity    — 5 mock activity items
 *     ├─ FAB               — fixed bottom-right "+", onClick → setSheetOpen(true)
 *     └─ AddEntry          — bottom sheet, isOpen=sheetOpen, onClose → setSheetOpen(false)
 */

import { useState } from "react";
import TopBar from "../components/TopBar";
import SpendCard from "../components/SpendCard";
import CategoryCards from "../components/CategoryCards";
import RestockAlerts from "../components/RestockAlerts";
import RecentActivity from "../components/RecentActivity";
import FAB from "../components/FAB";
import AddEntry from "../components/AddEntry";

export default function Dashboard() {
  // Controls the AddEntry bottom sheet — passed as props to FAB and AddEntry
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    // Full-screen lavender background, vertically scrollable
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "#EEF2FF" }}
    >
      {/* Centered, mobile-first max-width container */}
      <div className="mx-auto max-w-md px-4 pt-10 pb-6">

        {/* 1. Top bar — name greeting + bell + avatar */}
        <TopBar name="Basith" month="May 2026" initials="BA" />

        {/* 2. Main spend card — blue gradient, total + budget bar */}
        <SpendCard total="₹4,280" entries={12} />

        {/* 3. Category summary — Groceries & General side by side */}
        <CategoryCards />

        {/* 4. Restock alerts — coming-soon dashed cards */}
        <RestockAlerts />

        {/* 5. Recent activity — 5 mock entries with colored left borders */}
        <RecentActivity />
      </div>

      {/* 6. FAB — fixed bottom-right; opens AddEntry sheet on click */}
      <FAB onClick={() => setSheetOpen(true)} />

      {/* 7. AddEntry bottom sheet — portal-style overlay + slide-up panel
              isOpen drives the CSS translateY transition
              onClose resets sheetOpen to false                           */}
      <AddEntry
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}

