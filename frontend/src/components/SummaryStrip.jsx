import React from "react";

export default function SummaryStrip({ count, total }) {
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
