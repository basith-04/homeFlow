const CATEGORIES = [
  {
    id: "groceries",
    emoji: "🛒",
    label: "Groceries",
    amount: "₹2,940",
    entries: 8,
    accentColor: "#3660F9",
    bgColor: "#EEF2FF",
  },
  {
    id: "general",
    emoji: "📋",
    label: "General",
    amount: "₹1,340",
    entries: 4,
    accentColor: "#7C3AED",
    bgColor: "#F5F3FF",
  },
];

function CategoryCard({ emoji, label, amount, entries, accentColor, bgColor }) {
  return (
    <div
      className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100
                 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      {/* Icon pill */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3"
        style={{ backgroundColor: bgColor }}
      >
        {emoji}
      </div>

      {/* Label */}
      <p className="text-xs text-gray-400 font-semibold mb-1">{label}</p>

      {/* Amount */}
      <p className="text-lg font-extrabold text-[#17161A] tracking-tight leading-none mb-1.5">
        {amount}
      </p>

      {/* Entries badge */}
      <span
        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{ color: accentColor, backgroundColor: bgColor }}
      >
        {entries} entries
      </span>
    </div>
  );
}

export default function CategoryCards({ categories = CATEGORIES }) {
  return (
    <div className="flex gap-3 mb-5">
      {categories.map((cat) => (
        <CategoryCard key={cat.id} {...cat} />
      ))}
    </div>
  );
}
