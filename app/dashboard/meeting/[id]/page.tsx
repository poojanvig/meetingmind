'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import MeetingDetails from "@/components/MeetingDetails";
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface MeetingData {
  id: string;
  name: string;
  description: string;
  transcript: string;
  summary: string;
  breakdown: {
    Tasks: { task: string; owner: string; due_date: string }[];
    Decisions: { decision: string; details: string }[];
    Questions: { question: string; status: string; answer?: string }[];
    Insights: { insight: string; reference: string }[];
    Deadlines: { deadline: string; related_to: string }[];
    Attendees: { name: string; role: string }[];
    "Follow-ups": { follow_up: string; owner: string; due_date: string }[];
    Risks: { risk: string; impact: string }[];
  };
}

const DEMO_MEETINGS: Record<string, MeetingData> = {
  "demo-sprint": {
    id: "demo-sprint",
    name: "Sprint Planning — Week 12",
    description: "Tasks assigned, deadlines set for Q1 deliverables",
    transcript: "PM: Alright everyone, let's go through the backlog for this sprint. We've got 14 story points carried over from last week.\n\nSarah: The auth service migration is almost done. I'll need about two more days to finish the token refresh flow.\n\nPM: Got it. Jake, where are we on the dashboard redesign?\n\nJake: Mockups are approved. I'll start implementation today. Should be done by Thursday if there are no design changes.\n\nPM: Perfect. Lisa, the client reported a bug in the export feature — can you prioritize that?\n\nLisa: Yeah, I saw the ticket. It's a formatting issue with the DOCX output. I'll have a fix by end of day.\n\nPM: Great. Let's also talk about the Q1 deadline. We need the v2.0 release candidate ready by March 15th. That gives us exactly two weeks.\n\nSarah: That's tight. We should cut scope on the analytics module if we're not going to make it.\n\nPM: Agreed. Let's revisit that in Wednesday's standup. Everyone clear on priorities? Good, let's ship it.",
    summary: "Sprint planning meeting covering Week 12 priorities. The team reviewed 14 carried-over story points, assigned new tasks including auth migration completion, dashboard redesign implementation, and a critical export bug fix. The Q1 deadline of March 15th for v2.0 release candidate was discussed, with a potential scope cut on the analytics module to meet the timeline.",
    breakdown: {
      Tasks: [
        { task: "Complete auth service token refresh flow", owner: "Sarah", due_date: "2025-03-06" },
        { task: "Implement dashboard redesign from approved mockups", owner: "Jake", due_date: "2025-03-06" },
        { task: "Fix DOCX export formatting bug", owner: "Lisa", due_date: "2025-03-04" },
        { task: "Prepare v2.0 release candidate", owner: "Team", due_date: "2025-03-15" },
      ],
      Decisions: [
        { decision: "Cut scope on analytics module if timeline is at risk", details: "Will be revisited in Wednesday standup" },
        { decision: "Prioritize export bug fix over new features", details: "Client-reported issue needs immediate attention" },
      ],
      Questions: [
        { question: "Should we cut scope on the analytics module?", status: "Open", answer: "To be decided Wednesday" },
      ],
      Insights: [
        { insight: "14 story points carried over from previous sprint", reference: "Sprint velocity may need adjustment" },
        { insight: "Two weeks until Q1 deadline", reference: "March 15th target for v2.0 RC" },
      ],
      Deadlines: [
        { deadline: "March 15, 2025", related_to: "v2.0 release candidate" },
        { deadline: "March 6, 2025", related_to: "Dashboard redesign implementation" },
      ],
      Attendees: [
        { name: "PM", role: "Project Manager" },
        { name: "Sarah", role: "Backend Engineer" },
        { name: "Jake", role: "Frontend Engineer" },
        { name: "Lisa", role: "Full-stack Engineer" },
      ],
      "Follow-ups": [
        { follow_up: "Revisit analytics module scope", owner: "PM", due_date: "2025-03-05" },
        { follow_up: "Verify export bug fix with client", owner: "Lisa", due_date: "2025-03-05" },
      ],
      Risks: [
        { risk: "Q1 deadline may not be met with current scope", impact: "Release delay or feature cut required" },
        { risk: "Auth migration dependency on dashboard", impact: "Could block frontend work if delayed" },
      ],
    },
  },
  "demo-roadmap": {
    id: "demo-roadmap",
    name: "Product Roadmap Review",
    description: "Discussed feature priorities and timeline for v2.0 launch",
    transcript: "Director: Let's review where we are on the roadmap. v2.0 is our big bet for Q2.\n\nProduct Lead: We've scoped three major features: real-time collaboration, advanced analytics, and API integrations. Collaboration is 70% done. Analytics is in design. API hasn't started.\n\nDirector: What's the launch risk?\n\nProduct Lead: If we ship collaboration and analytics, we can launch on time. API can go in 2.1.\n\nEngineering Lead: Agreed. The API layer needs a proper design doc first anyway. Rushing it would create tech debt.\n\nDirector: Fine. Let's lock the scope: collaboration and analytics for v2.0, API for 2.1. Marketing needs to know by Friday.\n\nProduct Lead: I'll send the updated roadmap to marketing and sales by end of week.",
    summary: "Roadmap review for v2.0 launch. Three features were evaluated: real-time collaboration (70% complete), advanced analytics (in design), and API integrations (not started). Decision made to ship v2.0 with collaboration and analytics only, deferring API to v2.1 to avoid tech debt. Marketing to be notified by Friday.",
    breakdown: {
      Tasks: [
        { task: "Send updated roadmap to marketing and sales", owner: "Product Lead", due_date: "2025-03-07" },
        { task: "Complete real-time collaboration feature", owner: "Engineering", due_date: "2025-03-20" },
        { task: "Finalize analytics design", owner: "Design Team", due_date: "2025-03-10" },
      ],
      Decisions: [
        { decision: "v2.0 will include collaboration and analytics only", details: "API integrations deferred to v2.1" },
        { decision: "API layer requires proper design doc before implementation", details: "Avoid creating tech debt" },
      ],
      Questions: [],
      Insights: [
        { insight: "Real-time collaboration is 70% complete", reference: "Ahead of schedule" },
        { insight: "API integrations need design work before development", reference: "Engineering lead recommendation" },
      ],
      Deadlines: [
        { deadline: "Friday (end of week)", related_to: "Notify marketing of updated scope" },
        { deadline: "Q2 launch", related_to: "v2.0 release" },
      ],
      Attendees: [
        { name: "Director", role: "VP of Product" },
        { name: "Product Lead", role: "Product Manager" },
        { name: "Engineering Lead", role: "Engineering Manager" },
      ],
      "Follow-ups": [
        { follow_up: "Create API design doc for v2.1", owner: "Engineering Lead", due_date: "2025-03-14" },
        { follow_up: "Update sales deck with new feature timeline", owner: "Product Lead", due_date: "2025-03-07" },
      ],
      Risks: [
        { risk: "Analytics feature still in design phase", impact: "May delay v2.0 if design takes longer than expected" },
      ],
    },
  },
  "demo-client": {
    id: "demo-client",
    name: "Client Onboarding Call — Acme Corp",
    description: "Requirements gathering, integration timeline, key stakeholders identified",
    transcript: "Account Manager: Thanks for joining, everyone. Let's walk through Acme's requirements for the integration.\n\nClient CTO: We need SSO via SAML, data sync with our Salesforce instance, and a custom reporting dashboard.\n\nAccount Manager: Got it. SSO we can do out of the box. Salesforce sync will need our integrations team — roughly 3 weeks. Custom dashboard depends on complexity.\n\nClient CTO: The dashboard should show pipeline metrics, deal velocity, and team performance. Nothing too exotic.\n\nSolutions Engineer: That's feasible. I'd estimate 2 weeks for the dashboard. We'll need API access to your Salesforce org.\n\nClient CTO: I'll have our admin send over credentials by Monday.\n\nAccount Manager: Perfect. So we're looking at about 5 weeks for the full rollout. I'll send over a project plan by end of day.",
    summary: "Onboarding call with Acme Corp covering integration requirements: SSO via SAML (available out of box), Salesforce data sync (3 weeks), and custom reporting dashboard (2 weeks). Full rollout estimated at 5 weeks. Client to provide Salesforce API credentials by Monday.",
    breakdown: {
      Tasks: [
        { task: "Set up SSO via SAML for Acme Corp", owner: "Engineering", due_date: "2025-03-07" },
        { task: "Build Salesforce data sync integration", owner: "Integrations Team", due_date: "2025-03-21" },
        { task: "Develop custom reporting dashboard", owner: "Solutions Engineer", due_date: "2025-03-14" },
        { task: "Send project plan to Acme Corp", owner: "Account Manager", due_date: "2025-02-28" },
      ],
      Decisions: [
        { decision: "SSO will use existing SAML implementation", details: "No custom work needed" },
        { decision: "Full rollout timeline set at 5 weeks", details: "Starting from credential handoff" },
      ],
      Questions: [],
      Insights: [
        { insight: "Dashboard needs pipeline metrics, deal velocity, and team performance", reference: "Client CTO specification" },
      ],
      Deadlines: [
        { deadline: "Monday", related_to: "Salesforce API credentials from client" },
        { deadline: "5 weeks from kickoff", related_to: "Full integration rollout" },
      ],
      Attendees: [
        { name: "Account Manager", role: "Account Executive" },
        { name: "Client CTO", role: "Acme Corp CTO" },
        { name: "Solutions Engineer", role: "Technical Implementation" },
      ],
      "Follow-ups": [
        { follow_up: "Receive Salesforce API credentials", owner: "Client CTO", due_date: "2025-03-03" },
        { follow_up: "Schedule kickoff with integrations team", owner: "Account Manager", due_date: "2025-03-04" },
      ],
      Risks: [
        { risk: "Salesforce API access may require client IT approval", impact: "Could delay sync integration start" },
        { risk: "Custom dashboard scope creep", impact: "Additional requirements could extend timeline" },
      ],
    },
  },
  "demo-standup": {
    id: "demo-standup",
    name: "Engineering Standup",
    description: "Blocker on auth service resolved, deployment scheduled for Friday",
    transcript: "Lead: Quick standup. What's blocking anyone?\n\nDev 1: The auth service was returning 503s all morning. Turned out to be a misconfigured rate limiter in the new deployment. I've rolled it back and applied the fix. Should be stable now.\n\nLead: Good catch. Dev 2, how's the notification system?\n\nDev 2: Almost done. Email notifications are working. Push notifications need another day — the Firebase config was wrong in staging.\n\nLead: Alright. Let's aim to deploy everything Friday morning. I'll coordinate with DevOps.\n\nDev 1: Works for me. I'll run the full test suite tonight.\n\nLead: Perfect. Let's keep it tight this week.",
    summary: "Quick engineering standup. Auth service 503 errors were caused by a misconfigured rate limiter — now fixed and rolled back. Notification system is nearly complete with email working and push notifications needing one more day. Full deployment scheduled for Friday morning.",
    breakdown: {
      Tasks: [
        { task: "Run full test suite before Friday deployment", owner: "Dev 1", due_date: "2025-02-27" },
        { task: "Fix Firebase push notification config in staging", owner: "Dev 2", due_date: "2025-02-27" },
        { task: "Coordinate Friday deployment with DevOps", owner: "Lead", due_date: "2025-02-28" },
      ],
      Decisions: [
        { decision: "Deploy everything Friday morning", details: "Full release including auth fix and notifications" },
        { decision: "Rate limiter fix applied via rollback", details: "Misconfigured rate limiter caused auth 503 errors" },
      ],
      Questions: [],
      Insights: [
        { insight: "Auth 503 errors caused by misconfigured rate limiter", reference: "New deployment issue" },
        { insight: "Firebase config was wrong in staging environment", reference: "Push notification blocker" },
      ],
      Deadlines: [
        { deadline: "Friday morning", related_to: "Full deployment" },
      ],
      Attendees: [
        { name: "Lead", role: "Engineering Lead" },
        { name: "Dev 1", role: "Backend Developer" },
        { name: "Dev 2", role: "Full-stack Developer" },
      ],
      "Follow-ups": [
        { follow_up: "Verify auth service stability after fix", owner: "Dev 1", due_date: "2025-02-27" },
      ],
      Risks: [
        { risk: "Friday deployment could surface new issues", impact: "Weekend on-call may be needed" },
      ],
    },
  },
  "demo-design": {
    id: "demo-design",
    name: "Design Review — Dashboard Redesign",
    description: "Approved new layout, 3 follow-up tasks for the design team",
    transcript: "Design Lead: Here's the updated dashboard layout. We moved the key metrics to the top, added a quick-action sidebar, and simplified the navigation.\n\nPM: I like the metrics placement. The sidebar feels a bit crowded though — can we limit it to 5 actions max?\n\nDesign Lead: Sure, we'll prioritize the top 5 by usage data.\n\nFrontend Lead: From an implementation standpoint, this is straightforward. The sidebar component already exists — we just need to refactor the props. I'd say 3 days of work.\n\nPM: Good. Let's approve this layout and move to implementation. Design team — can you finalize the responsive specs and the dark mode variant by next week?\n\nDesign Lead: Yes, we'll have both ready by Wednesday.\n\nPM: Great. Let's ship this.",
    summary: "Design review for the dashboard redesign. New layout approved with key metrics at top, quick-action sidebar (limited to 5 actions), and simplified navigation. Implementation estimated at 3 days. Design team to deliver responsive specs and dark mode variant by Wednesday.",
    breakdown: {
      Tasks: [
        { task: "Limit quick-action sidebar to top 5 actions by usage", owner: "Design Lead", due_date: "2025-02-26" },
        { task: "Finalize responsive design specifications", owner: "Design Team", due_date: "2025-02-26" },
        { task: "Create dark mode variant for new dashboard", owner: "Design Team", due_date: "2025-02-26" },
        { task: "Refactor sidebar component props for new layout", owner: "Frontend Lead", due_date: "2025-02-28" },
      ],
      Decisions: [
        { decision: "New dashboard layout approved", details: "Key metrics at top, quick-action sidebar, simplified nav" },
        { decision: "Sidebar limited to 5 actions maximum", details: "Prioritized by usage analytics data" },
      ],
      Questions: [],
      Insights: [
        { insight: "Sidebar component already exists — only needs prop refactoring", reference: "Frontend Lead assessment" },
        { insight: "Implementation estimated at 3 days", reference: "Relatively low engineering effort" },
      ],
      Deadlines: [
        { deadline: "Wednesday", related_to: "Responsive specs and dark mode variant" },
        { deadline: "3 days from approval", related_to: "Dashboard implementation" },
      ],
      Attendees: [
        { name: "Design Lead", role: "Head of Design" },
        { name: "PM", role: "Product Manager" },
        { name: "Frontend Lead", role: "Frontend Engineering Lead" },
      ],
      "Follow-ups": [
        { follow_up: "Pull usage analytics for sidebar action prioritization", owner: "Design Lead", due_date: "2025-02-25" },
        { follow_up: "Review responsive specs before implementation", owner: "Frontend Lead", due_date: "2025-02-26" },
      ],
      Risks: [
        { risk: "Dark mode variant may surface color contrast issues", impact: "Could require additional design iteration" },
      ],
    },
  },
};

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.id as string;
  const [data, setData] = useState<MeetingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (!meetingId) return;

    // Check if this is a demo meeting
    if (meetingId.startsWith('demo-') && DEMO_MEETINGS[meetingId]) {
      setData(DEMO_MEETINGS[meetingId]);
      setIsDemo(true);
      return;
    }

    axios
      .get(`/api/meetings/${meetingId}`)
      .then((response) => {
        setData({ ...response.data, id: meetingId });
      })
      .catch((error) => {
        console.error("Error fetching meeting details:", error);
        if (error.response && error.response.status === 404) {
          setError("Meeting not found.");
        } else {
          setError("Failed to fetch meeting details.");
        }
      });
  }, [meetingId]);

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white text-[#0a0a0a]">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-[#e5e5e5]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-[15px] font-semibold tracking-tight">
            MeetingMind
          </Link>
          <button
            onClick={handleGoBack}
            className="flex items-center gap-1.5 text-[13px] text-[#666] hover:text-[#0a0a0a] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {isDemo && (
          <div className="flex items-center gap-2 text-[12px] text-[#92400e] bg-[#fffbeb] border border-[#fef3c7] rounded-lg px-4 py-2.5 mb-6">
            This is example data for demonstration purposes.
          </div>
        )}

        {error ? (
          <div className="border border-[#e5e5e5] rounded-xl py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-[#fef2f2] flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-[#ef4444]" />
            </div>
            <p className="text-[15px] font-medium text-[#0a0a0a] mb-1">{error}</p>
            <button
              onClick={handleGoBack}
              className="text-[13px] text-[#666] hover:text-[#0a0a0a] transition-colors mt-2"
            >
              Back to Dashboard
            </button>
          </div>
        ) : !data ? (
          <div className="border border-[#e5e5e5] rounded-xl py-16 text-center">
            <Loader2 className="w-5 h-5 text-[#999] animate-spin mx-auto mb-3" />
            <p className="text-[14px] text-[#999]">Loading meeting details...</p>
          </div>
        ) : (
          <MeetingDetails data={data} />
        )}
      </main>
    </div>
  );
}
