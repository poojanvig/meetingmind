'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, FileAudio, FileVideo, Upload, Cpu, ClipboardList, Clock, Users, ShieldCheck } from 'lucide-react'

function AnimateIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#0a0a0a] selection:bg-[#0a0a0a] selection:text-white">

      {/* ── Nav ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-[15px] font-semibold tracking-tight">
            MeetingMind
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-[13px] text-[#666] hover:text-[#0a0a0a] transition-colors">
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="text-[13px] font-medium bg-[#0a0a0a] text-white px-4 py-1.5 rounded-md hover:bg-[#333] transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <motion.p
              className="text-[13px] font-medium text-[#666] uppercase tracking-[0.15em] mb-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Meeting intelligence
            </motion.p>
            <motion.h1
              className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.035em] mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Stop taking notes.
              <br />
              <span className="text-[#999]">Start making decisions.</span>
            </motion.h1>
            <motion.p
              className="text-[17px] md:text-[19px] leading-relaxed text-[#555] max-w-xl mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Upload an audio or video recording and MeetingMind extracts every
              task, decision, and follow-up — so your team can act on what
              matters instead of reviewing what was said.
            </motion.p>
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white text-[14px] font-medium px-6 py-2.5 rounded-md hover:bg-[#333] transition-colors"
              >
                Try it now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-[13px] text-[#999]">
                No account required
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Upload Preview ── */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn>
            <div className="border border-[#e5e5e5] rounded-xl overflow-hidden">
              {/* Top bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e5e5e5] bg-[#fafafa]">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#999]" />
                  <span className="text-[13px] font-medium text-[#666]">Upload a recording</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#bbb] uppercase tracking-wider">Supported</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-[#666] bg-white border border-[#e5e5e5] px-2 py-0.5 rounded">MP3</span>
                    <span className="text-[11px] font-medium text-[#666] bg-white border border-[#e5e5e5] px-2 py-0.5 rounded">WAV</span>
                    <span className="text-[11px] font-medium text-[#666] bg-white border border-[#e5e5e5] px-2 py-0.5 rounded">MP4</span>
                    <span className="text-[11px] font-medium text-[#666] bg-white border border-[#e5e5e5] px-2 py-0.5 rounded">WEBM</span>
                    <span className="text-[11px] font-medium text-[#666] bg-white border border-[#e5e5e5] px-2 py-0.5 rounded">M4A</span>
                  </div>
                </div>
              </div>

              {/* Drop zone */}
              <div className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Audio */}
                  <div className="group border border-dashed border-[#d5d5d5] rounded-lg p-8 text-center hover:border-[#0a0a0a] hover:bg-[#fafafa] transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#eee] transition-colors">
                      <FileAudio className="w-5 h-5 text-[#666]" />
                    </div>
                    <p className="text-[14px] font-semibold mb-1">Audio files</p>
                    <p className="text-[13px] text-[#999] leading-relaxed">
                      MP3, WAV, M4A, OGG, FLAC
                    </p>
                    <p className="text-[12px] text-[#ccc] mt-3">
                      Drag & drop or click to browse
                    </p>
                  </div>

                  {/* Video */}
                  <div className="group border border-dashed border-[#d5d5d5] rounded-lg p-8 text-center hover:border-[#0a0a0a] hover:bg-[#fafafa] transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#eee] transition-colors">
                      <FileVideo className="w-5 h-5 text-[#666]" />
                    </div>
                    <p className="text-[14px] font-semibold mb-1">Video files</p>
                    <p className="text-[13px] text-[#999] leading-relaxed">
                      MP4, WEBM, MOV, AVI
                    </p>
                    <p className="text-[12px] text-[#ccc] mt-3">
                      Audio track extracted automatically
                    </p>
                  </div>
                </div>

                <p className="text-[12px] text-[#bbb] text-center mt-6">
                  Files over 24 MB are compressed before processing. All uploads are processed locally.
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-[#e5e5e5]" />
      </div>

      {/* ── How it works ── */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn>
            <p className="text-[13px] font-medium text-[#666] uppercase tracking-[0.15em] mb-4">
              How it works
            </p>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold tracking-[-0.025em] mb-16 max-w-lg">
              Three steps from recording to action items
            </h2>
          </AnimateIn>

          <div className="grid md:grid-cols-3 gap-x-12 gap-y-12">
            {[
              {
                step: "01",
                icon: FileAudio,
                title: "Upload your recording",
                desc: "Drop in any audio or video file from your meeting — we extract the audio track and handle the rest. Files over 24 MB are compressed automatically.",
              },
              {
                step: "02",
                icon: Cpu,
                title: "AI processes the audio",
                desc: "Your recording is transcribed, then analyzed to identify tasks, decisions, risks, attendees, and key insights.",
              },
              {
                step: "03",
                icon: ClipboardList,
                title: "Review and export",
                desc: "Browse a structured breakdown of everything discussed. Export to DOCX and share with your team in one click.",
              },
            ].map((item, i) => (
              <AnimateIn key={item.step} delay={i * 0.1}>
                <div className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[12px] font-semibold text-[#999] tabular-nums">
                      {item.step}
                    </span>
                    <div className="h-px flex-1 bg-[#e5e5e5] group-hover:bg-[#ccc] transition-colors" />
                  </div>
                  <item.icon className="w-5 h-5 text-[#0a0a0a] mb-4" strokeWidth={1.5} />
                  <h3 className="text-[16px] font-semibold mb-2 tracking-[-0.01em]">
                    {item.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-[#666]">
                    {item.desc}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-[#e5e5e5]" />
      </div>

      {/* ── What you get ── */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn>
            <p className="text-[13px] font-medium text-[#666] uppercase tracking-[0.15em] mb-4">
              What you get
            </p>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold tracking-[-0.025em] mb-16 max-w-lg">
              Everything extracted, nothing missed
            </h2>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
            {[
              { title: "Tasks & owners", desc: "Every action item with who owns it and when it's due." },
              { title: "Key decisions", desc: "Decisions made during the meeting, surfaced clearly." },
              { title: "Follow-ups", desc: "What needs to happen next and who's responsible." },
              { title: "Risks flagged", desc: "Potential blockers and concerns raised in discussion." },
              { title: "Full transcript", desc: "Searchable, scrollable transcript of the entire recording." },
              { title: "DOCX export", desc: "One-click export of the full breakdown for sharing." },
            ].map((item, i) => (
              <AnimateIn key={item.title} delay={i * 0.05}>
                <div>
                  <h3 className="text-[15px] font-semibold mb-1.5 tracking-[-0.01em]">
                    {item.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-[#666]">
                    {item.desc}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-[#e5e5e5]" />
      </div>

      {/* ── Stats / Trust ── */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-12">
            {[
              { icon: Clock, stat: "Hours saved", detail: "Skip the 30-min recap. Get the summary in seconds." },
              { icon: Users, stat: "Team aligned", detail: "Everyone sees the same tasks, owners, and deadlines." },
              { icon: ShieldCheck, stat: "Nothing lost", detail: "AI catches details humans miss during live discussion." },
            ].map((item, i) => (
              <AnimateIn key={item.stat} delay={i * 0.1}>
                <div>
                  <item.icon className="w-5 h-5 text-[#0a0a0a] mb-4" strokeWidth={1.5} />
                  <p className="text-[16px] font-semibold mb-1.5 tracking-[-0.01em]">
                    {item.stat}
                  </p>
                  <p className="text-[14px] leading-relaxed text-[#666]">
                    {item.detail}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <AnimateIn>
            <div className="max-w-xl">
              <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold tracking-[-0.025em] mb-4">
                Your next meeting is already scheduled.
                <br />
                <span className="text-[#999]">Make it count.</span>
              </h2>
              <p className="text-[15px] text-[#666] mb-8">
                Upload your first recording and see the full breakdown in minutes.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white text-[14px] font-medium px-6 py-2.5 rounded-md hover:bg-[#333] transition-colors"
              >
                Get started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[13px] font-medium tracking-tight">MeetingMind</span>
          <p className="text-[12px] text-[#999]">&copy; {new Date().getFullYear()} MeetingMind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
