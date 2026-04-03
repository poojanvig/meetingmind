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

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.025em] mb-1">
            {data.name}
          </h1>
          <p className="text-[14px] text-[#666]">{data.description}</p>
        </div>
        {!data.id.startsWith('demo-') && (
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 text-[13px] font-medium bg-[#0a0a0a] text-white px-4 py-2 rounded-md hover:bg-[#333] transition-colors flex-shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Export DOCX
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#e5e5e5] mb-8">
        <button
          onClick={() => setActiveTab("summary")}
          className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors -mb-px ${
            activeTab === "summary"
              ? "border-[#0a0a0a] text-[#0a0a0a]"
              : "border-transparent text-[#999] hover:text-[#666]"
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors -mb-px ${
            activeTab === "details"
              ? "border-[#0a0a0a] text-[#0a0a0a]"
              : "border-transparent text-[#999] hover:text-[#666]"
          }`}
        >
          Details
          <span className="ml-1.5 text-[11px] text-[#999] bg-[#f5f5f5] px-1.5 py-0.5 rounded">
            {totalItems}
          </span>
        </button>
      </div>

      {/* Summary Tab */}
      {activeTab === "summary" && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="border border-[#e5e5e5] rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[#e5e5e5] bg-[#fafafa]">
              <FileText className="w-3.5 h-3.5 text-[#999]" />
              <span className="text-[13px] font-medium">Summary</span>
            </div>
            <div className="px-5 py-4">
              <p className="text-[14px] leading-relaxed text-[#444]">{data.summary}</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Tasks", count: data.breakdown.Tasks?.length || 0 },
              { label: "Decisions", count: data.breakdown.Decisions?.length || 0 },
              { label: "Attendees", count: data.breakdown.Attendees?.length || 0 },
              { label: "Risks", count: data.breakdown.Risks?.length || 0 },
            ].map((stat) => (
              <div key={stat.label} className="border border-[#e5e5e5] rounded-lg px-4 py-3">
                <p className="text-[22px] font-bold tracking-tight">{stat.count}</p>
                <p className="text-[12px] text-[#999]">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Transcript */}
          <div className="border border-[#e5e5e5] rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[#e5e5e5] bg-[#fafafa]">
              <MessageSquare className="w-3.5 h-3.5 text-[#999]" />
              <span className="text-[13px] font-medium">Transcript</span>
            </div>
            <div className="px-5 py-4">
              <ScrollArea className="h-[300px]">
                <p className="text-[13px] leading-[1.8] text-[#555] whitespace-pre-wrap font-mono">
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
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
