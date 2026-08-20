import { useState, useEffect } from "react";
import AppSidebar from "../../../components/layout/AppSidebar";
import Topbar from "../../../components/layout/Topbar";
import Icon from "../../../components/ui/Icon";
import Avatar from "../../../components/ui/Avatar";
import { useAuthStore } from "../../../stores/authStore";
import { useUiStore } from "../../../stores/uiStore";
import { updateUserApi } from "../../../lib/api/auth";
import { useLanguage } from "../../../hooks/useLanguage";

export default function SettingsPage() {
  const { sidebarCollapsed } = useUiStore();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  const { preferred_language_native, preferred_language_name, openModal } = useLanguage();

  const [fullName, setFullName] = useState(user?.full_name || user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  async function handleProfileSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      if (token) {
        const updated = await updateUserApi(token, { full_name: fullName });
        if (setUser && updated) {
          setUser(updated);
        }
      }
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3500);
    }
  }

  const displayName = user?.full_name || user?.name || "User";
  const displayLang = preferred_language_native
    ? `${preferred_language_name} (${preferred_language_native})`
    : preferred_language_name || "Not selected";

  return (
    <div className="flex h-screen bg-[#fafbfc] overflow-hidden font-sans">
      <AppSidebar variant="academy" />
      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "72px" : "260px" }}
      >
        <Topbar variant="academy" />

        <main className="flex-1 overflow-y-auto bg-[#fafbfc]">
          <div className="max-w-4xl mx-auto px-6 md:px-10 py-10">
            
            {/* Page Header */}
            <div className="mb-8">
              <p className="text-[12px] font-bold text-gray-500 tracking-[0.12em] uppercase mb-1">
                ACCOUNT & PREFERENCES
              </p>
              <h1 className="text-[28px] md:text-[32px] font-bold text-gray-950 tracking-tight">
                Settings
              </h1>
              <p className="text-[14px] text-gray-600 mt-1">
                Manage your profile, account preferences, and application settings.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-200 mb-8">
              {[
                { id: "profile", label: "Profile", icon: "person" },
                { id: "account", label: "Account Details", icon: "badge" },
                { id: "notifications", label: "Preferences", icon: "tune" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-[14px] font-semibold border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "border-[#0b57d0] text-[#0b57d0]"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <Icon name={tab.icon} size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Notification alert */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-md text-[13.5px] font-medium flex items-center gap-2.5 ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                <Icon name={message.type === "success" ? "check_circle" : "error"} size={18} />
                <span>{message.text}</span>
              </div>
            )}

            {/* Tab: Profile */}
            {activeTab === "profile" && (
              <div className="bg-white border border-gray-200/90 rounded-sm p-6 md:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-6">
                
                {/* Avatar Banner */}
                <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                  <Avatar name={displayName} size="lg" className="w-16 h-16 text-xl border-2 border-primary-fixed" />
                  <div>
                    <h2 className="text-[17px] font-bold text-gray-900">{displayName}</h2>
                    <p className="text-[13px] text-gray-500">{email || "No email provided"}</p>
                    <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700">
                      {user?.role_name || "Member"}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-5">
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full max-w-md px-3.5 py-2.5 border border-gray-300 rounded-md text-[14px] text-gray-900 focus:outline-none focus:border-[#0b57d0]"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full max-w-md px-3.5 py-2.5 border border-gray-200 bg-gray-50 rounded-md text-[14px] text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-[12px] text-gray-500 mt-1">
                      Email is linked to your account authentication and cannot be changed directly.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-bold text-[13px] tracking-wider uppercase rounded-sm transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>

              </div>
            )}

            {/* Tab: Account Details */}
            {activeTab === "account" && (
              <div className="bg-white border border-gray-200/90 rounded-sm p-6 md:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-6">
                <div>
                  <h2 className="text-[17px] font-bold text-gray-900 mb-1">Account Information</h2>
                  <p className="text-[13px] text-gray-500">Details about your NyayaAI account.</p>
                </div>

                <div className="divide-y divide-gray-100 text-[14px]">
                  <div className="py-3 flex justify-between">
                    <span className="text-gray-500">Account ID</span>
                    <span className="font-mono text-gray-900 font-medium">#{user?.id || "N/A"}</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-gray-500">Role / Access</span>
                    <span className="text-gray-900 font-medium">{user?.role_name || "Common Man"}</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-gray-500">Jurisdiction Grounding</span>
                    <span className="text-gray-900 font-medium">Indian Law (BNS, BNSS, BSA & Landmark Judgements)</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-gray-500">Account Status</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Preferences */}
            {activeTab === "notifications" && (
              <div className="bg-white border border-gray-200/90 rounded-sm p-6 md:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-6">
                <div>
                  <h2 className="text-[17px] font-bold text-gray-900 mb-1">Application Preferences</h2>
                  <p className="text-[13px] text-gray-500">Customize your legal assistance and learning experience.</p>
                </div>

                <div className="space-y-4">
                  {/* Language Selection Setting Entry (Requirement 2b) */}
                  <div className="flex items-center justify-between p-4 bg-[#eaf1fc]/50 border border-blue-100 rounded-md">
                    <div>
                      <p className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
                        <Icon name="translate" size={18} className="text-[#0b57d0]" />
                        Preferred Legal Chat Language
                      </p>
                      <p className="text-[12.5px] text-gray-600 mt-0.5">
                        Current selection: <strong className="text-[#0b57d0] font-bold">{displayLang}</strong>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={openModal}
                      className="px-4 py-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-bold text-[12.5px] rounded-md transition-colors cursor-pointer shadow-2xs shrink-0 flex items-center gap-1.5"
                    >
                      <span>Change Language</span>
                      <Icon name="edit" size={15} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                    <div>
                      <p className="text-[14px] font-semibold text-gray-900">Email Study Reminders</p>
                      <p className="text-[12.5px] text-gray-500">Receive daily streak notifications and course progress updates.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                    <div>
                      <p className="text-[14px] font-semibold text-gray-900">AI Citation Badges</p>
                      <p className="text-[12.5px] text-gray-500">Display statutory section cross-references inside lesson answers.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}