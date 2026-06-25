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
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
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

    const csv = response.choices[0].message.content ?? "";
    return NextResponse.json({ csv });
  } catch (err) {
    console.error("[image-to-csv]", err);
    return NextResponse.json({ error: "Extraction failed. Try again." }, { status: 500 });
  }
}
