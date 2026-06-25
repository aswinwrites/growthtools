import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "GROQ_API_KEY is not configured" }, { status: 500 });
  }

  try {
    const { imageBase64, mimeType } = (await req.json()) as {
      imageBase64: string;
      mimeType: string;
    };

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: "Missing imageBase64 or mimeType" }, { status: 400 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const response = await groq.chat.completions.create({
      model: "llama-3.2-90b-vision-preview",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${imageBase64}` },
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

    const text = response.choices[0].message.content ?? "";
    return NextResponse.json({ text });
  } catch (err) {
    console.error("[screenshot-to-text]", err);
    return NextResponse.json({ error: "Extraction failed. Try again." }, { status: 500 });
  }
}
