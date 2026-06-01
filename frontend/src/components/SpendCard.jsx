import { TrendUpIcon } from "../icons/dashboardIcons";

export default function SpendCard({ total = "₹4,280", entries = 12 }) {
  return (
    <div
      className="relative w-full rounded-3xl p-6 mb-4 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #3660F9 0%, #2a50e0 60%, #1a3dcc 100%)" }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-6 -right-2 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute top-4 right-10 w-10 h-10 rounded-full bg-[#D1FD57]/20 pointer-events-none" />

      {/* Label row */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">
          This Month's Spend
        </p>
        <span className="flex items-center gap-1 bg-white/15 text-white/90 text-[10px] font-semibold px-2.5 py-1 rounded-full">
          <TrendUpIcon className="w-3 h-3" />
          JUNE 2026
        </span>
      </div>

      {/* Big amount */}
      <p className="text-white text-4xl font-extrabold tracking-tight leading-none mb-1.5">
        {total}
      </p>

      {/* Sub-row */}
      <div className="flex items-center justify-between mt-3">
        <p className="text-white/60 text-xs font-medium">{entries} entries logged</p>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#D1FD57]"
              style={{ width: "68%" }}
            />
          </div>
          <span className="text-white/60 text-[10px] font-semibold">68%</span>
        </div>
      </div>

      {/* Budget cap hint */}
      <p className="text-white/40 text-[10px] mt-1 font-medium">Budget cap: ₹6,300</p>
    </div>
  );
}
