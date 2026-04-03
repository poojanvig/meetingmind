'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import axios from "axios";
import UploadAudio from '@/components/UploadAudio';
import { useToast } from "@/hooks/use-toast"
import { ArrowRight, Trash2, FileAudio, FileVideo } from 'lucide-react';
import Link from 'next/link';

interface Meeting {
  id: string;
  name: string;
  description: string;
  fileName: string;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const { toast } = useToast();

  const fetchMeetings = async () => {
    try {
      const response = await axios.get("/api/meetings");
      setMeetings(response.data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      setMeetings([]);
      toast({
        title: 'Error',
        description: 'Failed to fetch meetings.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleViewDetails = (meetingId: string) => {
    router.push(`dashboard/meeting/${meetingId}`);
  };

  const handleDelete = async (meetingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this meeting? This action cannot be undone.")) {
      try {
        await axios.delete(`/api/meetings/${meetingId}`);
        toast({
          title: 'Success',
          description: 'Meeting deleted successfully.',
        });
        fetchMeetings();
      } catch (error) {
        console.error("Error deleting meeting:", error);
        toast({
          title: 'Error',
          description: 'Failed to delete meeting.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f7ff] via-white to-[#f0f4ff] text-[#1a1637]">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-indigo-100/60">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-[15px] font-semibold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            MeetingMind
          </Link>
          <span className="text-[13px] text-indigo-400 font-medium">Dashboard</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Upload */}
        <UploadAudio onUploadSuccess={fetchMeetings} />

        {/* Meetings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-[#1a1637]">Previous meetings</h2>
            <span className="text-[12px] text-indigo-400">
              {meetings.length > 0 ? `${meetings.length} total` : ''}
            </span>
          </div>

          {/* Real meetings */}
          {meetings.length > 0 && (
            <div className="border border-indigo-100/80 rounded-2xl overflow-hidden divide-y divide-indigo-50 bg-white/80 backdrop-blur-sm shadow-lg shadow-indigo-500/5">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  onClick={() => handleViewDetails(meeting.id)}
                  className="group flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-indigo-50/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <FileAudio className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[#1a1637] truncate">
                      {meeting.name}
                    </p>
                    <p className="text-[12px] text-[#8a8aa8] truncate mt-0.5">
                      {meeting.description || 'No description'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(meeting.id, e)}
                    className="p-1.5 rounded-lg text-[#b0b0c8] hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete meeting"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-indigo-300 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* Example meetings — shown when no real meetings exist */}
          {meetings.length === 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
                <span className="text-[11px] text-indigo-400 uppercase tracking-wider px-2">Example meetings</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
              </div>
              <div className="border border-indigo-100/80 rounded-2xl overflow-hidden divide-y divide-indigo-50 bg-white/80 backdrop-blur-sm shadow-lg shadow-indigo-500/5">
                {[
                  { id: "demo-sprint", name: "Sprint Planning — Week 12", desc: "Tasks assigned, deadlines set for Q1 deliverables", type: "audio", date: "Mar 4", color: "from-blue-400 to-indigo-500" },
                  { id: "demo-roadmap", name: "Product Roadmap Review", desc: "Discussed feature priorities and timeline for v2.0 launch", type: "video", date: "Mar 3", color: "from-indigo-400 to-violet-500" },
                  { id: "demo-client", name: "Client Onboarding Call — Acme Corp", desc: "Requirements gathering, integration timeline, key stakeholders identified", type: "audio", date: "Feb 28", color: "from-violet-400 to-purple-500" },
                  { id: "demo-standup", name: "Engineering Standup", desc: "Blocker on auth service resolved, deployment scheduled for Friday", type: "audio", date: "Feb 27", color: "from-emerald-400 to-teal-500" },
                  { id: "demo-design", name: "Design Review — Dashboard Redesign", desc: "Approved new layout, 3 follow-up tasks for the design team", type: "video", date: "Feb 25", color: "from-amber-400 to-orange-500" },
                ].map((example, i) => (
                  <div
                    key={i}
                    onClick={() => router.push(`dashboard/meeting/${example.id}`)}
                    className="group flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-indigo-50/50 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${example.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      {example.type === 'video'
                        ? <FileVideo className="w-4 h-4 text-white" />
                        : <FileAudio className="w-4 h-4 text-white" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-[#1a1637] truncate">
                        {example.name}
                      </p>
                      <p className="text-[12px] text-[#8a8aa8] truncate mt-0.5">
                        {example.desc}
                      </p>
                    </div>
                    <span className="text-[11px] text-indigo-300 flex-shrink-0">{example.date}</span>
                    <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                  </div>
                ))}
              </div>
              <p className="text-[12px] text-[#a0a0be] text-center mt-3">
                These are examples. Upload a recording to see your own meetings here.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
