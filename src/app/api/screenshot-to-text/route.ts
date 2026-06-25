import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not configured" }, { status: 500 });
  }

  try {
    const { imageBase64, mimeType } = (await req.json()) as {
      imageBase64: string;
      mimeType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
    };

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: "Missing imageBase64 or mimeType" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mimeType, data: imageBase64 },
            },
            {
              type: "text",
              text: `Extract all text from this image exactly as it appears.

Rules:
- Return ONLY the extracted text — no explanations or commentary
- Preserve original line breaks and paragraph structure
- Maintain any visible hierarchy (headings appear before body text)
- Include ALL text: labels, captions, buttons, small print, watermarks
- For tables or structured data, preserve alignment with spaces or tabs
- If a section has a clear heading, put it on its own line
- If no text is found, return exactly: No text detected in this image`,
            },
          ],
        },
      ],
    });

    const text = (message.content[0] as { type: "text"; text: string }).text;
    return NextResponse.json({ text });
  } catch (err) {
    console.error("[screenshot-to-text]", err);
    return NextResponse.json({ error: "Extraction failed. Try again." }, { status: 500 });
  }
}
