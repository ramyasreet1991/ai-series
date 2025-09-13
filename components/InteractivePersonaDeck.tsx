import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Copy, Play, Filter, Sparkles, CheckCircle2 } from "lucide-react";

// --- Personas data (same as in canvas-friendly version) ---
const personas = [
  {
    id: "pm",
    title: "Project Manager",
    color: "bg-indigo-50",
    summary:"Plan timelines, surface risks, and communicate status faster with an AI co‑pilot that drafts, formats, and iterates with you.",
    useCases: [
      {
        title: "Timeline & WBS Generator",
        value: "Planning",
        steps: [
          "Paste scope, team size, deadlines.",
          "Ask for phases, tasks, owners, and dependencies.",
          "Iterate: add buffers, change durations, export table."
        ],
        prompt:"Act as an experienced project manager. Create a 12‑week timeline for building a mobile app. Include phases, key milestones, dependencies, RACI owners, and a risk column with mitigations. Output as a table.",
        kpis: ["20–30% faster planning", "Fewer missed dependencies", "Clear stakeholder visibility"],
      },
      {
        title: "Risk Register & What‑Ifs",
        value: "Risk",
        steps: [
          "Describe context and constraints.",
          "Ask for top risks ranked by impact × likelihood.",
          "Request what‑if scenarios and playbooks."
        ],
        prompt:"You are a delivery risk analyst. Given a 5‑person team, fixed deadline, and vendor dependency, list top 8 risks with impact/likelihood scores, early signals, and concrete mitigations.",
        kpis: ["Earlier issue detection", "Crisper escalation notes"],
      },
      {
        title: "Status Memos & Exec Updates",
        value: "Comms",
        steps: [
          "Give bullet notes of progress/blockers.",
          "Ask for concise update for execs vs. team.",
          "Refine tone; add next‑week priorities."
        ],
        prompt:"Summarize this week’s progress, blockers, and decisions for an executive audience (<=120 words). Add 3 priorities for next week and 1 clear ask.",
        kpis: ["5–10× drafting speed", "Consistent format"],
      },
    ],
  },
  {
    id: "creator",
    title: "Content Creator",
    color: "bg-rose-50",
    summary:"Brainstorm endlessly, draft scripts/captions, repurpose across platforms, and stay on‑brand with iterative prompts.",
    useCases: [
      {
        title: "Idea ↔ Script Factory",
        value: "Ideation",
        steps: ["Describe niche & audience.", "Ask for 10 hooks + outlines.", "Select 1 → expand to script."],
        prompt:"Act as a YouTube strategist. Give 10 video ideas for budget travel in Europe with viral hooks, then outline the top 2 into 5‑minute scripts (intro, 3 key points, CTA).",
        kpis: ["Never start from zero", "Stronger hooks"],
      },
      {
        title: "Cross‑Platform Repurposing",
        value: "Repurpose",
        steps: ["Paste transcript.", "Ask for Shorts, IG captions, LinkedIn post.", "Include tone & hashtag rules."],
        prompt:"From this 6‑minute script, create: (a) 3 Shorts (≤60s) with on‑screen text, (b) 2 IG captions (≤150 words) with 5 relevant hashtags, (c) 1 LinkedIn summary (≤120 words, professional).",
        kpis: ["3–5 posts per long‑form", "Consistent branding"],
      },
      {
        title: "Edit & Voice Match",
        value: "Editing",
        steps: ["Paste draft.", "Define tone (fun, expert, witty).","Ask for punch‑up + keep key facts."],
        prompt:"Rewrite this blog draft in a conversational expert tone at grade‑8 readability. Keep facts; shorten sentences; add a compelling intro and skimmable sub‑heads.",
        kpis: ["Readable posts", "Fewer edits"],
      },
    ],
  },
  {
    id: "fin",
    title: "Financial Analyst",
    color: "bg-emerald-50",
    summary:"Turn raw numbers into narratives: summarize filings, draft insights, generate code/formulas, and stress‑test scenarios.",
    useCases: [
      {
        title: "Earnings & 10‑K Summaries",
        value: "Summarize",
        steps: ["Paste highlights.", "Ask for bullets by KPI.", "Request risks & outlook."],
        prompt:"Act as an equity analyst. Summarize Company X’s Q1 release into bullets: revenue, margin, guidance, surprises, and mgmt tone. Add 3 watchouts for next quarter.",
        kpis: ["Faster briefs", "Shareable bullets"],
      },
      {
        title: "Scenario & Sensitivity Talk‑Through",
        value: "Scenario",
        steps: ["Provide assumptions.", "Ask for qualitative impact.", "Request mitigation levers."],
        prompt:"Given Rev=$20M, COGS=60%, fixed=$5M, model profit at −10% / base / +10% revenue. Explain drivers, risks, and quick levers to protect margin.",
        kpis: ["Clear narratives", "Decision speed"],
      },
      {
        title: "Code Snippets (Excel/Python)",
        value: "Automation",
        steps: ["Describe task.", "Ask for formula/snippet.", "Test on sample data."],
        prompt:"Write a pandas snippet to compute monthly returns from daily prices and plot a cumulative curve. Include comments.",
        kpis: ["Ops time ↓", "Repeatable analysis"],
      },
    ],
  },
  {
    id: "ea",
    title: "Executive Assistant",
    color: "bg-amber-50",
    summary:"Draft crisp comms, build agendas, coordinate time zones, and spin up reusable templates in seconds.",
    useCases: [
      {
        title: "Email & Memo Drafter",
        value: "Comms",
        steps: ["Share key points & audience.", "Specify tone.", "Ask for concise draft."],
        prompt:"Draft a friendly‑professional memo announcing our weekly update moves to Tue 10:00. Include RSVP ask and short agenda.",
        kpis: ["5–10× faster", "Tone consistency"],
      },
      {
        title: "Agenda → Minutes",
        value: "Meetings",
        steps: ["Ask for timed agenda.", "After meeting: paste notes.", "Request decisions & actions table."],
        prompt:"Create a 60‑min planning agenda (with timings). Afterward, convert raw notes to minutes: decisions, owners, due dates.",
        kpis: ["Cleaner follow‑ups", "Accountability"],
      },
      {
        title: "Travel & Itineraries",
        value: "Logistics",
        steps: ["Provide constraints & prefs.", "Request two options.", "Refine for details."],
        prompt:"Plan a 3‑day London trip for an exec with 2 days meetings and 1 day leisure. Offer 2 itinerary options with transfers and buffers.",
        kpis: ["Fewer back‑and‑forths", "Personalized plans"],
      },
    ],
  },
  {
    id: "job",
    title: "Job Seeker / Career Switcher",
    color: "bg-sky-50",
    summary:"Tailor resumes, craft cover letters, rehearse interviews, and map learning plans—authentic, accurate, and ATS‑friendly.",
    useCases: [
      {
        title: "Resume Tailoring (ATS)",
        value: "Resume",
        steps: ["Paste JD + bullets.", "Ask to align keywords.", "Verify facts; keep voice."],
        prompt:"You are a career coach. Rewrite these bullets to emphasize quantified outcomes and match this job description’s keywords—without inventing facts.",
        kpis: ["Higher callbacks", "Clear impact"],
      },
      {
        title: "Cover Letter Builder",
        value: "Cover",
        steps: ["Share role/company & ‘why me’.","Ask for 3 intros + 1 full draft.","Personalize & shorten."],
        prompt:"Write 3 compelling cover‑letter openings tailored to ACME’s mission, then produce a 1‑page draft I can personalize.",
        kpis: ["Faster iterations", "Personal fit"],
      },
      {
        title: "Interview Coach",
        value: "Interview",
        steps: ["Ask for Qs by role.", "Practice STAR answers.", "Request critique & stronger phrasing."],
        prompt:"Act as an interview coach. Ask me 5 PM questions one‑by‑one. After each of my answers, critique with STAR, missed metrics, and a sharper closing.",
        kpis: ["Confident delivery", "Tighter stories"],
      },
    ],
  },
  {
    id: "student",
    title: "Student / Educator",
    color: "bg-fuchsia-50",
    summary: "Structured study aids, lesson plans, quizzes, and step‑wise explanations.",
    useCases: [
      { title: "Study Plan & Tutor", value: "Learn", steps: ["Paste syllabus.", "Request schedule & checkpoints."], prompt: "Create a 4‑week study plan with weekly goals, daily tasks, and 2 practice quizzes/week." },
      { title: "Worksheet/Quiz Maker", value: "Assess", steps: ["Specify topic & difficulty.", "Ask for answer key."], prompt: "Generate 15 MCQs on fractions (mix difficulty) with answer key and 1‑sentence explanations." },
    ],
  },
  {
    id: "dev",
    title: "Software Developer",
    color: "bg-slate-50",
    summary: "Boilerplate generation, debugging, tests, and docs on tap.",
    useCases: [
      { title: "Debug & Fix", value: "Debug", steps: ["Paste error & snippet.", "Ask for root cause + patch."], prompt: "Find the root cause of this stack trace and propose a minimal fix with test." },
      { title: "API + Tests", value: "Build", steps: ["Describe endpoint.", "Request controller, unit tests, and README."], prompt: "Generate a FastAPI endpoint for /orders with pydantic model, plus pytest tests and README usage." },
    ],
  },
  {
    id: "mkt",
    title: "Marketer / Business Owner",
    color: "bg-green-50",
    summary: "Ads, blogs, SEO, customer replies, and SWOT/competitor briefs—faster.",
    useCases: [
      { title: "Ad Variations", value: "Ads", steps: ["Give product & audience.", "Ask 5 variants + USP + CTA."], prompt: "Create 5 Facebook ad variants for a D2C skincare brand targeting 25–34, each with a distinct angle and CTA." },
      { title: "Competitor Snapshot", value: "Research", steps: ["Name 3 rivals.", "Ask for positioning & gaps."], prompt: "Summarize 3 competitors: positioning, pricing tier, key features, and 2 opportunities to differentiate." },
    ],
  },
  {
    id: "health",
    title: "Healthcare / Enterprise",
    color: "bg-cyan-50",
    summary: "Summaries, triage scripts, SOPs, and RAG‑ready drafts (always with governance).",
    useCases: [
      { title: "Clinical Summary (Non‑PHI)", value: "Med", steps: ["Use synthetic data.", "Ask for patient‑friendly summary."], prompt: "Rewrite this radiology report in plain language for a patient, preserving caveats and next‑step guidance." },
      { title: "Policy → SOP", value: "Ops", steps: ["Paste policy text.", "Ask to extract steps & checklists."], prompt: "Convert this policy into an SOP with roles, triggers, steps, and exception handling." },
    ],
  },
];

const Slide = ({ children }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.25 }}
    className="w-full"
  >
    {children}
  </motion.div>
);

function copy(text: string){
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text);
  }
}

export default function InteractivePersonaDeck(){
  const [active, setActive] = useState(personas[0].id);
  const [search, setSearch] = useState("");
  const current = useMemo(() => personas.find(p => p.id === active)!, [active]);
  const filteredUseCases = useMemo(() => {
    if (!search) return current.useCases;
    return current.useCases.filter((u: any) =>
      [u.title, u.value, u.prompt, ...(u.kpis||[])].join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [current, search]);

  const idx = personas.findIndex(p => p.id === active);
  const prev = personas[(idx - 1 + personas.length) % personas.length].id;
  const next = personas[(idx + 1) % personas.length].id;

  // Read ?persona= query to set initial tab
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const persona = url.searchParams.get("persona");
      if (persona && personas.some(p => p.id === persona)) setActive(persona);
    }
  }, []);

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-white">
      <header className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6" /> ChatGPT Daily Use Cases — Interactive Deck
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Explore persona‑based workflows. Click a persona, scan use cases, and copy ready‑to‑use prompts. Iterate like a co‑pilot: context → task framing → refinement.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-80">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search current persona (timeline, ads, interview)"
            value={search}
            onChange={(e:any) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <Tabs value={active} onValueChange={setActive} className="w-full">
        <TabsList className="flex flex-wrap gap-2 max-w-full">
          {personas.map((p) => (
            <TabsTrigger key={p.id} value={p.id} className="font-medium data-[state=active]:font-semibold">
              {p.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          {personas.map((p) => (
            <TabsContent key={p.id} value={p.id}>
              <AnimatePresence mode="wait">
                <Slide>
                  <Card className={`${p.color} border-slate-200`}>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <CardTitle className="text-xl md:text-2xl">{p.title}</CardTitle>
                          <CardDescription className="mt-1 max-w-3xl text-base">{p.summary}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="secondary" onClick={() => setActive(prev)}>
                            <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                          </Button>
                          <Button variant="secondary" onClick={() => setActive(next)}>
                            Next <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredUseCases.map((u: any, i: number) => (
                          <Card key={i} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Badge variant="outline">{u.value}</Badge>
                                {u.title}
                              </CardTitle>
                              <CardDescription>Steps to apply</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <ol className="list-decimal list-inside space-y-1 text-sm">
                                {u.steps.map((s: string, j: number) => (<li key={j}>{s}</li>))}
                              </ol>
                              {u.kpis && (
                                <div className="flex flex-wrap gap-2">
                                  {u.kpis.map((k: string, j: number) => (
                                    <Badge key={j} variant="secondary" className="flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3" /> {k}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              <div className="rounded-xl border p-3 bg-slate-50">
                                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Copy‑Ready Prompt</div>
                                <Textarea readOnly value={u.prompt} className="min-h-[110px] text-sm" />
                                <div className="mt-2 flex items-center justify-between">
                                  <Button size="sm" variant="outline" onClick={() => copy(u.prompt)}>
                                    <Copy className="h-4 w-4 mr-1" /> Copy prompt
                                  </Button>
                                  <Button size="sm">
                                    <Play className="h-4 w-4 mr-1" /> Try now (paste into ChatGPT)
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <div className="mt-6">
                        <Card className="border-dashed">
                          <CardHeader>
                            <CardTitle>Co‑pilot Tips for {p.title}</CardTitle>
                            <CardDescription>
                              Context → Task framing → Refinement. Keep sensitive data out of public models; verify facts; personalize tone.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <h4 className="font-medium mb-2">1) Context</h4>
                              <p>Provide constraints, audience, goals, examples. The more specific, the better.</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">2) Task Framing</h4>
                              <p>Assign a role ("Act as…"), define output format (table, bullets), tone, and limits.</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">3) Refinement</h4>
                              <p>Iterate: “shorten”, “more persuasive”, “add risks”, “simplify”. Treat it like a junior partner.</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </Slide>
              </AnimatePresence>
            </TabsContent>
          ))}
        </div>
      </Tabs>

      <footer className="mt-8 text-xs text-muted-foreground">
        Pro tip: Save your best prompts as snippets. Build a small library per persona and reuse with minor tweaks for speed and consistency.
      </footer>
    </div>
  );
}
