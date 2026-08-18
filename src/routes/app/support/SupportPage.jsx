import { useState } from "react";
import AppSidebar from "../../../components/layout/AppSidebar";
import Topbar from "../../../components/layout/Topbar";
import Icon from "../../../components/ui/Icon";
import { useUiStore } from "../../../stores/uiStore";

const SECTIONS = [
  {
    id: "program",
    label: "Program",
    doubtLabel: "program details",
    faqs: [
      {
        q: "What is the Law Programme and who is it designed for?",
        a: "The NyayaAI Law Programme is a comprehensive legal education initiative designed for students aspiring to enter the legal field, working professionals looking to upskill, and individuals who want a thorough understanding of Indian law without enrolling in a full-time LLB degree.",
      },
      {
        q: "What career opportunities are available after completing the programme?",
        a: "Graduates can pursue roles in law firms, corporate legal departments, government agencies, legal-tech startups, compliance, policy research, and judicial services. The programme also prepares candidates for LLM admissions and international legal roles.",
      },
      {
        q: "Is the programme suitable for students as well as working professionals?",
        a: "Absolutely. The programme is designed with flexible scheduling — self-paced modules, weekend live sessions, and recorded lectures — making it equally accessible for full-time students and professionals with demanding work schedules.",
      },
      {
        q: "What makes this Law programme different from a traditional law degree?",
        a: "Unlike a traditional 5-year LLB, this programme focuses on applied legal skills, modern specialisations (Legal Tech, AI & Law, Corporate Law), mentorship from practising lawyers, and real-world case simulations — delivering industry-ready outcomes in a fraction of the time.",
      },
      {
        q: "Will I receive a recognised certificate upon completion?",
        a: "Yes. Upon successful completion, participants receive a verified certificate of completion from NyayaAI, which can be shared on LinkedIn and other professional platforms.",
      },
    ],
  },
  {
    id: "specialisations",
    label: "New Law Specialisation",
    doubtLabel: "specialisation details",
    faqs: [
      {
        q: "What specialisations are available in the Law programme?",
        a: "The programme currently offers specialisations in Corporate & Commercial Law, Cyber Law & Data Privacy, Intellectual Property Rights, Technology Law & AI, Criminal Law, and Constitutional & Public Interest Law.",
      },
      {
        q: "Can I choose a specialisation based on my career goals?",
        a: "Yes. During enrolment you can select your primary specialisation. Our counsellors are available to guide you in choosing a track aligned with your career aspirations and academic background.",
      },
      {
        q: "What is covered under Corporate and Commercial Law?",
        a: "This specialisation covers company law, mergers and acquisitions, contract drafting, securities regulation, competition law, insolvency and bankruptcy, and cross-border commercial transactions.",
      },
      {
        q: "Does the programme offer specialisations in Cyber Law, Intellectual Property, or Technology Law?",
        a: "Yes. Dedicated tracks for Cyber Law & Data Privacy, Intellectual Property Rights, and Technology Law & AI are available, covering the IT Act, DPDP Act, patent law, trademarks, copyright, and legal implications of emerging technologies.",
      },
      {
        q: "Can I change my specialisation after enrolling in the programme?",
        a: "Specialisation changes are permitted within the first 30 days of enrolment, subject to seat availability. After that period, changes may be considered on a case-by-case basis by the academic committee.",
      },
    ],
  },
  {
    id: "curriculum",
    label: "Curriculum & Structure",
    doubtLabel: "curriculum details",
    faqs: [
      {
        q: "What subjects and topics are covered in the Law curriculum?",
        a: "Core subjects include Constitutional Law, Contract Law, Criminal Law, Civil Procedure, Evidence, Legal Drafting, Legal Research Methodology, and Jurisprudence. Elective modules cover emerging areas like AI, privacy law, and dispute resolution.",
      },
      {
        q: "How is the programme structured across the different terms or modules?",
        a: "The programme is divided into three terms. Term 1 covers foundational law. Term 2 introduces specialisation subjects. Term 3 focuses on applied skills, capstone projects, moot court simulations, and career preparation.",
      },
      {
        q: "Does the curriculum include practical case studies and real-world legal problems?",
        a: "Yes. Each module integrates landmark Indian cases, live drafting exercises, client-counselling role-plays, and real-world legal problem sets drawn from recent judgements and industry scenarios.",
      },
      {
        q: "Will I learn legal research, drafting, contracts, and case analysis?",
        a: "Absolutely. Legal research, contract drafting, case analysis, and argumentative writing are core competencies woven throughout the curriculum, culminating in a final drafting portfolio assessed by practising lawyers.",
      },
      {
        q: "How frequently is the curriculum updated to reflect changes in law and industry?",
        a: "Our curriculum committee reviews and updates content every quarter to incorporate new legislation, Supreme Court judgements, and emerging industry practices.",
      },
    ],
  },
  {
    id: "legal-tech",
    label: "Legal Tech & AI Elective",
    doubtLabel: "Legal Tech & AI details",
    faqs: [
      {
        q: "What is covered in the Legal Technology and AI module?",
        a: "The module covers AI-assisted legal research, contract lifecycle management tools, e-discovery, legal analytics, document automation, blockchain applications in law, and the regulatory landscape governing AI in India and globally.",
      },
      {
        q: "How is Artificial Intelligence changing the legal profession?",
        a: "AI is transforming legal research, contract review, due diligence, and litigation prediction. Lawyers who understand AI tools can deliver faster, more accurate, and cost-effective services — making Legal Tech literacy a key competitive advantage.",
      },
      {
        q: "Will I learn how to use AI tools for legal research and drafting?",
        a: "Yes. Hands-on labs cover tools like NyayaAI, Harvey, Lexis+ AI, and contract-automation platforms. You will learn prompt engineering, AI output verification, and ethical guardrails for AI-generated legal content.",
      },
      {
        q: "Does the programme cover ethical and legal issues related to AI?",
        a: "A dedicated session covers AI ethics, liability for AI errors, data protection in AI systems, bias in algorithmic decision-making, and the Bar Council of India guidelines on technology use by advocates.",
      },
      {
        q: "How can Legal Tech skills improve my career opportunities?",
        a: "Legal-tech proficiency commands premium salaries at law firms, Big4 advisory practices, and in-house legal departments. It also opens doors to roles in legal-tech product companies, compliance-tech startups, and regulatory bodies.",
      },
    ],
  },
  {
    id: "mentorship",
    label: "Mentorship & Mock Interviews",
    doubtLabel: "mentorship details",
    faqs: [
      {
        q: "Will I receive mentorship from experienced legal professionals?",
        a: "Yes. Each enrolled learner is matched with a mentor — a practising advocate, in-house counsel, or legal-tech professional — for bi-weekly one-on-one sessions throughout the programme.",
      },
      {
        q: "How do the mentorship sessions help with career development?",
        a: "Mentors share real-world insights, review your legal work, introduce you to their networks, and guide you in identifying suitable roles, drafting applications, and navigating the legal job market.",
      },
      {
        q: "Does the programme include mock interviews for legal roles?",
        a: "Yes. Term 3 includes structured mock interviews simulating law firm associate interviews, in-house counsel screenings, and legal-tech company hiring panels, conducted by industry professionals.",
      },
      {
        q: "Will I receive feedback on my resume, legal writing, and interview performance?",
        a: "Detailed written feedback is provided after every mock interview and draft submission. Resume reviews are conducted by career coaches with experience in legal recruitment.",
      },
      {
        q: "Can I interact with mentors to understand different legal career paths?",
        a: "Absolutely. In addition to one-on-one sessions, the programme hosts monthly career panels where mentors from diverse legal verticals share their journeys and answer questions from the cohort.",
      },
    ],
  },
  {
    id: "outcomes",
    label: "Outcomes & Career",
    doubtLabel: "career outcomes",
    faqs: [
      {
        q: "What career opportunities can I pursue after completing the programme?",
        a: "Graduates pursue careers as legal associates, corporate counsels, compliance officers, legal researchers, contract managers, policy analysts, legal-tech product managers, and judicial services aspirants.",
      },
      {
        q: "Can this programme help me prepare for corporate legal roles?",
        a: "Yes. The corporate law specialisation and contract-drafting modules are specifically designed to prepare candidates for corporate in-house and law firm roles, with case simulations drawn from real M&A and commercial transactions.",
      },
      {
        q: "What roles are available in law firms, legal departments, and legal-tech companies?",
        a: "In law firms: associate, paralegal, research analyst. In legal departments: in-house counsel, contract manager, compliance specialist. In legal-tech companies: legal operations analyst, product counsel, implementation specialist.",
      },
      {
        q: "Does the programme provide placement or career support?",
        a: "We offer a dedicated career services team that assists with job placement, internship referrals, alumni networking events, and access to our hiring-partner portal with exclusive listings from law firms and corporates.",
      },
      {
        q: "What salary can I expect after completing the programme?",
        a: "Entry-level salaries typically range from INR 4 to 8 LPA depending on the city, employer, and specialisation. Candidates placed in top-tier law firms or MNC legal departments often command packages upward of INR 10 to 15 LPA.",
      },
    ],
  },
  {
    id: "fees",
    label: "Fees, Schedule & Flexibility",
    doubtLabel: "fees and schedule",
    faqs: [
      {
        q: "What is the fee structure for the Law programme?",
        a: "Programme fees vary by specialisation and cohort. Please visit the Admissions page or contact our counsellors for the current fee schedule. Early-bird and alumni-referral discounts are available.",
      },
      {
        q: "Are flexible payment or EMI options available?",
        a: "Yes. Zero-cost EMI plans of up to 12 months are available through select partner banks and NBFCs. Income Share Agreements (ISA) may also be available for eligible candidates.",
      },
      {
        q: "Can I pursue the programme while working or studying?",
        a: "Definitely. The programme is designed for working professionals and students alike. Live sessions are held on evenings and weekends, with all content available on-demand so you can learn at your own pace.",
      },
      {
        q: "Are classes conducted online, offline, or in a hybrid format?",
        a: "The programme is primarily online, with optional in-person workshops, networking events, and moot court sessions held at partner venues in major cities. International learners can participate fully online.",
      },
      {
        q: "How much time should I expect to dedicate to the programme each week?",
        a: "We recommend 8 to 12 hours per week, including live sessions (3 to 4 hours), self-paced learning (3 to 4 hours), and assignments (2 to 4 hours). Intensive periods around assessments may require additional time.",
      },
    ],
  },
];

export default function SupportPage() {
  const { sidebarCollapsed } = useUiStore();
  const [activeSection, setActiveSection] = useState("program");
  const [openFaq, setOpenFaq] = useState(null);
  const [callbackModal, setCallbackModal] = useState(false);
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");

  const section = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];

  function selectSection(id) {
    setActiveSection(id);
    setOpenFaq(null);
  }

  function toggleFaq(key) {
    setOpenFaq((prev) => (prev === key ? null : key));
  }

  function handleCallbackSubmit(e) {
    e.preventDefault();
    setCallbackSubmitted(true);
    setTimeout(() => {
      setCallbackModal(false);
      setCallbackSubmitted(false);
      setPhone("");
      setFullName("");
    }, 2500);
  }

  return (
    <div className="flex h-screen bg-[#fafbfc] overflow-hidden font-sans">
      <AppSidebar variant="academy" />
      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "72px" : "260px" }}
      >
        <Topbar variant="academy" />

        <main className="flex-1 overflow-y-auto bg-[#fafbfc]">
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
            
            {/* Header */}
            <div className="mb-10">
              <p className="text-[12px] md:text-[13px] font-bold text-gray-700 tracking-[0.12em] uppercase mb-2">
                FREQUENTLY ASKED QUESTIONS
              </p>
              <h1 className="text-[28px] md:text-[36px] font-bold text-gray-950 tracking-tight">
                Got Questions? We&apos;ve Got Answers
              </h1>
            </div>

            {/* Main 2-column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Left Column - Navigation List */}
              <div className="md:col-span-4 lg:col-span-3.5 flex flex-col space-y-1">
                {SECTIONS.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => selectSection(sec.id)}
                      className={`w-full text-left py-3.5 px-4 text-[14.5px] transition-all cursor-pointer flex items-center ${
                        isActive
                          ? "bg-[#eaf1fc] text-[#1e3a8a] font-bold border-l-[3.5px] border-[#1d4ed8] shadow-xs"
                          : "text-gray-700 font-medium hover:bg-gray-100/70 hover:text-gray-900 border-l-[3.5px] border-transparent"
                      }`}
                    >
                      {sec.label}
                    </button>
                  );
                })}
              </div>

              {/* Right Column - Questions Accordion & Banner */}
              <div className="md:col-span-8 lg:col-span-8.5 space-y-4">
                
                {/* Questions List */}
                <div className="space-y-3">
                  {section.faqs.map((faq, i) => {
                    const key = `${section.id}-${i}`;
                    const isOpen = openFaq === key;
                    return (
                      <div
                        key={key}
                        className="bg-white border border-gray-200/90 rounded-sm transition-all duration-150 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                      >
                        <button
                          onClick={() => toggleFaq(key)}
                          className="w-full flex items-center justify-between p-5 md:px-6 md:py-4.5 text-left gap-4 hover:bg-gray-50/60 transition-colors cursor-pointer"
                        >
                          <span className="font-semibold text-[15px] text-gray-900 leading-snug">
                            {faq.q}
                          </span>
                          <span className="text-gray-600 font-light text-[22px] leading-none shrink-0 select-none ml-2">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>
                        
                        {isOpen && (
                          <div className="px-5 pb-5 md:px-6 md:pb-5 text-[14px] text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                            <p>{faq.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom CTA Banner */}
                <div className="bg-[#edf4fe] border border-blue-100/80 rounded-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                  <div>
                    <h2 className="font-bold text-[16px] text-gray-950 mb-1">
                      Still having doubts regarding {section.doubtLabel}?
                    </h2>
                    <p className="text-[13.5px] text-gray-600">
                      Reach out to the team for more information.
                    </p>
                  </div>

                  <button
                    onClick={() => setCallbackModal(true)}
                    className="inline-flex items-center justify-center gap-2.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-bold text-[13px] tracking-wider uppercase px-6 py-3.5 rounded-sm transition-colors shrink-0 cursor-pointer shadow-xs"
                  >
                    <Icon name="call" size={17} />
                    <span>REQUEST A CALLBACK</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </main>
      </div>

      {/* Request Callback Modal */}
      {callbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setCallbackModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <Icon name="close" size={20} />
            </button>

            {callbackSubmitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="check" size={24} />
                </div>
                <h3 className="text-[18px] font-bold text-gray-900 mb-1">Request Received!</h3>
                <p className="text-[13.5px] text-gray-600">
                  Our academic advisor will call you shortly at {phone}.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-[20px] font-bold text-gray-900 mb-1">Request a Callback</h3>
                <p className="text-[13px] text-gray-600 mb-5">
                  Have questions about {section.label}? Our legal education experts will guide you.
                </p>

                <form onSubmit={handleCallbackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-[14px] focus:outline-none focus:border-[#0b57d0]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-[14px] focus:outline-none focus:border-[#0b57d0]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0b57d0] hover:bg-[#0842a0] text-white font-bold text-[13px] tracking-wider uppercase py-3 rounded-md transition-colors mt-2"
                  >
                    Submit Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}