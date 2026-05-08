function InputField({ icon: Icon, label, type = "text", placeholder, value, onChange, rightSlot }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-1">
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="absolute left-3.5 text-gray-400 pointer-events-none">
          <Icon />
        </span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="
            w-full bg-white border border-gray-200 rounded-xl
            pl-10 pr-10 py-3 text-sm text-gray-800 placeholder-gray-400
            outline-none transition-all duration-200
            focus:border-[#3660F9] focus:ring-2 focus:ring-[#3660F9]/10
            hover:border-gray-300
          "
        />
        {rightSlot && (
          <span className="absolute right-3.5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
            {rightSlot}
          </span>
        )}
      </div>
    </div>
  );
}
export {InputField}