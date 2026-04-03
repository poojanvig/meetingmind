import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Groq from 'groq-sdk'
import { File as FormDataFile } from 'buffer'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const ANALYSIS_PROMPT = `You are a meeting analyst. Analyze the following meeting transcript and extract structured information.

Return a valid JSON object with exactly this structure (no markdown, no code fences, just raw JSON):
{
  "Meeting Name": "string - a short descriptive title for the meeting",
  "Description": "string - one paragraph summary of what the meeting was about",
  "Summary": "string - detailed summary of the meeting",
  "Tasks": [{"description": "string", "owner": "string", "due_date": "YYYY-MM-DD or null"}],
  "Decisions": [{"description": "string", "date": "YYYY-MM-DD"}],
  "Questions": [{"question": "string", "status": "Answered or Unanswered", "answer": "string or null"}],
  "Insights": [{"insight": "string", "reference": "string - quote or context from transcript"}],
  "Deadlines": [{"description": "string", "date": "YYYY-MM-DD or null"}],
  "Attendees": [{"name": "string", "role": "string"}],
  "Follow-ups": [{"description": "string", "owner": "string"}],
  "Risks": [{"risk": "string", "impact": "string"}],
  "Agenda": ["string"]
}

If a category has no items, return an empty array. For dates you cannot determine, use null.
Extract as much detail as possible from the transcript.

TRANSCRIPT:
`

export const maxDuration = 60

export const POST = async (request: NextRequest) => {
  try {
    console.log('Received POST request to /api/transcribe')
    const formData = await request.formData()
    const file = formData.get('audio') as File

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided.' }, { status: 400 })
    }

    console.log('Received file:', file.name)

    // Convert file to buffer (no disk writes — works on Vercel)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create a File object that Groq SDK accepts
    const audioFile = new File([buffer], file.name, { type: file.type })

    // Step 1: Transcribe audio using Groq Whisper
    console.log('Starting transcription with Groq Whisper...')
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-large-v3',
      language: 'en',
    })

    const rawTranscript = transcription.text
    console.log('Transcription complete:', rawTranscript.substring(0, 100) + '...')

    if (!rawTranscript || rawTranscript.trim().length === 0) {
      throw new Error('Transcription returned empty text.')
    }

    // Step 2: Analyze transcript using Groq LLM
    console.log('Analyzing transcript with Groq LLM...')
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: ANALYSIS_PROMPT + rawTranscript,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 4096,
    })

    const analysisText = chatCompletion.choices[0]?.message?.content
    if (!analysisText) {
      throw new Error('LLM analysis returned empty response.')
    }

    console.log('Analysis complete, parsing JSON...')

    // Parse the JSON response
    let analyzedData
    try {
      const cleanJson = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      analyzedData = JSON.parse(cleanJson)
    } catch (parseError) {
      console.error('Failed to parse LLM response:', analysisText)
      throw new Error('Failed to parse analyzed transcript JSON.')
    }

    // Helper function to format dates as ISO strings
    const formatDate = (date: string) => {
      const parsedDate = new Date(date)
      return !isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : null
    }

    // Save to database
    console.log('Saving to database...')
    const meeting = await prisma.meeting.create({
      data: {
        name: analyzedData['Meeting Name'] || 'Untitled Meeting',
        description: analyzedData['Description'] || 'No description provided.',
        rawTranscript: rawTranscript,
        summary: analyzedData['Summary'] || '',
        tasks: {
          create: (analyzedData['Tasks'] || [])
            .filter((task: any) => task && typeof task === 'object')
            .map((task: any) => ({
              task: task.description || 'No task description',
              owner: task.owner || 'Unassigned',
              dueDate: task.due_date ? formatDate(task.due_date) : null,
            })),
        },
        decisions: {
          create: (analyzedData['Decisions'] || [])
            .filter((decision: any) => decision && typeof decision === 'object')
            .map((decision: any) => ({
              decision: decision.description || 'No decision description',
              date: decision.date ? formatDate(decision.date) : new Date().toISOString(),
            })),
        },
        questions: {
          create: (analyzedData['Questions'] || [])
            .filter((question: any) => question && typeof question === 'object')
            .map((question: any) => ({
              question: question.question || 'No question',
              status: question.status || 'Unanswered',
              answer: question.answer || '',
            })),
        },
        insights: {
          create: (analyzedData['Insights'] || [])
            .filter((insight: any) => insight && typeof insight === 'object')
            .map((insight: any) => ({
              insight: insight.insight || 'No insight',
              reference: insight.reference || '',
            })),
        },
        deadlines: {
          create: (analyzedData['Deadlines'] || [])
            .filter((deadline: any) => deadline && typeof deadline === 'object')
            .map((deadline: any) => ({
              description: deadline.description || 'No deadline description',
              dueDate: deadline.date ? formatDate(deadline.date) : null,
            })),
        },
        attendees: {
          create: (analyzedData['Attendees'] || [])
            .filter((attendee: any) => attendee && typeof attendee === 'object')
            .map((attendee: any) => ({
              name: attendee.name || 'Unnamed Attendee',
              role: attendee.role || 'No role specified',
            })),
        },
        followUps: {
          create: (analyzedData['Follow-ups'] || [])
            .filter((followUp: any) => followUp && typeof followUp === 'object')
            .map((followUp: any) => ({
              description: followUp.description || 'No follow-up description',
              owner: followUp.owner || 'Unassigned',
            })),
        },
        risks: {
          create: (analyzedData['Risks'] || [])
            .filter((risk: any) => risk && typeof risk === 'object')
            .map((risk: any) => ({
              risk: risk.risk || 'No risk description',
              impact: risk.impact || 'No impact specified',
            })),
        },
        agenda: {
          create: (analyzedData['Agenda'] || [])
            .filter((item: any) => item && typeof item === 'string')
            .map((item: string) => ({
              item: item,
            })),
        },
      },
      include: {
        tasks: true,
        decisions: true,
        questions: true,
        insights: true,
        deadlines: true,
        attendees: true,
        followUps: true,
        risks: true,
        agenda: true,
      },
    })

    console.log('Meeting saved successfully:', meeting.id)

    return NextResponse.json(meeting, { status: 200 })
  } catch (error: any) {
    console.error('Error in /api/transcribe:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred during processing.' },
      { status: 500 }
    )
  }
}
