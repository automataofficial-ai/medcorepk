"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

export default function SettingsPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [fullName, setFullName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [examDate, setExamDate] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailReminders, setEmailReminders] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("medcore_user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
    setFullName(JSON.parse(userData).name);
    setLoading(false);
  }, [router]);

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      showError("Error", "Name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          updates: {
            full_name: fullName || null,
            specialty: specialty || null,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        showError("Error", errorData.error || "Failed to save profile");
        setSaving(false);
        return;
      }

      const updatedUser = { ...user, name: fullName };
      localStorage.setItem("medcore_user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      success("Profile Updated", "Your changes have been saved");
    } catch (err: any) {
      showError("Error", err?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      const supabase = getSupabase();
      const { error: prefError } = await supabase
        .from("users")
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (prefError) {
        throw prefError;
      }

      // Store preferences in localStorage instead
      localStorage.setItem("theme", darkMode ? "dark" : "light");
      localStorage.setItem("notifications_enabled", String(notificationsEnabled));
      localStorage.setItem("email_reminders", String(emailReminders));

      localStorage.setItem("theme", darkMode ? "dark" : "light");
      success("Preferences Updated", "Your settings have been saved");
    } catch (err) {
      showError("Error", "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    localStorage.removeItem("medcore_user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <div className="text-center">
          <p className="text-white font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      <div className="orb w-96 h-96 bg-blue-700 top-[-100px] left-[-100px]" style={{ animationDuration: "12s" }} />

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-slate-700/50 p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Settings</h1>
              <p className="text-slate-400 text-sm">Manage your account and preferences</p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white transition-colors text-sm font-medium"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-slate-700/50">
              {[
                { id: "profile", label: "Profile" },
                { id: "preferences", label: "Preferences" },
                { id: "account", label: "Account" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="px-4 py-3 font-medium text-sm transition-all border-b-2"
                  style={{
                    color: activeTab === tab.id ? "#00CED1" : "#94A3B8",
                    borderColor: activeTab === tab.id ? "#00CED1" : "transparent",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="glass rounded-2xl p-6" style={{ background: "rgba(30,27,75,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <h3 className="text-lg font-semibold text-white mb-6">Personal Information</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg outline-none text-white text-sm"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="w-full px-4 py-2 rounded-lg outline-none text-slate-400 text-sm"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}
                      />
                      <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Specialty</label>
                      <input
                        type="text"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        placeholder="e.g., Cardiology"
                        className="w-full px-4 py-2 rounded-lg outline-none text-white text-sm"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Target Exam Date</label>
                      <input
                        type="date"
                        value={examDate}
                        onChange={(e) => setExamDate(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg outline-none text-white text-sm"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="mt-6 px-6 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105"
                    style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)" }}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <div className="glass rounded-2xl p-6" style={{ background: "rgba(30,27,75,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <h3 className="text-lg font-semibold text-white mb-6">Notification Settings</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div>
                        <p className="text-white font-medium">Push Notifications</p>
                        <p className="text-xs text-slate-400">Get notified about important updates</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationsEnabled}
                        onChange={(e) => setNotificationsEnabled(e.target.checked)}
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div>
                        <p className="text-white font-medium">Email Reminders</p>
                        <p className="text-xs text-slate-400">Receive daily study reminders</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailReminders}
                        onChange={(e) => setEmailReminders(e.target.checked)}
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-700/50 mt-6 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Display Settings</h3>

                    <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div>
                        <p className="text-white font-medium">Dark Mode</p>
                        <p className="text-xs text-slate-400">Use dark theme (default)</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={(e) => setDarkMode(e.target.checked)}
                        className="w-5 h-5 rounded cursor-pointer"
                        disabled
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSavePreferences}
                    disabled={saving}
                    className="mt-6 px-6 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105"
                    style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)" }}
                  >
                    {saving ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <div className="glass rounded-2xl p-6" style={{ background: "rgba(30,27,75,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <h3 className="text-lg font-semibold text-white mb-6">Account Management</h3>

                  <div className="space-y-4">
                    <Link
                      href="/forgot-password"
                      className="w-full p-4 rounded-lg font-medium text-white transition-all flex items-center justify-between group"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      <span>Change Password</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full p-4 rounded-lg font-medium text-red-400 transition-all"
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                    >
                      Sign Out
                    </button>
                  </div>

                  <div className="border-t border-slate-700/50 mt-6 pt-6">
                    <h3 className="text-sm font-medium text-slate-400 mb-4">Account Created</h3>
                    <p className="text-xs text-slate-500">
                      {new Date(user?.loggedInAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
