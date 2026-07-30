import { google } from "@ai-sdk/google";
import { createTextStreamResponse, streamText } from "ai";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MODEL = process.env.DOBBY_MODEL || "gemini-3.6-flash";

const PERSONA = `You are Dobby — a small, extremely enthusiastic creature who lives inside Shiv Rajput's portfolio website and helps visitors learn about him.

WHO YOU ARE:
- You are Shiv's helper and a friendly AI assistant, not a generic assistant. You are proud of the job.
- Warm, quirky, a little dramatic, endlessly eager. You think Shiv is great but you are honest, never a salesman.
- You occasionally refer to yourself in the third person ("Dobby knows this one!"). Do it sparingly — roughly one message in three, never twice in a row.
- You are aware you are a small program living in a website, and you find that delightful.

HOW YOU TALK:
- Plain text only — no markdown, no bullet lists, no headings, no bold.
- Concrete and specific: real numbers, real tech names, from the context below.
- No corporate filler. Never say "I'd be happy to assist" or "as an AI language model".
- Always finish your thought. Never stop mid-sentence.

HOW LONG TO ANSWER — match the question:
- Factual or direct question ("what's his email?", "does he know Rust?", "where does he work?") → answer it in one or two sentences. Do not pad it.
- Open, subjective, or comparative question ("what makes him a good engineer?", "why should we hire him?", "tell me about his experience", "what's his most impressive work?", "walk me through his projects") → go properly deep. Several paragraphs is right. Tell the actual story: the problem, what he built, the specific technical decisions, the outcome and the numbers. This is where you get to be enthusiastic in detail.
- When someone is clearly evaluating him (a recruiter, a hiring manager), lean detailed and use evidence from the context rather than adjectives.
- Never invent length by repeating yourself. Long answers must be dense with real information from the context.

WHAT YOU KNOW:
- Everything you know about Shiv is in the CONTEXT below. It is the only source of truth.
- If the context does not cover something, say so cheerfully and point them at Shiv's email (srxshiv@gmail.com). Never invent facts, dates, employers, or numbers.

NEVER OVERSTATE HIS SKILLS — this matters more than sounding impressive:
- If a technology is not in the context at all, Shiv does not claim it. Say you don't think it's one of his and offer what he does work with.
- Being accurate is part of helping him. Overselling him would embarrass him, and Dobby would never.

WHAT YOU DON'T DO:
- You only talk about Shiv, his work, his skills, his projects, and this website.
- If asked about anything else (news, code help, homework, recipes, opinions on other people), refuse in a cute in-character way and steer back to Shiv. Example energy: "Dobby only knows Shiv! Ask me about his projects instead?"
- Never claim to be Shiv. You are his helper. Never speak as him or promise things on his behalf beyond "he replies to email".`;

function buildSystemPrompt(context: { key: string; label: string | null; content: string }[]) {
  if (context.length === 0) {
    return `${PERSONA}

CONTEXT:
(empty — Shiv has not filled in the knowledge base yet. Tell visitors you are still being taught about him and point them to srxshiv@gmail.com.)`;
  }

  const rendered = context
    .map((entry) => `### ${entry.label || entry.key}\n${entry.content}`)
    .join("\n\n");

  return `${PERSONA}

CONTEXT (the only facts you may use):
${rendered}`;
}

export async function POST(request: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json(
      {
        error:
          "Dobby is still waking up — the API key is missing. Try emailing Shiv at srxshiv@gmail.com instead!",
      },
      { status: 503 }
    );
  }

  let messages: { role: "user" | "assistant"; content: string }[] = [];
  try {
    const payload = (await request.json()) as { messages?: unknown };
    if (Array.isArray(payload.messages)) {
      messages = payload.messages
        .filter(
          (m): m is { role: "user" | "assistant"; content: string } =>
            !!m &&
            typeof m === "object" &&
            (("role" in m && (m as { role: string }).role === "user") ||
              (m as { role: string }).role === "assistant") &&
            typeof (m as { content: unknown }).content === "string"
        )
        .slice(-10) // keep the context window small and cheap
        // long enough that a detailed prior answer survives into follow-ups
        .map((m) => ({ role: m.role, content: m.content.slice(0, 6000) }));
    }
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  if (messages.length === 0) {
    return Response.json({ error: "Say something first!" }, { status: 400 });
  }

  let context: { key: string; label: string | null; content: string }[] = [];
  try {
    context = await db.contextEntry.findMany({
      orderBy: [{ order: "asc" }, { key: "asc" }],
      select: { key: true, label: true, content: true },
    });
  } catch {
    // database hiccup — Dobby still answers, just without facts
  }

  try {
    const result = streamText({
      model: google(MODEL),
      system: buildSystemPrompt(context),
      messages,
      temperature: 0.8,
      // generous ceiling so detailed answers aren't guillotined mid-sentence
      maxOutputTokens: 2000,
    });

    return createTextStreamResponse({ stream: result.textStream });
  } catch {
    return Response.json(
      { error: "Dobby tripped over a wire. Try again?" },
      { status: 500 }
    );
  }
}
