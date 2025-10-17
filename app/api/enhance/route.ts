
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }
    const refined = await callRefineAPI(text);
    return NextResponse.json({ refined });
  } catch (err) {
    console.error("Error in /api/refine:", err);
    return NextResponse.json(
      { error: err || "Internal server error" },
      { status: 500 }
    );
  }
}

async function callRefineAPI(input: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Gemini API key");
  }
  const modelName = "gemini-2.5-flash"; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
text: `Rewrite or enhance this feedback into a professional, clear 4-5 line statement. 
Do not give multiple options, explanations, or bullet points. 
Return only the final simple understandable manner rewritten text, nothing else.\n\n${input}`
          }
        ]
      }
    ]
  };

  const apiResp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(body)
  });

  if (!apiResp.ok) {
    const errText = await apiResp.text();
    throw new Error(`Gemini API error: ${errText}`);
  }

  const j = await apiResp.json();
  const candidate = j.candidates?.[0];
  const refined = candidate?.content?.parts?.[0]?.text;
  if (!refined) {
    throw new Error("No refined text returned from Gemini");
  }
  return refined.trim();
}
