/**
 * TripExpenseList — Groups expenses by date and renders ExpenseItem rows.
 *
 * ─── Props ───────────────────────────────────────────────────────────────────
 *   expenses : Array — list of expense objects from getTripById()
 */

import ExpenseItem from "./ExpenseItem";

// Format "2024-12-21" → "Dec 21, 2024"
function formatSectionDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// Group array of expenses by their `.date` field
function groupByDate(expenses) {
  const groups = {};
  for (const exp of expenses) {
    const key = exp.date ?? "Unknown";
    if (!groups[key]) groups[key] = [];
    groups[key].push(exp);
  }
  // Sort keys chronologically
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

export default function TripExpenseList({ expenses = [] }) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-sm text-gray-400 font-medium">No expenses recorded</p>
      </div>
    );
  }

  const grouped = groupByDate(expenses);

  return (
    <div className="flex flex-col gap-4">
      {grouped.map(([date, items]) => (
        <div key={date}>
          {/* Date section heading */}
          <p className="text-sm font-medium text-gray-400 mb-2">
            {date !== "Unknown" ? formatSectionDate(date) : "Unknown date"}
          </p>

          {/* Expense rows */}
          <div className="bg-white rounded-xl border border-gray-100 px-4">
            {items.map((exp) => (
              <ExpenseItem key={exp.trip_expense_id} {...exp} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
