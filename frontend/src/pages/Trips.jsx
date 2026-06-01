/**
 * Trips — Trip expense tracking page.
 *
 * ─── Navigation ────────────────────────────────────────────────────────────
 *   Route: /trips
 *
 * ─── State ─────────────────────────────────────────────────────────────────
 *   trips          : Array   — list of trips from getTrips()
 *   loading        : bool    — true while getTrips() is pending
 *   error          : string  — set when getTrips() fails
 *   selectedTrip   : Object  — full trip with expenses (from getTripById)
 *   panelOpen      : bool    — controls the slide-in detail panel
 *   panelLoading   : bool    — true while getTripById() is in flight
 *
 * ─── Component tree ────────────────────────────────────────────────────────
 *   Trips
 *     ├─ PageTopBar
 *     ├─ header section (title + subtitle + "+ New Trip" button)
 *     ├─ Skeleton cards (×3) | Error state | List of TripCard | Empty state
 *     ├─ Backdrop (when panelOpen)
 *     └─ Trip detail panel (slide-in)
 *           ├─ X close button
 *           ├─ Trip name + badge + date range
 *           ├─ Summary strip (total spend | expense count | duration)
 *           └─ TripExpenseList
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getTrips, getTripById } from "../services/tripService";
import TripCard from "../components/TripCard";
import TripExpenseList from "../components/TripExpenseList";
import PageTopBar from "../components/PageTopBar";
import PlaneIcon from "../icons/PlaneIcon";
import ShoppingBagIcon from "../icons/ShoppingBagIcon";
import { XIcon, PlusIcon } from "../icons/dashboardIcons";

// ── Date helpers ──────────────────────────────────────────────────────────────
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function parseIso(isoStr) {
  const [y, m, d] = isoStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatShort(isoStr) {
  const d = parseIso(isoStr);
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

function formatYear(isoStr) {
  return parseIso(isoStr).getFullYear();
}

function nightCount(startIso, endIso) {
  const diff = Math.abs(parseIso(endIso) - parseIso(startIso));
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-100 rounded-full w-2/3" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyTrips() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* Suitcase SVG */}
      <svg
        className="w-16 h-16 text-gray-200 mb-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="7" width="22" height="15" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="12" y1="12" x2="12" y2="17" />
        <line x1="9.5" y1="14.5" x2="14.5" y2="14.5" />
      </svg>
      <h2 className="text-base font-semibold text-[#17161A] mb-1">No trips yet</h2>
      <p className="text-sm text-gray-400 font-normal">Add your first trip to get started</p>
    </div>
  );
}

// ── Panel spinner ─────────────────────────────────────────────────────────────
function PanelSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 rounded-full border-2 border-[#3660F9] border-t-transparent animate-spin" />
    </div>
  );
}

// ── Type badge config ─────────────────────────────────────────────────────────
const TYPE_BADGE = {
  trip:   { bg: "bg-[#EEF2FF]", text: "text-[#3660F9]", label: "Trip" },
  outing: { bg: "bg-[#D1FD57]", text: "text-[#17161A]", label: "Outing" },
};

// ── Trips page — root export ──────────────────────────────────────────────────
export default function Trips() {
  const navigate = useNavigate();

  // List state
  const [trips, setTrips]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // Detail panel state
  const [panelOpen, setPanelOpen]       = useState(false);
  const [panelLoading, setPanelLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // ── Fetch trip list ─────────────────────────────────────────────────────────
  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTrips();
      setTrips(data);
    } catch (err) {
      setError("Failed to load trips");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  // ── Open detail panel ───────────────────────────────────────────────────────
  async function handleOpenTrip(id) {
    setPanelOpen(true);
    setSelectedTrip(null);
    setPanelLoading(true);
    try {
      const data = await getTripById(id);
      setSelectedTrip(data);
    } catch (err) {
      setSelectedTrip(null);
    } finally {
      setPanelLoading(false);
    }
  }

  function handleClosePanel() {
    setPanelOpen(false);
    // Delay clearing so slide-out animation completes
    setTimeout(() => setSelectedTrip(null), 300);
  }

  // ── Derived: panel summary stats ────────────────────────────────────────────
  const expenses = selectedTrip?.expenses ?? [];
  const totalSpend = expenses.reduce((acc, e) => acc + Number(e.amount ?? 0), 0);
  const nights = selectedTrip
    ? nightCount(selectedTrip.start_date, selectedTrip.end_date)
    : 0;
  const nightLabel = nights === 1 ? "1 night" : `${nights} nights`;
  const panelBadge = selectedTrip ? (TYPE_BADGE[selectedTrip.type] ?? TYPE_BADGE.trip) : TYPE_BADGE.trip;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#EEF2FF" }}>
      {/* ── Centered mobile-first container ── */}
      <div className="mx-auto max-w-md px-4 pt-10 pb-28">

        {/* 1. Top bar */}
        <PageTopBar
          pageTitle="Trips"
          onBack={() => navigate(-1)}
          filterActive={false}
        />

        {/* 2. Header section */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#17161A] tracking-tight leading-tight">
              Trips
            </h1>
            <p className="text-sm text-gray-400 font-normal mt-0.5">
              Track expenses for every trip
            </p>
          </div>

          {/* "+ New Trip" button */}
          <button
            id="new-trip-btn"
            className="flex items-center gap-1.5 bg-[#3660F9] text-white
                       text-sm font-semibold px-4 py-2 rounded-full
                       hover:bg-[#D1FD57] hover:text-[#17161A]
                       transition-all duration-200 shrink-0"
            aria-label="Add new trip"
          >
            <PlusIcon className="w-4 h-4" />
            New Trip
          </button>
        </div>

        {/* 3. Trip list */}
        {loading ? (
          /* Skeleton cards */
          <div className="flex flex-col gap-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : error ? (
          /* Error state */
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
            <p className="text-sm font-semibold text-red-600 mb-3">{error}</p>
            <button
              id="retry-trips-btn"
              onClick={fetchTrips}
              className="text-sm font-semibold text-[#3660F9] underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        ) : trips.length === 0 ? (
          <EmptyTrips />
        ) : (
          <div className="flex flex-col gap-3">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                {...trip}
                onClick={() => handleOpenTrip(trip.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Backdrop ── */}
      <div
        className={`fixed inset-0 bg-[#17161A]/30 z-40 transition-opacity duration-300
                    ${panelOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={handleClosePanel}
        aria-hidden="true"
      />

      {/* ── Trip detail panel ── */}
      <div
        id="trip-detail-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Trip details"
        className={`fixed right-0 top-0 h-full w-[420px] max-sm:w-full bg-white z-50
                    shadow-2xl overflow-y-auto transition-transform duration-300
                    ${panelOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Panel header */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {selectedTrip ? (
                <>
                  <h2 className="text-xl font-bold text-[#17161A] leading-tight truncate">
                    {selectedTrip.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${panelBadge.bg} ${panelBadge.text}`}
                    >
                      {panelBadge.label}
                    </span>
                    <span className="text-xs text-gray-400 font-normal">
                      {formatShort(selectedTrip.start_date)} – {formatShort(selectedTrip.end_date)}, {formatYear(selectedTrip.end_date)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="space-y-2 animate-pulse">
                  <div className="h-6 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-full w-1/2" />
                </div>
              )}
            </div>

            {/* Close button */}
            <button
              id="close-trip-panel-btn"
              onClick={handleClosePanel}
              className="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center
                         text-[#3660F9] hover:bg-[#3660F9] hover:text-white
                         transition-all duration-200 shrink-0"
              aria-label="Close panel"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Summary strip */}
          {selectedTrip && !panelLoading && (
            <div className="bg-[#EEF2FF] rounded-xl p-4 mt-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-base font-bold text-[#17161A]">
                  ₹{totalSpend.toLocaleString("en-IN")}
                </p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Total spend</p>
              </div>
              <div>
                <p className="text-base font-bold text-[#17161A]">{expenses.length}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                  {expenses.length === 1 ? "expense" : "expenses"}
                </p>
              </div>
              <div>
                <p className="text-base font-bold text-[#17161A]">{nightLabel}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Duration</p>
              </div>
            </div>
          )}
        </div>

        {/* Panel body */}
        <div className="px-6 py-5">
          {panelLoading ? (
            <PanelSpinner />
          ) : selectedTrip ? (
            <TripExpenseList expenses={expenses} />
          ) : (
            /* Error state inside panel */
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm text-red-500 font-medium">Failed to load trip details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
