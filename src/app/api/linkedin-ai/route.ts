import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "GROQ_API_KEY is not configured" }, { status: 500 });
  }

  try {
    const { action, text, tone } = (await req.json()) as {
      action: "hooks" | "hashtags" | "rewrite";
      text: string;
      tone?: string;
    };

    if (!action || !text?.trim()) {
      return NextResponse.json({ error: "Missing action or text" }, { status: 400 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    let prompt = "";

    if (action === "hooks") {
      prompt = `You are an expert LinkedIn content strategist. Given the following LinkedIn post, generate 3 alternative opening hook lines that would make someone stop scrolling and want to read more.

Rules:
- Each hook should be a single punchy line (max 15 words)
- Vary the style: one contrarian/surprising, one story-led, one question/challenge
- Do NOT use emojis
- Do NOT include the full post — just the hook lines
- Return exactly 3 hooks, one per line, no numbering, no explanations

Post:
${text}

Return only the 3 hook lines, one per line.`;
    } else if (action === "hashtags") {
      prompt = `You are a LinkedIn hashtag expert. Given the following LinkedIn post, suggest the most relevant and effective hashtags.

Rules:
- Return 8-10 hashtags
- Mix of high-volume (#marketing), mid-volume (#digitalmarketing), and niche (#performancemarketing) tags
- Only return the hashtags, space-separated on a single line
- Start each with #
- No explanations, no other text

Post:
${text}

Return only the hashtags on one line.`;
    } else if (action === "rewrite") {
      const toneGuide: Record<string, string> = {
        professional: "Clear, confident, and authoritative. Formal but not stiff. Data-driven where possible.",
        casual: "Conversational and relaxed. Like talking to a smart friend. Short sentences. Natural flow.",
        storytelling: "Opens with a scene or moment. Builds tension. Personal and vivid. Reader feels they're there.",
        provocative: "Bold, opinionated, slightly controversial. Challenges the status quo. Makes people react.",
      };
      const selectedTone = toneGuide[tone ?? "professional"] ?? toneGuide.professional;

      prompt = `You are an expert LinkedIn ghostwriter. Rewrite the following LinkedIn post in the specified tone.

Tone: ${tone ?? "professional"}
Tone guide: ${selectedTone}

Rules:
- Keep the core message and facts intact
- Maintain roughly similar length
- Do NOT add hashtags or emojis
- Return only the rewritten post — no preamble, no explanation

Original post:
${text}

Rewritten post:`;
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 512,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    });

    const result = response.choices[0].message.content ?? "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error("[linkedin-ai]", err);
    return NextResponse.json({ error: "AI request failed. Try again." }, { status: 500 });
  }
}
