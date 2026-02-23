import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";

function Spinner() {
  return (
    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
  );
}

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    bio: user?.bio || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.updateProfile(form);
      await refreshUser();
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

  const initials = (user?.full_name || user?.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card p-10 text-center">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-linear-to-br from-terracotta to-teal flex items-center justify-center mx-auto mb-3">
          <span className="font-display font-bold text-2xl text-white">
            {initials}
          </span>
        </div>
        <p className="text-ink-muted text-xs mb-8">
          Member since {formatDate(user?.created_at)}
        </p>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm mb-5">
            ✓ Profile updated successfully
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm mb-5">
            ⚠️ {error}
          </div>
        )}

        {editing ? (
          <div className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="label">Full Name</label>
              <input
                className="input-field"
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="label">Bio</label>
              <textarea
                className="input-field resize-none"
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell us about your travel style..."
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Spinner /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setError(null);
                }}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-left">
            {[
              { label: "Name", value: user?.full_name },
              { label: "Email", value: user?.email },
              { label: "Bio", value: user?.bio },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between gap-4 py-3.5 border-b border-stone last:border-0"
              >
                <span className="label pt-0.5">{label}</span>
                <span className="text-sm text-ink text-right">
                  {value || <em className="text-ink/30 not-italic">Not set</em>}
                </span>
              </div>
            ))}

            <div className="pt-6 space-y-2">
              <button
                onClick={() => {
                  setEditing(true);
                  setForm({
                    full_name: user?.full_name || "",
                    bio: user?.bio || "",
                  });
                }}
                className="btn-primary w-full"
              >
                Edit Profile
              </button>
              <button
                onClick={logout}
                className="w-full border border-red-200 text-red-500 font-body font-medium py-3 px-6 rounded-xl hover:bg-red-50 transition-colors duration-150"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
