export default function ItineraryView({
  itinerary,
  onReset,
  resetLabel = "← Plan Another Trip",
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-ink rounded-2xl p-10 mb-8 relative overflow-hidden">
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-terracotta/10 rounded-full blur-2xl pointer-events-none" />
        <p className="text-terracotta-light text-xs uppercase tracking-[0.2em] mb-3">
          Your Itinerary
        </p>
        <h1 className="font-display font-black text-4xl md:text-5xl text-white leading-tight mb-4">
          {itinerary.destination}
        </h1>
        <p className="text-white/55 leading-relaxed max-w-lg mb-6">
          {itinerary.summary}
        </p>
        <div className="flex gap-3 flex-wrap">
          <span className="text-sm text-white bg-white/10 border border-white/15 rounded-full px-4 py-1">
            📅 {itinerary.days.length} Days
          </span>
          <span className="text-sm text-white bg-white/10 border border-white/15 rounded-full px-4 py-1">
            💰 {itinerary.estimated_total_cost}
          </span>
        </div>
      </div>

      {/* Days */}
      <div className="space-y-6 mb-8">
        {itinerary.days.map((day) => (
          <div key={day.day} className="card overflow-hidden">
            <div className="bg-stone px-6 py-4 border-b border-stone flex items-center gap-3">
              <span className="font-display font-bold text-terracotta text-sm uppercase tracking-wider">
                Day {day.day}
              </span>
              <span className="text-ink font-medium text-sm">{day.theme}</span>
            </div>

            <div className="divide-y divide-stone">
              {day.activities.map((act, i) => (
                <div key={i} className="px-6 py-5 flex gap-5">
                  <div className="min-w-16 text-teal text-xs font-medium pt-0.5 text-right shrink-0">
                    {act.time}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <h4 className="font-display font-semibold text-ink text-base">
                        {act.title}
                      </h4>
                      <span className="text-xs font-medium text-terracotta bg-terracotta/8 px-2.5 py-1 rounded-lg shrink-0">
                        {act.estimated_cost}
                      </span>
                    </div>
                    <p className="text-ink-muted text-sm leading-relaxed mb-2">
                      {act.description}
                    </p>
                    <p className="text-teal text-xs bg-teal/8 rounded-lg px-3 py-2">
                      💡 {act.tips}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="card p-8 mb-8">
        <h3 className="font-display font-bold text-2xl text-ink mb-5">
          Essential Tips
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {itinerary.essential_tips.map((tip, i) => (
            <div key={i} className="flex gap-3 p-4 bg-stone rounded-xl">
              <span className="font-display font-bold text-2xl text-terracotta/40 leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-ink-muted text-sm leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button onClick={onReset} className="btn-outline">
          {resetLabel}
        </button>
      </div>
    </div>
  );
}
