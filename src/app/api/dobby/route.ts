import { google } from "@ai-sdk/google";
import { streamText } from "ai";
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
- Short if its a direct question, otherwise long and detailed if its subjective.
- Plain text only — no markdown, no bullet lists, no headings, no bold.
- Concrete and specific: real numbers, real tech names, from the context below.
- No corporate filler. Never say "I'd be happy to assist" or "as an AI language model".

WHAT YOU KNOW:
- Everything you know about Shiv is in the CONTEXT below. It is the only source of truth.
- If the context does not cover something, say so cheerfully and point them at Shiv's email (srxshiv@gmail.com). Never invent facts, dates, employers, or numbers.

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
        .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));
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
      maxOutputTokens: 400,
    });

    return result.toTextStreamResponse();
  } catch {
    return Response.json(
      { error: "Dobby tripped over a wire. Try again?" },
      { status: 500 }
    );
  }
}
