import { useState } from "react";
import PlannerForm from "../components/PlannerForm";
import ItineraryView from "../components/ItineraryView";
import { api } from "../api/client";

export default function PlannerPage() {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setItinerary(null);
    try {
      const data = await api.planTrip(formData);
      setItinerary(data.itinerary);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return itinerary ? (
    <ItineraryView itinerary={itinerary} onReset={() => setItinerary(null)} />
  ) : (
    <PlannerForm onSubmit={handleSubmit} loading={loading} error={error} />
  );
}
