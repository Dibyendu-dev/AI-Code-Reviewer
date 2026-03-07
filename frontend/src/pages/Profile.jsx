import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { getMe, updateMeProfile } from "../api/profile";

const emptyProfile = {
  first_name: "",
  last_name: "",
  phone: "",
  location: "",
  avatar_url: "",
  bio: "",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("token"), []);

  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getMe();
        if (!mounted) return;
        setEmail(res.data.email ?? "");
        setProfile({ ...emptyProfile, ...(res.data.profile ?? {}) });
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.detail ?? "Failed to load profile.");
        if (e?.response?.status === 401) navigate("/login");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate, token]);

  const onChange = (key) => (e) => {
    setSuccess("");
    setError("");
    setProfile((p) => ({ ...p, [key]: e.target.value }));
  };

  const save = async () => {
    setSaving(true);
    setSuccess("");
    setError("");
    try {
      await updateMeProfile(profile);
      setSuccess("Saved.");
    } catch (e) {
      setError(e?.response?.data?.detail ?? "Failed to save.");
      if (e?.response?.status === 401) navigate("/login");
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="w-full border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="text-sm text-gray-300 hover:text-white transition"
              onClick={() => navigate("/")}
            >
              ← Home
            </button>
            <div className="h-4 w-px bg-white/15" />
            <h1 className="text-lg font-semibold tracking-wide">Profile</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-2xl" onClick={logout}>
              Logout
            </Button>
            <Button
              className="bg-white text-black hover:bg-gray-200 rounded-2xl"
              onClick={save}
              disabled={saving || loading}
            >
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-1 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 border border-white/10 flex items-center justify-center">
                <span className="text-xl font-semibold">
                  {(profile.first_name?.[0] ?? email?.[0] ?? "U").toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Signed in as</p>
                <p className="font-medium">{email || "—"}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-gray-300">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  {loading ? "Loading" : "Active"}
                </span>
              </div>
            </div>

            {(error || success) && (
              <div className="mt-6">
                {error && (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                    {success}
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-xl font-semibold">Your details</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Update your profile information and save it to the database.
                </p>
              </div>
              <div className="hidden sm:block">
                <Button
                  variant="outline"
                  className="rounded-2xl"
                  onClick={() => navigate("/editor")}
                >
                  Go to editor
                </Button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="First name" value={profile.first_name} onChange={onChange("first_name")} />
              <Field label="Last name" value={profile.last_name} onChange={onChange("last_name")} />
              <Field label="Phone" value={profile.phone} onChange={onChange("phone")} />
              <Field label="Location" value={profile.location} onChange={onChange("location")} />
              <Field
                label="Avatar URL"
                value={profile.avatar_url}
                onChange={onChange("avatar_url")}
                className="md:col-span-2"
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={onChange("bio")}
                  rows={5}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="Tell us a little about yourself..."
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={() => {
                  setProfile(emptyProfile);
                  setSuccess("");
                  setError("");
                }}
                disabled={saving || loading}
              >
                Reset
              </Button>
              <Button
                className="bg-white text-black hover:bg-gray-200 rounded-2xl"
                onClick={save}
                disabled={saving || loading}
              >
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <input
        value={value ?? ""}
        onChange={onChange}
        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
        placeholder={label}
      />
    </div>
  );
}

