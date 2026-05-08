/**
 * SheetField — A reusable labelled input/select wrapper used inside AddEntry.
 *
 * Props:
 *   label   : string  — field label shown above the input
 *   icon    : ReactNode — SVG icon rendered on the left of the input
 *   children: ReactNode — the actual <input> or <select> element
 *   hint    : string? — optional small helper text below the field
 *
 * All children receive shared Tailwind classes via a wrapper div that
 * positions the icon absolutely on the left. The child must have pl-10
 * to avoid text overlapping the icon.
 */
export default function SheetField({ label, icon, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      {/* Field label — small uppercase tracking */}
      <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider pl-1">
        {label}
      </label>

      {/* Input wrapper — icon is absolute-positioned inside */}
      <div className="relative flex items-center">
        {/* Left icon */}
        <span className="absolute left-3.5 text-gray-400 pointer-events-none z-10">
          {icon}
        </span>

        {/* Slot for <input> or <select> — must include pl-10 */}
        {children}
      </div>

      {/* Optional hint text below the field */}
      {hint && (
        <p className="text-[10px] text-gray-400 pl-1">{hint}</p>
      )}
    </div>
  );
}
