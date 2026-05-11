import { BellIcon } from "../icons/dashboardIcons";

export default function TopBar({ name }) {
  const date = new Date();
  const getGreeting = () => {
    const hour = date.getHours(); 

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };
  return (
    <div className="flex items-center justify-between mb-6">
      {/* Left: greeting */}
      <div>
        <h1 className="text-[1.15rem] font-extrabold text-[#17161A] leading-snug tracking-tight">
          {getGreeting()}, {name} 👋
        </h1>
        <p className="text-xs text-gray-400 font-medium mt-0.5">{date.getDate()} {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}</p>
      </div>

      {/* Right: bell + avatar */}
      <div className="flex items-center gap-2.5">
        {/* Notification bell */}
        <button
          id="dashboard-notif-btn"
          className="relative w-9 h-9 rounded-xl bg-white shadow-sm border border-gray-100
                     flex items-center justify-center text-gray-500
                     hover:border-[#3660F9]/30 hover:text-[#3660F9] transition-all duration-200"
        >
          <BellIcon className="w-4.5 h-4.5" />
          {/* unread dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#3660F9] border-2 border-white" />
        </button>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center
                     text-white text-xs font-bold select-none shadow-sm"
          style={{ background: "linear-gradient(135deg,#3660F9,#6f8fff)" }}
        >
          {name.slice(0, 2).toUpperCase()}
        </div>
      </div>
    </div>
  );
}
