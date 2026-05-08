import { BellIcon } from "../icons/dashboardIcons";

const ALERTS = [
  {
    id: "tomatoes",
    emoji: "🍅",
    name: "Tomatoes",
    dueText: "due in 2 days",
    comingSoon: true,
  },
];

function AlertItem({ emoji, name, dueText, comingSoon }) {
  return (
    <div
      className="flex items-center justify-between p-3.5 rounded-xl
                 border border-dashed border-[#3660F9]/30 bg-[#EEF2FF]/60
                 hover:border-[#3660F9]/50 transition-all duration-200"
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <span className="text-2xl leading-none">{emoji}</span>
        <div>
          <p className="text-sm font-bold text-[#17161A] leading-tight">{name}</p>
          <p className="text-xs text-gray-400 font-medium mt-0.5">{dueText}</p>
        </div>
      </div>

      {/* Right badge */}
      {comingSoon && (
        <span
          className="text-[10px] font-bold px-2.5 py-1 rounded-full text-[#17161A] flex-shrink-0"
          style={{ backgroundColor: "#D1FD57" }}
        >
          Coming Soon
        </span>
      )}
    </div>
  );
}

export default function RestockAlerts({ alerts = ALERTS }) {
  return (
    <section className="mb-5">
      {/* Section heading */}
      <div className="flex items-center gap-1.5 mb-3">
        <BellIcon className="w-4 h-4 text-[#3660F9]" />
        <h2 className="text-sm font-bold text-[#17161A]">Restock Alerts</h2>
        <span className="ml-auto text-[10px] text-gray-400 font-medium">
          Smart tracking — soon
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} {...alert} />
        ))}
      </div>
    </section>
  );
}
