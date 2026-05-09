import { useEffect, useState } from "react";
import { getGroceryPurchases } from "../services/groceryServices";
import { useNavigate } from "react-router-dom";

const ACTIVITY = [
  {
    id: 1,
    name: "Tomatoes & Onions",
    category: "Grocery",
    amount: "₹180",
    by: "Basith",
    when: "Today",
    borderColor: "#3660F9",
    categoryBg: "#EEF2FF",
    categoryColor: "#3660F9",
  },
  {
    id: 2,
    name: "Electricity Bill",
    category: "General",
    amount: "₹850",
    by: "Basith",
    when: "Today",
    borderColor: "#7C3AED",
    categoryBg: "#F5F3FF",
    categoryColor: "#7C3AED",
  },
  {
    id: 3,
    name: "Milk × 4 litres",
    category: "Grocery",
    amount: "₹220",
    by: "Basith",
    when: "Today",
    borderColor: "#3660F9",
    categoryBg: "#EEF2FF",
    categoryColor: "#3660F9",
  },
  {
    id: 4,
    name: "Internet Recharge",
    category: "General",
    amount: "₹399",
    by: "Basith",
    when: "Yesterday",
    borderColor: "#7C3AED",
    categoryBg: "#F5F3FF",
    categoryColor: "#7C3AED",
  },
  {
    id: 5,
    name: "Vegetables Bundle",
    category: "Grocery",
    amount: "₹340",
    by: "Basith",
    when: "Yesterday",
    borderColor: "#3660F9",
    categoryBg: "#EEF2FF",
    categoryColor: "#3660F9",
  },
];

function ActivityItem({ groceryPurchase }) {
  const borderColor = "#3660F9"
  const categoryBg = "#EEF2FF"
  const categoryColor = "#3660F9"
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100
                 flex items-center gap-3 px-4 py-3.5
                 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      style={{ borderLeft: `3px solid ${borderColor}` }}
    >
      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#17161A] truncate leading-snug">{groceryPurchase.item}</p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: categoryBg, color: categoryColor }}
          >
            {groceryPurchase.category}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">
            by {groceryPurchase.by} • {"when"}
          </span>
        </div>
      </div>

      {/* Amount */}
      <p className="text-sm font-extrabold text-[#17161A] flex-shrink-0">{groceryPurchase.amount}</p>
    </div>
  );
}

export default function RecentActivity({ groceryPurchases }) {
  const navigate = useNavigate();
 
  return (
    <section className="mb-24">
      {/* Section heading */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-[#17161A]">Recent Activity</h2>
        <button className="text-[11px] text-[#3660F9] font-semibold hover:underline transition-all" onClick={() => navigate("/grocery")}>
          See all →
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {groceryPurchases.slice(0,4).map((item) => (
          <ActivityItem key={item.purchase_id} groceryPurchase={item} />
        ))}
      </div>
    </section>
  );
}
