import { PlusIcon } from "../icons/dashboardIcons";

/**
 * FAB — Floating Action Button (bottom-right corner).
 *
 * Props:
 *   onClick : fn() — callback to open the AddEntry bottom sheet.
 *                    Passed down from Dashboard.jsx via state setter.
 *
 * The FAB sits at z-50 so it floats above all dashboard content
 * but below the sheet (z-40 overlay / z-50 sheet panel sit on top
 * via DOM order when both are mounted).
 */
export default function FAB({ onClick }) {
  return (
    <button
      id="dashboard-fab"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30
                 w-14 h-14 rounded-full
                 flex items-center justify-center
                 text-white
                 hover:scale-110 active:scale-95
                 transition-transform duration-200"
      style={{
        background: "linear-gradient(135deg,#3660F9,#2a50e0)",
        boxShadow: "0 8px 24px rgba(54,96,249,0.45), 0 2px 8px rgba(0,0,0,0.12)",
      }}
      aria-label="Add new entry"
    >
      <PlusIcon className="w-6 h-6" />
    </button>
  );
}
