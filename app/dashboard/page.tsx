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
    <div className="min-h-screen bg-white text-[#0a0a0a]">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-[#e5e5e5]">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-[15px] font-semibold tracking-tight">
            MeetingMind
          </Link>
          <span className="text-[13px] text-[#999]">Dashboard</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Upload */}
        <UploadAudio onUploadSuccess={fetchMeetings} />

        {/* Meetings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold">Previous meetings</h2>
            <span className="text-[12px] text-[#999]">
              {meetings.length > 0 ? `${meetings.length} total` : ''}
            </span>
          </div>

          {/* Real meetings */}
          {meetings.length > 0 && (
            <div className="border border-[#e5e5e5] rounded-xl overflow-hidden divide-y divide-[#e5e5e5]">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  onClick={() => handleViewDetails(meeting.id)}
                  className="group flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[#fafafa] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#f5f5f5] flex items-center justify-center flex-shrink-0 group-hover:bg-[#eee] transition-colors">
                    <FileAudio className="w-4 h-4 text-[#888]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[#0a0a0a] truncate">
                      {meeting.name}
                    </p>
                    <p className="text-[12px] text-[#999] truncate mt-0.5">
                      {meeting.description || 'No description'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(meeting.id, e)}
                    className="p-1.5 rounded-md text-[#ccc] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-all opacity-0 group-hover:opacity-100"
                    title="Delete meeting"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-[#ccc] group-hover:text-[#999] transition-colors flex-shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* Example meetings — shown when no real meetings exist */}
          {meetings.length === 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-[#e5e5e5]" />
                <span className="text-[11px] text-[#bbb] uppercase tracking-wider px-2">Example meetings</span>
                <div className="h-px flex-1 bg-[#e5e5e5]" />
              </div>
              <div className="border border-[#e5e5e5] rounded-xl overflow-hidden divide-y divide-[#e5e5e5]">
                {[
                  { id: "demo-sprint", name: "Sprint Planning — Week 12", desc: "Tasks assigned, deadlines set for Q1 deliverables", type: "audio", date: "Mar 4" },
                  { id: "demo-roadmap", name: "Product Roadmap Review", desc: "Discussed feature priorities and timeline for v2.0 launch", type: "video", date: "Mar 3" },
                  { id: "demo-client", name: "Client Onboarding Call — Acme Corp", desc: "Requirements gathering, integration timeline, key stakeholders identified", type: "audio", date: "Feb 28" },
                  { id: "demo-standup", name: "Engineering Standup", desc: "Blocker on auth service resolved, deployment scheduled for Friday", type: "audio", date: "Feb 27" },
                  { id: "demo-design", name: "Design Review — Dashboard Redesign", desc: "Approved new layout, 3 follow-up tasks for the design team", type: "video", date: "Feb 25" },
                ].map((example, i) => (
                  <div
                    key={i}
                    onClick={() => router.push(`dashboard/meeting/${example.id}`)}
                    className="group flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[#fafafa] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#f5f5f5] flex items-center justify-center flex-shrink-0">
                      {example.type === 'video'
                        ? <FileVideo className="w-4 h-4 text-[#aaa]" />
                        : <FileAudio className="w-4 h-4 text-[#aaa]" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-[#0a0a0a] truncate">
                        {example.name}
                      </p>
                      <p className="text-[12px] text-[#999] truncate mt-0.5">
                        {example.desc}
                      </p>
                    </div>
                    <span className="text-[11px] text-[#ccc] flex-shrink-0">{example.date}</span>
                    <ArrowRight className="w-4 h-4 text-[#ddd] flex-shrink-0" />
                  </div>
                ))}
              </div>
              <p className="text-[12px] text-[#bbb] text-center mt-3">
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
