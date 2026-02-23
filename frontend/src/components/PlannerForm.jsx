import { useState } from "react";

const INTERESTS = [
  { id: "food", label: "🍜 Food & Cuisine" },
  { id: "history", label: "🏛️ History & Culture" },
  { id: "adventure", label: "🧗 Adventure" },
  { id: "art", label: "🎨 Art & Museums" },
  { id: "nightlife", label: "🌙 Nightlife" },
  { id: "nature", label: "🌿 Nature" },
  { id: "shopping", label: "🛍️ Shopping" },
  { id: "wellness", label: "🧘 Wellness" },
];

function Spinner() {
  return (
    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
  );
}

export default function PlannerForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState({
    destination: "",
    days: 3,
    budget: "mid-range",
    interests: [],
  });

  const toggleInterest = (id) =>
    setForm((p) => ({
      ...p,
      interests: p.interests.includes(id)
        ? p.interests.filter((i) => i !== id)
        : [...p.interests, id],
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.destination.trim()) return;
    if (form.interests.length === 0)
      return alert("Pick at least one interest!");
    onSubmit(form);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="font-display font-bold text-4xl text-ink mb-2">
          Plan Your Trip
        </h2>
        <p className="text-ink-muted">
          Tell us where you're headed and we'll handle the rest.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Destination */}
        <div className="space-y-2">
          <label className="label">Destination</label>
          <input
            className="input-field text-base"
            type="text"
            placeholder="e.g. Tokyo, Japan"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            required
          />
        </div>

        {/* Duration */}
        <div className="space-y-3">
          <label className="label">
            Duration —{" "}
            <span className="text-terracotta font-semibold not-uppercase normal-case text-sm tracking-normal">
              {form.days} {form.days === 1 ? "day" : "days"}
            </span>
          </label>
          <input
            type="range"
            min={1}
            max={14}
            value={form.days}
            onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
            className="w-full h-1.5 bg-stone rounded-full appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5
                       [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-terracotta [&::-webkit-slider-thumb]:border-2
                       [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
          />
          <div className="flex justify-between text-xs text-ink-muted">
            <span>1 day</span>
            <span>14 days</span>
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label className="label">Budget</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: "budget", label: "💰 Budget" },
              { key: "mid-range", label: "💳 Mid-Range" },
              { key: "luxury", label: "💎 Luxury" },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setForm({ ...form, budget: key })}
                className={`py-2.5 rounded-xl text-sm font-medium font-body transition-all duration-150 border
                  ${
                    form.budget === key
                      ? "bg-terracotta text-white border-terracotta"
                      : "bg-stone border-stone text-ink-muted hover:border-terracotta/40 hover:text-ink"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <label className="label">Interests</label>
          <div className="grid grid-cols-2 gap-2">
            {INTERESTS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleInterest(item.id)}
                className={`py-2.5 px-3 rounded-xl text-sm font-body text-left transition-all duration-150 border
                  ${
                    form.interests.includes(item.id)
                      ? "bg-teal text-white border-teal"
                      : "bg-stone border-stone text-ink-muted hover:border-teal/40 hover:text-ink"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4"
        >
          {loading ? (
            <>
              <Spinner /> Crafting your itinerary...
            </>
          ) : (
            "Generate Itinerary ✈️"
          )}
        </button>
      </form>
    </div>
  );
}
