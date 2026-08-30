/**
 * FilterLogs — Tracker page for water filter change history.
 *
 * ─── Navigation ────────────────────────────────────────────────────────────
 *   Route: /filter-logs
 *   Entry: Dashboard → CategoryCards (Water Filter tile) → navigate("/filter-logs")
 *   Back:  PageTopBar back arrow → navigate(-1)
 *
 * ─── State ─────────────────────────────────────────────────────────────────
 *   logs        : array  — all filter change logs, newest first
 *   modalOpen   : bool   — controls the "Log Change" bottom sheet
 *   changeDate  : string — date field inside the modal (defaults to today)
 *   isSubmitting: bool   — loading state while POST is in flight
 *
 * ─── Component tree ────────────────────────────────────────────────────────
 *   FilterLogs
 *     ├─ PageTopBar          — back + title + filter icon (re-used as-is)
 *     ├─ NextChangeBanner    — info strip showing the next due date
 *     ├─ Log Change button   — opens the modal sheet
 *     ├─ List of log rows    — date + user_id, most recent first
 *     ├─ EmptyState          — shown when logs array is empty
 *     └─ LogChangeSheet      — bottom sheet modal (same pattern as AddEntry)
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageTopBar from "../components/PageTopBar";
import EmptyState from "../components/EmptyState";
import SheetField from "../components/SheetField";
import { getFilterLogs, addFilterLog } from "../services/filterLogsService";
import { CalendarIcon, WaterDropIcon, XIcon } from "../icons/dashboardIcons";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns today's date as yyyy-mm-dd */
function todayISO() {
  return new Date().toISOString().split("T")[0];
}

/**
 * Adds 3 calendar months to a yyyy-mm-dd string.
 * Returns the result as a human-readable "DD MMM YYYY" string.
 */
function addThreeMonths(dateStr) {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1 + 3, day);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Formats a yyyy-mm-dd string to "DD MMM YYYY" for display in the log list. */
function formatDate(dateStr) {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Shared input class (identical to AddEntry's INPUT_CLS) ──────────────────
const INPUT_CLS = `
  w-full bg-white border border-gray-200 rounded-xl
  pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400
  outline-none transition-all duration-200
  focus:border-[#3660F9] focus:ring-2 focus:ring-[#3660F9]/10
  hover:border-gray-300 appearance-none
`.trim();

// ════════════════════════════════════════════════════════════════════════════
// LogChangeSheet — bottom sheet modal, styled exactly like AddEntry
// ════════════════════════════════════════════════════════════════════════════
function LogChangeSheet({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [changeDate, setChangeDate] = useState(todayISO());

  // Reset date to today each time the sheet opens
  useEffect(() => {
    if (isOpen) setChangeDate(todayISO());
  }, [isOpen]);

  // Prevent body scroll while the sheet is visible
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function handleSubmit() {
    onSubmit(changeDate);
  }

  return (
    <>
      {/* ── Dark overlay ── */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]
          transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Sheet panel — slides up from bottom ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Log filter change"
        className={`
          fixed bottom-0 left-0 right-0 z-50
          max-h-[90vh] overflow-y-auto
          bg-white rounded-t-3xl
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `}
        style={{ boxShadow: "0 -12px 48px rgba(54,96,249,0.12), 0 -4px 16px rgba(0,0,0,0.08)" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="px-5 pb-8 pt-2">
          {/* Sheet header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-extrabold text-[#17161A] tracking-tight">
                Log Filter Change
              </h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                Record when the filter was changed
              </p>
            </div>
            <button
              onClick={onClose}
              className="
                w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center
                text-gray-500 hover:bg-gray-200 hover:text-gray-700
                transition-all duration-150 active:scale-95
              "
              aria-label="Close sheet"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Date field */}
          <SheetField label="Change Date" icon={<CalendarIcon />}>
            <input
              type="date"
              value={changeDate}
              onChange={(e) => setChangeDate(e.target.value)}
              className={INPUT_CLS}
            />
          </SheetField>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="
              w-full mt-7 py-4 rounded-full font-extrabold text-[15px]
              tracking-wide transition-all duration-200
              active:scale-[0.97] hover:opacity-90
              flex items-center justify-center gap-2
              disabled:opacity-60 disabled:cursor-not-allowed
            "
            style={{
              background: "linear-gradient(135deg,#3660F9,#2a50e0)",
              color: "#ffffff",
              boxShadow: "0 8px 24px rgba(54,96,249,0.35)",
            }}
          >
            {isSubmitting ? "Saving…" : "Log It ✓"}
          </button>

          {/* Bottom safe-area spacer */}
          <div className="h-4" />
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// FilterLogs — root export
// ════════════════════════════════════════════════════════════════════════════
export default function FilterLogs() {
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const data = await getFilterLogs();
    setLogs(data);
  }

  async function handleSubmit(changeDate) {
    setIsSubmitting(true);
    const ok = await addFilterLog(changeDate);
    setIsSubmitting(false);
    if (ok) {
      setModalOpen(false);
      fetchData();
    }
  }

  // Most recent log is first (API returns ORDER BY change_date DESC)
  const latestLog = logs[0] ?? null;
  const nextDueDate = addThreeMonths(latestLog?.change_date ?? null);

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#EEF2FF" }}>
      {/* Centered, mobile-first container */}
      <div className="mx-auto max-w-md px-4 pt-10 pb-28">

        {/* 1. Page top bar */}
        <PageTopBar
          pageTitle="Water Filter"
          onBack={() => navigate(-1)}
        />

        {/* 2. Next change due banner */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#EEF2FF" }}>
            <WaterDropIcon className="w-5 h-5 text-[#3660F9]" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Next Change Due</p>
            <p className="text-base font-extrabold text-[#17161A] tracking-tight leading-tight">
              {latestLog ? nextDueDate : "No logs yet"}
            </p>
            {latestLog && (
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                Last changed on {formatDate(latestLog.change_date)}
              </p>
            )}
          </div>
        </div>

        {/* 3. Section header + Log Change button */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#17161A]">Change History</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="
              px-4 py-2 rounded-xl text-xs font-bold text-white
              transition-all duration-200 active:scale-[0.97] hover:opacity-90
            "
            style={{
              background: "linear-gradient(135deg,#3660F9,#2a50e0)",
              boxShadow: "0 4px 14px rgba(54,96,249,0.30)",
            }}
          >
            + Log Change
          </button>
        </div>

        {/* 4. Log list */}
        {logs.length > 0 ? (
          <div className="flex flex-col gap-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3"
              >
                {/* Icon pill */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#EEF2FF" }}
                >
                  <WaterDropIcon className="w-4 h-4 text-[#3660F9]" />
                </div>

                {/* Date + user */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#17161A] leading-tight">
                    {formatDate(log.change_date)}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                    Logged by user #{log.user_id}
                  </p>
                </div>

                {/* "Next due" chip on first (most recent) row */}
                {log.id === latestLog?.id && (
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: "#EEF2FF", color: "#3660F9" }}
                  >
                    Latest
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4">💧</span>
            <p className="text-sm font-bold text-gray-400">No changes logged yet</p>
            <p className="text-xs text-gray-300 mt-1">Tap "Log Change" to record the first one</p>
          </div>
        )}
      </div>

      {/* 5. Log Change modal sheet */}
      <LogChangeSheet
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
