"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CheckCircle,
  Flag,
  AlertCircle,
  Lightbulb,
  Calendar,
  Users,
  List,
  AlertTriangle,
  FileText,
  Download,
  MessageSquare,
} from "lucide-react"
import CategoryCard from "@/components/CategoryCard"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

interface MeetingDetailsProps {
  data: {
    id: string
    name: string
    description: string
    transcript: string
    summary: string
    breakdown: {
      Tasks: { task: string; owner: string; due_date: string }[]
      Decisions: { decision: string; details: string }[]
      Questions: { question: string; status: string; answer?: string }[]
      Insights: { insight: string; reference: string }[]
      Deadlines: { deadline: string; related_to: string }[]
      Attendees: { name: string; role: string }[]
      "Follow-ups": { follow_up: string; owner: string; due_date: string }[]
      Risks: { risk: string; impact: string }[]
    }
  }
}

const categoryColorSchemes: Record<string, { bg: string; border: string; header: string; badge: string; badgeText: string; itemBg: string; itemBorder: string; accent: string }> = {
  Tasks: {
    bg: "bg-white",
    border: "border-blue-200/60",
    header: "from-blue-50 to-indigo-50",
    badge: "bg-blue-50 border-blue-200",
    badgeText: "text-blue-600",
    itemBg: "bg-blue-50/40",
    itemBorder: "border-blue-100/50",
    accent: "text-blue-700",
  },
  Decisions: {
    bg: "bg-white",
    border: "border-emerald-200/60",
    header: "from-emerald-50 to-teal-50",
    badge: "bg-emerald-50 border-emerald-200",
    badgeText: "text-emerald-600",
    itemBg: "bg-emerald-50/40",
    itemBorder: "border-emerald-100/50",
    accent: "text-emerald-700",
  },
  Questions: {
    bg: "bg-white",
    border: "border-amber-200/60",
    header: "from-amber-50 to-orange-50",
    badge: "bg-amber-50 border-amber-200",
    badgeText: "text-amber-600",
    itemBg: "bg-amber-50/40",
    itemBorder: "border-amber-100/50",
    accent: "text-amber-700",
  },
  Insights: {
    bg: "bg-white",
    border: "border-violet-200/60",
    header: "from-violet-50 to-purple-50",
    badge: "bg-violet-50 border-violet-200",
    badgeText: "text-violet-600",
    itemBg: "bg-violet-50/40",
    itemBorder: "border-violet-100/50",
    accent: "text-violet-700",
  },
  Deadlines: {
    bg: "bg-white",
    border: "border-rose-200/60",
    header: "from-rose-50 to-pink-50",
    badge: "bg-rose-50 border-rose-200",
    badgeText: "text-rose-600",
    itemBg: "bg-rose-50/40",
    itemBorder: "border-rose-100/50",
    accent: "text-rose-700",
  },
  Attendees: {
    bg: "bg-white",
    border: "border-cyan-200/60",
    header: "from-cyan-50 to-sky-50",
    badge: "bg-cyan-50 border-cyan-200",
    badgeText: "text-cyan-600",
    itemBg: "bg-cyan-50/40",
    itemBorder: "border-cyan-100/50",
    accent: "text-cyan-700",
  },
  "Follow-ups": {
    bg: "bg-white",
    border: "border-indigo-200/60",
    header: "from-indigo-50 to-blue-50",
    badge: "bg-indigo-50 border-indigo-200",
    badgeText: "text-indigo-600",
    itemBg: "bg-indigo-50/40",
    itemBorder: "border-indigo-100/50",
    accent: "text-indigo-700",
  },
  Risks: {
    bg: "bg-white",
    border: "border-red-200/60",
    header: "from-red-50 to-orange-50",
    badge: "bg-red-50 border-red-200",
    badgeText: "text-red-600",
    itemBg: "bg-red-50/40",
    itemBorder: "border-red-100/50",
    accent: "text-red-700",
  },
}

export default function MeetingDetails({ data }: MeetingDetailsProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"summary" | "details">("summary")

  const categories = [
    { title: "Tasks", icon: CheckCircle, items: data.breakdown.Tasks || [], gridSpan: "col-span-2" },
    { title: "Decisions", icon: Flag, items: data.breakdown.Decisions || [], gridSpan: "col-span-2" },
    { title: "Questions", icon: AlertCircle, items: data.breakdown.Questions || [], gridSpan: "col-span-2" },
    { title: "Insights", icon: Lightbulb, items: data.breakdown.Insights || [], gridSpan: "col-span-2" },
    { title: "Deadlines", icon: Calendar, items: data.breakdown.Deadlines || [], gridSpan: "col-span-1" },
    { title: "Attendees", icon: Users, items: data.breakdown.Attendees || [], gridSpan: "col-span-1" },
    { title: "Follow-ups", icon: List, items: data.breakdown["Follow-ups"] || [], gridSpan: "col-span-2" },
    { title: "Risks", icon: AlertTriangle, items: data.breakdown.Risks || [], gridSpan: "col-span-2" },
  ]

  const handleExport = async () => {
    try {
      const response = await axios.get(`/api/meetings/${data.id}/export`, {
        responseType: 'blob',
      })
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${data.name.replace(/\s+/g, '_')}_Details.docx`)
        document.body.appendChild(link)
        link.click()
        link.parentNode?.removeChild(link)
        toast({ title: "Success", description: "Meeting details exported successfully!" })
      }
    } catch (error: any) {
      console.error(error)
      toast({ title: "Error", description: "Failed to export meeting details.", variant: "destructive" })
    }
  }

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0)

  const statColors = [
    { bg: "from-blue-50 to-indigo-50", border: "border-blue-200/60", text: "text-blue-600", label: "text-blue-400" },
    { bg: "from-emerald-50 to-teal-50", border: "border-emerald-200/60", text: "text-emerald-600", label: "text-emerald-400" },
    { bg: "from-cyan-50 to-sky-50", border: "border-cyan-200/60", text: "text-cyan-600", label: "text-cyan-400" },
    { bg: "from-rose-50 to-pink-50", border: "border-rose-200/60", text: "text-rose-600", label: "text-rose-400" },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.025em] mb-1 text-[#1a1637]">
            {data.name}
          </h1>
          <p className="text-[14px] text-[#6b6b8a]">{data.description}</p>
        </div>
        {!data.id.startsWith('demo-') && (
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 text-[13px] font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-full hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex-shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Export DOCX
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-indigo-100/60 mb-8">
        <button
          onClick={() => setActiveTab("summary")}
          className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors -mb-px ${
            activeTab === "summary"
              ? "border-indigo-500 text-indigo-600"
              : "border-transparent text-[#8a8aa8] hover:text-indigo-500"
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors -mb-px ${
            activeTab === "details"
              ? "border-indigo-500 text-indigo-600"
              : "border-transparent text-[#8a8aa8] hover:text-indigo-500"
          }`}
        >
          Details
          <span className="ml-1.5 text-[11px] text-indigo-500 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-full">
            {totalItems}
          </span>
        </button>
      </div>

      {/* Summary Tab */}
      {activeTab === "summary" && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="border border-indigo-100/80 rounded-2xl overflow-hidden bg-white/80 shadow-sm">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-indigo-50 bg-gradient-to-r from-indigo-50/80 to-violet-50/80">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[13px] font-medium text-indigo-700">Summary</span>
            </div>
            <div className="px-5 py-4">
              <p className="text-[14px] leading-relaxed text-[#4a4a6a]">{data.summary}</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Tasks", count: data.breakdown.Tasks?.length || 0 },
              { label: "Decisions", count: data.breakdown.Decisions?.length || 0 },
              { label: "Attendees", count: data.breakdown.Attendees?.length || 0 },
              { label: "Risks", count: data.breakdown.Risks?.length || 0 },
            ].map((stat, i) => (
              <div key={stat.label} className={`border ${statColors[i].border} rounded-2xl px-4 py-3 bg-gradient-to-br ${statColors[i].bg}`}>
                <p className={`text-[22px] font-bold tracking-tight ${statColors[i].text}`}>{stat.count}</p>
                <p className={`text-[12px] ${statColors[i].label}`}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Transcript */}
          <div className="border border-indigo-100/80 rounded-2xl overflow-hidden bg-white/80 shadow-sm">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-indigo-50 bg-gradient-to-r from-violet-50/80 to-purple-50/80">
              <MessageSquare className="w-3.5 h-3.5 text-violet-500" />
              <span className="text-[13px] font-medium text-violet-700">Transcript</span>
            </div>
            <div className="px-5 py-4">
              <ScrollArea className="h-[300px]">
                <p className="text-[13px] leading-[1.8] text-[#5a5a7a] whitespace-pre-wrap font-mono">
                  {data.transcript}
                </p>
              </ScrollArea>
            </div>
          </div>
        </div>
      )}

      {/* Details Tab */}
      {activeTab === "details" && (
        <div className="grid grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              className={category.gridSpan}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <CategoryCard
                title={category.title}
                items={category.items}
                gridSpan={category.gridSpan}
                colorScheme={categoryColorSchemes[category.title]}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
