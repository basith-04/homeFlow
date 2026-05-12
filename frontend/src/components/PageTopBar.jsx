import React from "react";
import { ArrowLeftIcon, FilterIcon } from "../icons/dashboardIcons";

export default function PageTopBar({ onBack, filterActive }) {
  return (
    <div className="flex items-center justify-between mb-5">
      {/* Back button */}
      <button
        id="grocery-back-btn"
        onClick={onBack}
        className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm
                   flex items-center justify-center text-gray-600
                   hover:border-[#3660F9]/30 hover:text-[#3660F9] transition-all duration-200"
        aria-label="Go back"
      >
        <ArrowLeftIcon className="w-4 h-4" />
      </button>

      {/* Page title */}
      <div className="text-center">
        <h1 className="text-base font-extrabold text-[#17161A] tracking-tight">
          Grocery Purchases
        </h1>
        <p className="text-[10px] text-gray-400 font-medium">May 2026</p>
      </div>

      {/* Filter icon — shows a blue dot badge when a non-All filter is active */}
      <div className="relative">
        <button
          id="grocery-filter-btn"
          className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm
                     flex items-center justify-center text-gray-600
                     hover:border-[#3660F9]/30 hover:text-[#3660F9] transition-all duration-200"
          aria-label="Filter options"
        >
          <FilterIcon className="w-4 h-4" />
        </button>
        {/* Active filter indicator dot */}
        {filterActive && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#3660F9] border-2 border-white" />
        )}
      </div>
    </div>
  );
}
