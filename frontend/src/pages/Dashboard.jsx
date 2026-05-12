/**
 * Dashboard — Root page for the HomeFlow app.
 *
 * ─── State ─────────────────────────────────────────────────────────────────
 *   sheetOpen : bool — controls whether the AddEntry bottom sheet is visible.
 *               Lifted here because both FAB (opener) and AddEntry (closer)
 *               need access to the same piece of state.
 *
 * ─── Navigation ────────────────────────────────────────────────────────────
 *   navigate("/grocery") is passed as onGroceryClick to CategoryCards.
 *   When the user taps the Groceries card, CategoryCards calls this handler
 *   and react-router navigates to the GroceryPurchases page.
 *
 * ─── Component tree ────────────────────────────────────────────────────────
 *   Dashboard
 *     ├─ TopBar            — greeting, month, bell, avatar
 *     ├─ SpendCard         — big blue monthly total card
 *     ├─ CategoryCards     — Groceries + General side-by-side
 *     │     └─ onGroceryClick → navigate("/grocery")
 *     ├─ RestockAlerts     — dashed coming-soon strip
 *     ├─ RecentActivity    — 5 mock activity items
 *     ├─ FAB               — fixed bottom-right "+", onClick → setSheetOpen(true)
 *     └─ AddEntry          — bottom sheet, isOpen=sheetOpen, onClose → setSheetOpen(false)
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import SpendCard from "../components/SpendCard";
import CategoryCards from "../components/CategoryCards";
import RestockAlerts from "../components/RestockAlerts";
import RecentActivity from "../components/RecentActivity";
import FAB from "../components/FAB";
import AddEntry from "../components/AddEntry";
import { getGroceryPurchases } from "../services/groceryServices";
import {jwtDecode} from "jwt-decode"
export default function Dashboard() {
  // Controls the AddEntry bottom sheet — passed as props to FAB and AddEntry
  const [sheetOpen, setSheetOpen] = useState(false);

  // react-router navigate fn — used to go to /grocery on category card click

  const userName=jwtDecode(localStorage.getItem("token")).userName
  const navigate = useNavigate();
  const [groceryPurchases, setGroceryPurchases] = useState([]);
  useEffect(() => {
    fetchData()
  }, [])
  async function fetchData() {
    const data = await getGroceryPurchases()
    setGroceryPurchases(data)
  }
  const totalSpend = groceryPurchases.reduce((acc, p) => {
    // Strip "₹" and parse to number for summation
    return acc + parseInt(p.totalprice.replace("₹", ""), 10);
  }, 0);
  const time = new Date().getTime();
  console.log("Current time in ms:", time);
  const totalEntries = groceryPurchases.length;
  return (
    // Full-screen lavender background, vertically scrollable
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "#EEF2FF" }}
    >
      {/* Centered, mobile-first max-width container */}
      <div className="mx-auto max-w-md px-4 pt-10 pb-6">

        {/* 1. Top bar — name greeting + bell + avatar */}
        <TopBar name={userName} month="May 2026" initials="BA" />

        {/* 2. Main spend card — blue gradient, total + budget bar */}
        <SpendCard total={totalSpend} entries={totalEntries} />

        {/* 3. Category summary — Groceries & General side by side */}
        {/* onGroceryClick wires the Groceries card → /grocery navigation */}
        <CategoryCards onGeneralClick={()=> navigate("/general")} onGroceryClick={() => navigate("/grocery")} groceryData={{totalSpend,totalEntries}}/>

        {/* 4. Restock alerts — coming-soon dashed cards */}
        <RestockAlerts />

        {/* 5. Recent activity — 5 mock entries with colored left borders */}
        <RecentActivity groceryPurchases={groceryPurchases} />
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

