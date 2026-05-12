import React from "react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">🛒</span>
      <p className="text-sm font-bold text-gray-400">No entries found</p>
      <p className="text-xs text-gray-300 mt-1">Try a different filter or search term</p>
    </div>
  );
}
