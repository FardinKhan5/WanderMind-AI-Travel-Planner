import { useAuth } from "../context/AuthContext";

const FEATURES = [
  {
    icon: "🗺️",
    title: "Smart Itineraries",
    desc: "Day-by-day plans tailored to your style, interests, and budget.",
  },
  {
    icon: "💾",
    title: "Trip History",
    desc: "Every itinerary saved automatically — revisit them anytime.",
  },
  {
    icon: "⚡",
    title: "Powered by Gemini",
    desc: "Google's Gemini 1.5 Pro crafts rich, realistic travel plans.",
  },
];

const DESTINATIONS = [
  "Tokyo",
  "Paris",
  "Bali",
  "New York",
  "Rome",
  "Bangkok",
  "Lisbon",
  "Kyoto",
];

export default function HomePage({ setPage }) {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink relative overflow-hidden">
        {/* Subtle background circle */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 py-28 text-center">
          <p className="text-terracotta-light text-xs uppercase tracking-[0.25em] font-medium mb-5">
            AI-Powered Travel Planning
          </p>
          <h1 className="font-display font-black text-5xl md:text-7xl text-white leading-[1.05] mb-6">
            Your next adventure,
            <br />
            <em className="not-italic text-terracotta-light">
              planned in seconds.
            </em>
          </h1>
          <p className="text-white/55 text-lg leading-relaxed max-w-xl mx-auto mb-10">
            Tell us where you want to go. WanderMind builds a detailed itinerary
            — activities, timings, costs, and insider tips included.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap mb-12">
            <button
              onClick={() => setPage(user ? "planner" : "register")}
              className="btn-primary text-base px-8 py-3.5"
            >
              {user ? "Plan a Trip →" : "Start for Free →"}
            </button>
            {!user && (
              <button
                onClick={() => setPage("login")}
                className="border border-white/20 text-white/70 font-body font-medium px-8 py-3.5 rounded-xl hover:bg-white/5 hover:text-white transition-all duration-200"
              >
                Sign In
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {DESTINATIONS.map((d) => (
              <span
                key={d}
                className="text-white/40 text-sm border border-white/10 rounded-full px-3 py-1"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="font-display font-bold text-3xl text-ink text-center mb-12">
          Why WanderMind?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="card p-8 hover:-translate-y-1 transition-transform duration-200"
            >
              <span className="text-3xl block mb-4">{f.icon}</span>
              <h3 className="font-display font-semibold text-lg text-ink mb-2">
                {f.title}
              </h3>
              <p className="text-ink-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink">
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <h2 className="font-display font-black text-4xl text-white mb-4">
            Ready to wander?
          </h2>
          <p className="text-white/50 mb-8">
            Join travelers who plan smarter with AI.
          </p>
          <button
            onClick={() => setPage(user ? "planner" : "register")}
            className="btn-primary text-base px-10 py-4"
          >
            {user ? "Plan a Trip →" : "Create Free Account →"}
          </button>
        </div>
      </section>
    </div>
  );
}
