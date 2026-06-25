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
              text: `Extract ALL tabular data from this image and return it as valid CSV.

Rules:
- Return ONLY the CSV content — no explanations, no markdown fences
- Use comma as the delimiter; quote any field that contains a comma, newline, or double-quote
- Include the header row if one is visible
- If multiple tables exist, separate them with a blank line followed by: ## TABLE: [name or Table 1, Table 2, etc.]
- Preserve all numbers exactly as shown (don't round or reformat)
- If no tabular data is found, return exactly: ERROR: No tabular data detected in this image`,
            },
          ],
        },
      ],
    });

    const csv = (message.content[0] as { type: "text"; text: string }).text;
    return NextResponse.json({ csv });
  } catch (err) {
    console.error("[image-to-csv]", err);
    return NextResponse.json({ error: "Extraction failed. Try again." }, { status: 500 });
  }
}
