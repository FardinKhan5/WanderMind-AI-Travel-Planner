import { useState, useEffect } from "react";
import { api } from "../api/client";

const BUDGET_EMOJI = { budget: "💰", "mid-range": "💳", luxury: "💎" };

function Spinner({ size = "md" }) {
  const s = size === "lg" ? "w-8 h-8 border-[3px]" : "w-4 h-4 border-2";
  return (
    <span
      className={`${s} border-ink/20 border-t-ink rounded-full animate-spin inline-block`}
    />
  );
}

export default function HistoryPage({ setPage, onViewTrip }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api
      .getHistory()
      .then(setTrips)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this trip? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await api.deleteTrip(id);
      setTrips((p) => p.filter((t) => t.id !== id));
    } catch (e) {
      alert(e.message);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-4xl text-ink">Your Trips</h1>
        <button
          onClick={() => setPage("planner")}
          className="btn-primary py-2.5 px-5 text-sm"
        >
          + New Trip
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-24">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
          ⚠️ {error}
        </div>
      )}

      {!loading && trips.length === 0 && (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🗺️</p>
          <p className="font-display font-semibold text-xl text-ink mb-2">
            No trips yet
          </p>
          <p className="text-ink-muted text-sm mb-6">
            Plan your first adventure and it'll appear here.
          </p>
          <button onClick={() => setPage("planner")} className="btn-primary">
            Plan a Trip
          </button>
        </div>
      )}

      <div className="space-y-3">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="card px-6 py-5 flex items-center justify-between gap-4 hover:shadow-lift transition-shadow duration-200"
          >
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-lg text-ink truncate">
                {trip.destination}
              </p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-xs text-ink-muted">
                <span>
                  {BUDGET_EMOJI[trip.budget]} {trip.budget}
                </span>
                <span>·</span>
                <span>📅 {trip.days} days</span>
                <span>·</span>
                <span>🏷️ {trip.interests.join(", ")}</span>
                <span>·</span>
                <span className="text-teal">{formatDate(trip.created_at)}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => onViewTrip(trip.id)}
                className="bg-teal text-white text-xs font-medium px-3.5 py-1.5 rounded-lg hover:bg-teal-light transition-colors duration-150"
              >
                View
              </button>
              <button
                onClick={() => handleDelete(trip.id)}
                disabled={deleting === trip.id}
                className="border border-red-200 text-red-500 text-xs font-medium px-3.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors duration-150 disabled:opacity-50"
              >
                {deleting === trip.id ? "..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
