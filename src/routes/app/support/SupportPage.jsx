import { useState } from "react";
import AppSidebar from "../../../components/layout/AppSidebar";
import Topbar from "../../../components/layout/Topbar";
import Icon from "../../../components/ui/Icon";
import { useUiStore } from "../../../stores/uiStore";

const FAQS = [
  {
    q: "How does NyayaAI generate legal answers?",
    a: "NyayaAI uses a large language model grounded strictly on verified Indian statutes, constitutional articles, and Supreme Court judgements. It never fabricates citations.",
  },
  {
    q: "Is the information legally admissible advice?",
    a: "No. NyayaAI provides general legal information and education only. For case-specific legal advice, always consult a qualified advocate.",
  },
  {
    q: "How do I reset my password?",
    a: "Go to the Login page and click Forgot password. You will receive a reset link on your registered email within a few minutes.",
  },
  {
    q: "Why is my streak showing zero?",
    a: "Streaks are calculated based on quiz activity. Complete at least one quiz per day to build and maintain your streak.",
  },
  {
    q: "How do I report incorrect legal content?",
    a: "Use the contact form on this page and select Report incorrect content. Our content team reviews all submissions within 48 hours.",
  },
];

export default function SupportPage() {
  const { sidebarCollapsed } = useUiStore();
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ subject: "", message: "", type: "general" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    setForm({ subject: "", message: "", type: "general" });
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <AppSidebar variant="academy" />
      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "72px" : "260px" }}
      >
        <Topbar variant="academy" />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">

            <div className="space-y-2">
              <h1 className="text-[28px] font-bold text-on-surface">Support</h1>
              <p className="text-on-surface-variant text-[15px]">
                Find answers to common questions or get in touch with our team.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: "chat_bubble", label: "Live Chat", sub: "Avg. reply in 5 min", color: "text-primary" },
                { icon: "mail", label: "Email Us", sub: "support@nyayaai.in", color: "text-secondary" },
                { icon: "menu_book", label: "Documentation", sub: "Browse guides", color: "text-tertiary" },
              ].map(({ icon, label, sub, color }) => (
                <div
                  key={label}
                  className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className={"w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center " + color + " group-hover:scale-110 transition-transform"}>
                    <Icon name={icon} size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-[14px] text-on-surface">{label}</p>
                    <p className="text-[12px] text-on-surface-variant">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-[18px] font-bold text-on-surface mb-4">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {FAQS.map((faq, i) => (
                  <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-surface-container transition-colors"
                    >
                      <span className="font-semibold text-[14px] text-on-surface">{faq.q}</span>
                      <Icon
                        name={openFaq === i ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                        size={20}
                        className="shrink-0 text-on-surface-variant"
                      />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-4 text-[14px] text-on-surface-variant leading-relaxed border-t border-outline-variant/50">
                        <p className="pt-3">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
              <h2 className="text-[18px] font-bold text-on-surface mb-1">Contact Us</h2>
              <p className="text-[13px] text-on-surface-variant mb-6">
                Cannot find what you need? Send us a message and we will get back to you.
              </p>
              {sent ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="check_circle" size={30} className="text-primary" />
                  </div>
                  <p className="font-semibold text-on-surface">Message sent!</p>
                  <p className="text-[13px] text-on-surface-variant">We will reply to your registered email within 24 to 48 hours.</p>
                  <button onClick={() => setSent(false)} className="mt-2 text-[13px] text-primary underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-on-surface mb-1.5">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full px-3 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-[14px] text-on-surface focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="general">General Question</option>
                      <option value="bug">Bug / Technical Issue</option>
                      <option value="content">Report Incorrect Content</option>
                      <option value="billing">Billing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-on-surface mb-1.5">Subject</label>
                    <input
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Brief description of your issue"
                      className="w-full px-3 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-[14px] text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-on-surface mb-1.5">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe your issue in detail..."
                      className="w-full px-3 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-[14px] text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary font-semibold text-[14px] rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <Icon name="send" size={17} />
                    Send Message
                  </button>
                </form>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}