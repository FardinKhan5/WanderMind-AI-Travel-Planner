import { useAuth } from "../context/AuthContext";

export default function Navbar({ page, setPage }) {
  const { user, logout } = useAuth();
  const navTo = (p) => setPage(p);

  return (
    <nav className="sticky top-0 z-50 bg-ink border-b-2 border-terracotta">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navTo(user ? "planner" : "home")}
          className="flex items-center gap-2 group"
        >
          <span className="text-lg">✈</span>
          <span className="font-display font-bold text-lg text-white tracking-tight">
            WanderMind
          </span>
        </button>

        {/* Nav links */}
        {user ? (
          <div className="flex items-center gap-1">
            {[
              { label: "Plan", key: "planner" },
              { label: "History", key: "history" },
              { label: "Profile", key: "profile" },
            ].map(({ label, key }) => (
              <button
                key={key}
                onClick={() => navTo(key)}
                className={`px-4 py-1.5 rounded-lg font-body text-sm font-medium transition-all duration-150
                  ${
                    page === key
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={logout}
              className="ml-2 px-4 py-1.5 rounded-lg border border-white/15 text-white/50 text-sm font-body hover:text-white hover:border-white/30 transition-all duration-150"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navTo("login")}
              className="btn-ghost text-white/60 hover:text-white hover:bg-white/5 text-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => navTo("register")}
              className="bg-terracotta text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-terracotta-light transition-colors duration-150"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
