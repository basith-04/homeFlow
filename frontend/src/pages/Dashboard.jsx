import TopBar from "../components/TopBar";
import SpendCard from "../components/SpendCard";
import CategoryCards from "../components/CategoryCards";
import RestockAlerts from "../components/RestockAlerts";
import RecentActivity from "../components/RecentActivity";
import FAB from "../components/FAB";

export default function Dashboard() {
  return (
    // Full screen lavender bg, scrollable
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "#EEF2FF" }}
    >
      {/* Centered, mobile-first container */}
      <div className="mx-auto max-w-md px-4 pt-10 pb-6">
        {/* 1. Top bar */}
        <TopBar name="Basith" month="May 2026" initials="BA" />

        {/* 2. Main spend card */}
        <SpendCard total="₹4,280" entries={12} />

        {/* 3. Category mini-cards */}
        <CategoryCards />

        {/* 4. Restock alerts */}
        <RestockAlerts />

        {/* 5. Recent activity */}
        <RecentActivity />
      </div>

      {/* 6. Floating action button */}
      <FAB />
    </div>
  );
}
