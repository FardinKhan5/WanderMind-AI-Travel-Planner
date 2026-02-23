import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PlannerPage from "./pages/PlannerPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import ItineraryView from "./components/ItineraryView";
import { api } from "./api/client";
import "./index.css";

function AppInner() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState("home");
  const [viewingTrip, setViewingTrip] = useState(null);

  useEffect(() => {
    if (!loading && user && ["login", "register", "home"].includes(page))
      setPage("planner");
    if (!loading && !user && ["planner", "history", "profile"].includes(page))
      setPage("home");
  }, [user, loading]);

  const handleViewTrip = async (id) => {
    try {
      const trip = await api.getTrip(id);
      setViewingTrip(trip);
      setPage("trip-detail");
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-cream">
        <span className="w-9 h-9 border-[3px] border-ink/15 border-t-terracotta rounded-full animate-spin" />
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage setPage={setPage} />;
      case "login":
        return <LoginPage setPage={setPage} />;
      case "register":
        return <RegisterPage setPage={setPage} />;
      case "planner":
        return <PlannerPage />;
      case "history":
        return <HistoryPage setPage={setPage} onViewTrip={handleViewTrip} />;
      case "profile":
        return <ProfilePage />;
      case "trip-detail":
        return viewingTrip ? (
          <ItineraryView
            itinerary={viewingTrip.itinerary}
            onReset={() => setPage("history")}
            resetLabel="← Back to History"
          />
        ) : null;
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar page={page} setPage={setPage} />
      <main className="flex-1">{renderPage()}</main>
      <footer className="border-t border-stone py-6 text-center text-xs text-ink-muted bg-stone">
        Built with FastAPI · LangChain · React · Gemini 1.5 Pro
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
