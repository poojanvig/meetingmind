'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight,
  Mic,
  Brain,
  FileDown,
  CheckSquare,
  Gavel,
  ListChecks,
  AlertTriangle,
  ScrollText,
  FileText,
  Clock,
  Users,
  ShieldCheck,
  Sparkles,
  Play,
} from 'lucide-react'

function AnimateIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0b1a] text-white selection:bg-violet-500/40 selection:text-white overflow-x-hidden">

      {/* ── Nav ── */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl px-5 py-3">
            <Link href="/" className="text-[15px] font-bold tracking-tight text-white">
              MeetingMind
            </Link>
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[13px] font-semibold text-[#0b0b1a] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:scale-[1.02]"
            >
              Get started
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[150px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[130px] animate-pulse [animation-delay:1s]" />
          <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] rounded-full bg-fuchsia-600/10 blur-[120px] animate-pulse [animation-delay:2s]" />
        </div>
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 text-center pt-32 pb-20 md:pt-40 md:pb-32">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-[13px] font-medium text-violet-300 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Meeting Intelligence
          </motion.div>

          <motion.h1
            className="text-[clamp(2.8rem,7vw,5rem)] font-extrabold leading-[1.05] tracking-[-0.04em] mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Stop taking notes.
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              Start making decisions.
            </span>
          </motion.h1>

          <motion.p
            className="text-[17px] md:text-[19px] leading-relaxed text-white/50 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Upload any meeting recording and MeetingMind extracts every task,
            decision, and follow-up — so your team acts on what matters.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/dashboard"
              className="group flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-3 text-[15px] font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] hover:-translate-y-0.5"
            >
              Try it free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#how-it-works"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-[15px] font-medium text-white/70 transition-all hover:bg-white/[0.08] hover:text-white"
            >
              <Play className="w-4 h-4" />
              See how it works
            </Link>
          </motion.div>

          {/* Floating trust badges */}
          <motion.div
            className="flex items-center justify-center gap-6 mt-16 text-[13px] text-white/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> No account needed</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Results in seconds</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Built for teams</span>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0b0b1a] to-transparent" />
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="relative py-28 md:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn className="text-center mb-20">
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-violet-400 mb-4">
              How it works
            </p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.03em]">
              Recording to action items
              <br />
              <span className="text-white/40">in three simple steps</span>
            </h2>
          </AnimateIn>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: Mic,
                title: "Upload recording",
                desc: "Drop in any audio or video file. We extract the audio and handle compression automatically.",
                gradient: "from-blue-500 to-cyan-400",
                glow: "bg-blue-500/20",
              },
              {
                step: "02",
                icon: Brain,
                title: "AI analyzes everything",
                desc: "Transcription, speaker identification, and deep analysis — tasks, decisions, risks, and more.",
                gradient: "from-violet-500 to-fuchsia-400",
                glow: "bg-violet-500/20",
              },
              {
                step: "03",
                icon: FileDown,
                title: "Review & export",
                desc: "Browse structured insights in your dashboard. Export the full breakdown as DOCX in one click.",
                gradient: "from-fuchsia-500 to-rose-400",
                glow: "bg-fuchsia-500/20",
              },
            ].map((item, i) => (
              <AnimateIn key={item.step} delay={i * 0.1}>
                <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]">
                  {/* Hover glow */}
                  <div className={`absolute inset-0 rounded-2xl ${item.glow} opacity-0 blur-3xl transition-opacity group-hover:opacity-100`} />

                  <div className="relative">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                      <item.icon className="w-6 h-6 text-white" strokeWidth={1.8} />
                    </div>
                    <p className={`text-[12px] font-bold uppercase tracking-widest bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent mb-3`}>
                      Step {item.step}
                    </p>
                    <h3 className="text-[18px] font-bold mb-2 tracking-[-0.01em]">
                      {item.title}
                    </h3>
                    <p className="text-[14px] leading-relaxed text-white/40">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features bento grid ── */}
      <section className="relative py-28 md:py-36">
        {/* Subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative">
          <AnimateIn className="text-center mb-20">
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-fuchsia-400 mb-4">
              Features
            </p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.03em]">
              Everything your meeting produced,
              <br />
              <span className="text-white/40">nothing you missed</span>
            </h2>
          </AnimateIn>

          {/* Bento grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: CheckSquare, title: "Tasks & owners", desc: "Every action item with who owns it and when it's due.", color: "text-blue-400", borderColor: "hover:border-blue-500/30", size: "md:col-span-1" },
              { icon: Gavel, title: "Key decisions", desc: "Decisions made during the meeting, surfaced clearly.", color: "text-emerald-400", borderColor: "hover:border-emerald-500/30", size: "md:col-span-1" },
              { icon: ListChecks, title: "Follow-ups", desc: "What needs to happen next and who's responsible.", color: "text-violet-400", borderColor: "hover:border-violet-500/30", size: "md:col-span-1" },
              { icon: AlertTriangle, title: "Risks flagged", desc: "Potential blockers and concerns raised in discussion.", color: "text-rose-400", borderColor: "hover:border-rose-500/30", size: "md:col-span-1" },
              { icon: ScrollText, title: "Full transcript", desc: "Searchable, scrollable transcript of the entire recording.", color: "text-amber-400", borderColor: "hover:border-amber-500/30", size: "md:col-span-1" },
              { icon: FileText, title: "DOCX export", desc: "One-click export of the full breakdown for sharing.", color: "text-fuchsia-400", borderColor: "hover:border-fuchsia-500/30", size: "md:col-span-1" },
            ].map((item, i) => (
              <AnimateIn key={item.title} delay={i * 0.05} className={item.size}>
                <div className={`group h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all ${item.borderColor} hover:bg-white/[0.04]`}>
                  <item.icon className={`w-5 h-5 ${item.color} mb-4`} strokeWidth={1.8} />
                  <h3 className="text-[15px] font-bold mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-white/35">
                    {item.desc}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative py-28 md:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn>
            <div className="rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-10 md:p-16">
              <div className="grid sm:grid-cols-3 gap-10 md:gap-16">
                {[
                  { icon: Clock, stat: "10x faster", detail: "Skip the 30-min recap. Get the full summary in seconds.", gradient: "from-blue-400 to-cyan-400" },
                  { icon: Users, stat: "100% aligned", detail: "Everyone sees the same tasks, owners, and deadlines.", gradient: "from-violet-400 to-fuchsia-400" },
                  { icon: ShieldCheck, stat: "Zero missed", detail: "AI catches details humans miss during live discussion.", gradient: "from-fuchsia-400 to-rose-400" },
                ].map((item, i) => (
                  <div key={item.stat} className="text-center md:text-left">
                    <div className={`inline-flex w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} items-center justify-center mb-5 shadow-lg`}>
                      <item.icon className="w-5 h-5 text-white" strokeWidth={1.8} />
                    </div>
                    <p className={`text-[28px] md:text-[32px] font-extrabold tracking-tight bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent mb-2`}>
                      {item.stat}
                    </p>
                    <p className="text-[14px] leading-relaxed text-white/40">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <AnimateIn>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-[-0.03em] mb-5">
              Your next meeting is
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                already scheduled.
              </span>
            </h2>
            <p className="text-[17px] text-white/40 mb-10 max-w-lg mx-auto">
              Upload your first recording and see the full breakdown in minutes. No signup required.
            </p>
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_80px_rgba(139,92,246,0.5)] hover:-translate-y-0.5"
            >
              Get started for free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[13px] font-bold tracking-tight text-white/60">MeetingMind</span>
          <p className="text-[12px] text-white/25">&copy; {new Date().getFullYear()} MeetingMind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
