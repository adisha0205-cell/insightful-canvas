import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Brain, CalendarDays, ChartBar, FileText, Lightbulb, Sparkles } from "lucide-react";
import { chapters, filterOptions, priorityStyles, type UnitTag } from "@/data/chapters";

const strategies = [
  { icon: "📊", title: "Prioritize by Weightage", body: "Focus 60% of your prep time on Genetics & Evolution (18 marks) and Reproduction (16 marks). These two units alone can secure 48% of theory marks.", tag: "High Impact", tone: "danger" },
  { icon: "🔁", title: "Diagram-First Technique", body: "Master all NCERT diagrams: meiosis, DNA replication, lac operon, ecosystem flow. A well-labelled diagram can fetch 2–3 marks even with partial answers.", tag: "Visual Marks", tone: "amber" },
  { icon: "📝", title: "Keyword Underlining", body: "CBSE examiners look for scientific terms. Use exact NCERT terminology — \"totipotency,\" \"codominance,\" \"biomagnification.\" Underline key terms in your answers.", tag: "Writing Skill", tone: "primary" },
  { icon: "⏱️", title: "Time Allocation", body: "VSA (1 mark): 1 min · SA-I (2 marks): 3–4 min · SA-II (3 marks): 5–6 min · LA (5 marks): 10 min. Reserve 15 min for revision.", tag: "Time Mgmt", tone: "info" },
  { icon: "🗂️", title: "NCERT is the Bible", body: "80–85% of questions are directly from NCERT text and exercises. Complete all In-Text and Exercise questions. Never skip NCERT examples.", tag: "Critical", tone: "danger" },
  { icon: "📋", title: "Previous Year Pattern", body: "Solve last 5 years' PYQs to identify repeated topics. Biotechnology applications and ecology questions repeat with minor variations every year.", tag: "Pattern", tone: "amber" },
  { icon: "🧬", title: "Flowchart Summaries", body: "Convert long-answer chapters (Molecular Basis, Biotechnology) into flowcharts. This aids quick recall in the last 48 hours and reduces cognitive load.", tag: "Revision", tone: "primary" },
  { icon: "🎯", title: "Assertion-Reason Mastery", body: "Practice at least 30 A&R questions per chapter. These carry 1 mark each and test conceptual clarity — eliminate options systematically.", tag: "MCQ Skill", tone: "info" },
];

const toneClass = (tone: string) =>
  tone === "danger"  ? "bg-danger-soft text-danger"
  : tone === "amber" ? "bg-amber-soft text-amber"
  : tone === "info"  ? "bg-info-soft text-info"
  :                    "bg-primary-soft text-primary";

const unitMarks = [
  { name: "Unit VI — Reproduction", marks: 16, pct: 80, priority: "high" as const, color: "bg-danger" },
  { name: "Unit VII — Genetics & Evolution", marks: 18, pct: 90, priority: "high" as const, color: "bg-danger" },
  { name: "Unit VIII — Biology & Human Welfare", marks: 14, pct: 70, priority: "med" as const, color: "bg-amber" },
  { name: "Unit IX — Biotechnology & its Applications", marks: 10, pct: 50, priority: "med" as const, color: "bg-amber" },
  { name: "Unit X — Ecology & Environment", marks: 12, pct: 60, priority: "std" as const, color: "bg-primary-mid" },
];

const timeline = [
  { week: "Month 1 — Weeks 1–4", title: "Foundation: High-Weightage Units First", desc: "Cover Reproduction (Ch. 1–4) and Genetics & Evolution (Ch. 5–9). Do all NCERT exercises. Prepare diagram sheets for each chapter.", dot: "bg-danger" },
  { week: "Month 2 — Weeks 5–8", title: "Core Build: Biotechnology & Human Welfare", desc: "Cover Biology in Human Welfare (Ch. 8–10) and Biotechnology (Ch. 11–12). Create summary notes. Solve SQPs from CBSE website.", dot: "bg-amber" },
  { week: "Month 2 — Weeks 9–10", title: "Ecology & Environment", desc: "Cover Ecology unit (Ch. 13–16). Focus on ecosystem energy flow diagrams, biodiversity data, and environmental issues with examples.", dot: "bg-primary-mid" },
  { week: "Month 3 — Weeks 11–12", title: "Full-Length Mock Tests & PYQs", desc: "Solve 2 full-length mocks per week under timed conditions. Analyse weak areas. Revise diagrams, definitions, and one-mark answers daily.", dot: "bg-info" },
  { week: "Final Week", title: "Rapid Revision & Confidence Building", desc: "Only revise your own summary notes and flowcharts. No new topics. Focus on practicals record, viva preparation, and sleep routine.", dot: "bg-primary-glow" },
];

const tips = [
  { title: "Answer Structure", items: ["Start every LA with a definition", "Use point format for 3-mark answers", "Add a labelled diagram wherever applicable", "Conclude 5-mark answers with significance"] },
  { title: "Diagrams Done Right", items: ["Draw with a sharp pencil, not pen", "Label all parts with a ruler line", "Write title below the diagram", "Use at least 1/4 page for major diagrams"] },
  { title: "High-Yield Memorization", items: ["Learn all scientists & their discoveries", "Memorize organisms used in experiments", "Master all full forms (PCR, rDNA, BOD)", "Know numerical values (genome size etc.)"] },
  { title: "Exam Day Protocol", items: ["Read entire paper in first 15 min", "Attempt all MCQs first (no negative marking)", "Skip difficult questions — return later", "Keep 10 min buffer for checking"] },
  { title: "Common Mistakes to Avoid", items: ["Don't confuse mitosis & meiosis stages", "Avoid vague terms — be specific", "Don't skip units thinking they're small", "Never leave blanks — attempt all Qs"] },
  { title: "Practical Exam Prep", items: ["Know all 10 spotting specimens by sight", "Practice slide preparation steps", "Revise experimental observations", "Be ready for viva on any NCERT experiment"] },
];

const heroStats = [
  { num: "16", label: "Chapters" },
  { num: "5", label: "Units" },
  { num: "70", label: "Theory Marks" },
  { num: "3 hr", label: "Exam Duration" },
];

const SectionHeader = ({ icon, title, sub, accent }: { icon: React.ReactNode; title: string; sub: string; accent: string }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>{icon}</div>
    <div>
      <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{sub}</p>
    </div>
  </div>
);

const Index = () => {
  const [filter, setFilter] = useState<"all" | UnitTag>("all");
  const filtered = useMemo(() => filter === "all" ? chapters : chapters.filter(c => c.tag === filter), [filter]);

  return (
    <div className="min-h-screen bg-background">
      {/* Alert Banner */}
      <div className="bg-amber-soft border-b border-amber/30 py-2.5 px-4 text-center text-sm text-amber font-medium">
        📌 <span className="font-bold">CBSE Board Exam 2025–26</span> &nbsp;|&nbsp; Theory: 70 Marks &nbsp;|&nbsp; Practicals: 30 Marks &nbsp;|&nbsp; Duration: 3 hours
      </div>

      {/* Nav */}
      <nav className="bg-primary px-6 md:px-8 h-16 flex items-center justify-between sticky top-0 z-50 shadow-soft">
        <div className="font-display text-xl font-bold text-primary-foreground tracking-tight">
          Bio<span className="text-primary-glow">12</span>
        </div>
        <ul className="hidden md:flex gap-7 list-none">
          {[
            ["Strategy", "strategy"],
            ["Marks", "marks"],
            ["Chapters", "chapters"],
            ["Timeline", "timeline"],
            ["Tips", "tips"],
          ].map(([label, id]) => (
            <li key={id}>
              <a href={`#${id}`} className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium transition-colors">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <span className="bg-primary-glow text-primary text-xs font-bold px-2.5 py-1 rounded-full">CBSE 2026</span>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-hero relative overflow-hidden py-20 px-6 text-center">
        <div className="absolute w-[600px] h-[600px] rounded-full border border-primary-foreground/5 -top-52 -right-52 pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] rounded-full border border-primary-foreground/5 -bottom-36 -left-24 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block bg-primary-foreground/10 text-primary-glow border border-primary-glow/30 text-xs font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-5">
            Class 12 Biology · Board Exam Guide
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight mb-5">
            Ace Your Biology Boards<br />
            <span className="text-primary-glow">with Smart Strategy</span>
          </h1>
          <p className="text-primary-foreground/70 text-base md:text-lg max-w-xl mx-auto mb-10">
            Complete exam guide with chapter notes, marks distribution, study timelines, and proven technical strategies for CBSE Class 12 Biology 2025–26.
          </p>
          <div className="flex justify-center gap-4 md:gap-10 flex-wrap">
            {heroStats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-4 md:gap-10">
                <div className="text-center">
                  <div className="font-display text-3xl md:text-4xl text-primary-glow font-bold leading-none">{s.num}</div>
                  <div className="text-xs text-primary-foreground/60 mt-1.5">{s.label}</div>
                </div>
                {i < heroStats.length - 1 && <div className="hidden md:block w-px h-10 bg-primary-foreground/15" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 2026 Framework Highlights */}
      <section className="py-12 px-6 border-b border-border">
        <div className="container max-w-6xl">
          <SectionHeader icon={<Sparkles className="w-5 h-5 text-primary" />} accent="bg-primary-soft" title="Mastering the 2025–26 Framework" sub="Critical NCERT revisions & the new exam blueprint" />
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-6 shadow-soft">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber mb-2">Examination Typology</div>
              <div className="font-display text-3xl font-bold text-foreground mb-3">50 / 30 / 20</div>
              <p className="text-sm text-muted-foreground">50% Competency-Based (MCQs, case studies) · 30% Application of Concepts · 20% Analysis, Evaluation & Creation.</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-soft">
              <div className="text-xs font-semibold uppercase tracking-wider text-info mb-2">The 70 / 30 Split</div>
              <div className="font-display text-3xl font-bold text-foreground mb-3">70 + 30</div>
              <p className="text-sm text-muted-foreground">70-mark theory paper paired with a 30-mark practical assessment. Both count toward your final grade.</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-soft">
              <div className="text-xs font-semibold uppercase tracking-wider text-danger mb-2">Critical NCERT Updates</div>
              <div className="font-display text-lg font-semibold text-foreground mb-3">Revised Timelines & Terms</div>
              <p className="text-sm text-muted-foreground">Universe age now <strong>13.8 billion years</strong>. <em>"Secondary Oocyte"</em> officially replaces <em>"Ovum"</em> for the stage released from the ovary.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategy */}
      <section id="strategy" className="py-16 px-6">
        <div className="container max-w-6xl">
          <SectionHeader icon={<Brain className="w-5 h-5 text-primary" />} accent="bg-primary-soft" title="Technical Exam Strategies" sub="Evidence-based approaches to maximise your score" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {strategies.map((s) => (
              <div key={s.title} className="bg-card border border-border rounded-xl p-5 shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all">
                <div className="text-2xl mb-3">{s.icon}</div>
                <h3 className="font-sans-body text-base font-semibold mb-2 text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                <span className={`inline-block text-[0.68rem] font-semibold px-2.5 py-0.5 rounded-full mt-3 ${toneClass(s.tone)}`}>{s.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-t border-border" />

      {/* Marks */}
      <section id="marks" className="py-16 px-6">
        <div className="container max-w-6xl">
          <SectionHeader icon={<ChartBar className="w-5 h-5 text-amber" />} accent="bg-amber-soft" title="Marks Distribution by Unit" sub="CBSE 2025–26 official weightage — plan your revision accordingly" />
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-soft">
            <div className="grid grid-cols-[2fr_1fr_2fr_1fr] gap-4 px-5 py-3 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider">
              <span>Unit</span>
              <span>Marks</span>
              <span className="hidden sm:block">Weightage</span>
              <span className="hidden sm:block">Priority</span>
            </div>
            {unitMarks.map((u) => {
              const p = priorityStyles[u.priority];
              return (
                <div key={u.name} className="grid grid-cols-[2fr_1fr_2fr_1fr] gap-4 px-5 py-3.5 border-t border-border items-center hover:bg-primary-soft/50 transition-colors">
                  <span className="text-sm font-medium text-foreground">{u.name}</span>
                  <span className="font-display text-base font-bold text-primary">{u.marks}</span>
                  <div className="hidden sm:block">
                    <div className="h-1.5 rounded-full bg-border overflow-hidden">
                      <div className={`h-full rounded-full ${u.color}`} style={{ width: `${u.pct}%` }} />
                    </div>
                  </div>
                  <span className="hidden sm:block">
                    <span className={`text-[0.68rem] font-semibold px-2.5 py-0.5 rounded-full ${p.bg} ${p.text}`}>{p.label}</span>
                  </span>
                </div>
              );
            })}
            <div className="grid grid-cols-[2fr_1fr_2fr_1fr] gap-4 px-5 py-3.5 border-t border-border items-center bg-primary-soft">
              <span className="text-sm font-bold text-primary">Total Theory</span>
              <span className="font-display text-lg font-bold text-primary">70</span>
              <div className="hidden sm:block" />
              <div className="hidden sm:block" />
            </div>
          </div>
        </div>
      </section>

      <hr className="border-t border-border" />

      {/* Chapters */}
      <section id="chapters" className="py-16 px-6">
        <div className="container max-w-6xl">
          <SectionHeader icon={<BookOpen className="w-5 h-5 text-info" />} accent="bg-info-soft" title="All Chapters — Notes & Strategy" sub='Click "View Notes" to access chapter-specific study material' />

          <div className="flex gap-2 flex-wrap mb-6">
            {filterOptions.map((opt) => {
              const active = filter === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setFilter(opt.value)}
                  className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:bg-primary hover:text-primary-foreground hover:border-primary"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c) => {
              const p = priorityStyles[c.priority];
              return (
                <article key={c.num} className="bg-card border border-border rounded-xl overflow-hidden flex flex-col shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all animate-fade-up">
                  <div className="p-5 flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-display text-sm font-bold ${p.bg} ${p.text}`}>
                      {c.num}
                    </div>
                    <div className="flex-1">
                      <div className={`text-[0.68rem] font-semibold uppercase tracking-wider mb-0.5 ${p.text}`}>{c.unit}</div>
                      <h3 className="text-[0.95rem] font-semibold text-foreground leading-snug">{c.title}</h3>
                    </div>
                  </div>
                  <div className="px-5 pb-4 flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed">💡 {c.tip}</p>
                  </div>
                  <div className="px-5 py-3 border-t border-border flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-soft text-primary">{c.marks}</span>
                      <a
                        href={c.notesUrl}
                        target={c.notesUrl.startsWith("#") ? undefined : "_blank"}
                        rel="noreferrer"
                        className="text-xs font-medium text-info bg-info-soft border border-info-soft hover:bg-info hover:text-primary-foreground px-3 py-1.5 rounded-md inline-flex items-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Notes
                        {c.notesUrl.startsWith("#") && (
                          <span className="text-[0.62rem] bg-foreground/10 px-1.5 py-0.5 rounded">Soon</span>
                        )}
                      </a>
                    </div>
                    {c.extraNotes && c.extraNotes.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {c.extraNotes.map((n) => (
                          <a
                            key={n.url}
                            href={n.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[0.7rem] font-medium text-primary bg-primary-soft hover:bg-primary hover:text-primary-foreground px-2.5 py-1 rounded-md inline-flex items-center gap-1 transition-colors"
                          >
                            <FileText className="w-3 h-3" /> {n.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="border-t border-border" />

      {/* Timeline */}
      <section id="timeline" className="py-16 px-6">
        <div className="container max-w-6xl">
          <SectionHeader icon={<CalendarDays className="w-5 h-5 text-primary" />} accent="bg-primary-soft" title="Recommended Study Timeline" sub="3-month strategic plan for CBSE Board preparation" />
          <div className="relative pl-9">
            <div className="absolute left-2 top-2 bottom-2 w-0.5 rounded bg-gradient-timeline" />
            {timeline.map((t) => (
              <div key={t.title} className="relative mb-6 last:mb-0">
                <div className={`absolute -left-[1.65rem] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-background ring-2 ring-primary ${t.dot}`} />
                <div className="bg-card border border-border rounded-xl p-5 shadow-soft">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary-mid mb-1">{t.week}</div>
                  <div className="text-[0.95rem] font-semibold text-foreground mb-1">{t.title}</div>
                  <div className="text-sm text-muted-foreground">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-t border-border" />

      {/* Tips */}
      <section id="tips" className="py-16 px-6">
        <div className="container max-w-6xl">
          <SectionHeader icon={<Lightbulb className="w-5 h-5 text-danger" />} accent="bg-danger-soft" title="Answer Writing & Exam Day Tips" sub="Examiner-approved techniques to present answers professionally" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tips.map((t) => (
              <div key={t.title} className="bg-card border border-border border-l-4 border-l-primary-glow rounded-xl p-5 shadow-soft">
                <h4 className="text-[0.95rem] font-semibold mb-3 text-foreground">{t.title}</h4>
                <ul className="space-y-1.5">
                  {t.items.map((i) => (
                    <li key={i} className="text-sm text-muted-foreground pl-5 relative">
                      <ArrowRight className="w-3.5 h-3.5 absolute left-0 top-1 text-primary-glow" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground/70 text-center px-6 py-10 mt-8">
        <div className="font-display text-lg text-primary-foreground font-bold mb-1">BIO12 — CBSE Class 12 Biology Exam Guide</div>
        <p className="text-sm">All content based on NCERT syllabus · CBSE official guidelines · Board Exam 2025–26</p>
        <p className="text-xs mt-2 text-primary-foreground/50">Notes links are editable — replace each chapter's <code>notesUrl</code> in <code>src/data/chapters.ts</code> as your notes go live.</p>
      </footer>
    </div>
  );
};

export default Index;
