/**
 * ExpenseItem — A single expense row inside the trip detail panel.
 *
 * ─── Props ───────────────────────────────────────────────────────────────────
 *   trip_expense_id : string  — unique key
 *   category        : string  — food | transport | stay | entry | shopping | other
 *   amount          : number  — e.g. 450.00
 *   note            : string  — e.g. "Beach shack dinner"
 *   date            : string  — ISO date (not rendered here, handled by parent grouping)
 */

const CATEGORY_STYLES = {
  food:      { bg: "bg-[#D1FD57]",    text: "text-[#17161A]" },
  transport: { bg: "bg-[#EEF2FF]",    text: "text-[#3660F9]" },
  stay:      { bg: "bg-[#3660F9]",    text: "text-white"      },
  entry:     { bg: "bg-purple-100",   text: "text-purple-700" },
  shopping:  { bg: "bg-pink-100",     text: "text-pink-700"   },
  other:     { bg: "bg-gray-100",     text: "text-gray-600"   },
};

export default function ExpenseItem({ trip_expense_id, category, amount, note }) {
  const style = CATEGORY_STYLES[category] ?? CATEGORY_STYLES.other;

  return (
    <div
      id={`expense-item-${trip_expense_id}`}
      className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-b-0"
    >
      {/* Category pill */}
      <span
        className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${style.bg} ${style.text}`}
      >
        {category}
      </span>

      {/* Note */}
      <p className="flex-1 text-sm text-gray-700 truncate min-w-0">
        {note || <span className="text-gray-400 italic">No note</span>}
      </p>

      {/* Amount */}
      <span className="shrink-0 text-sm font-semibold text-[#17161A]">
        ₹{Number(amount).toLocaleString("en-IN")}
      </span>
    </div>
  );
}
