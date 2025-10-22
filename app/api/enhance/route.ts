
// import { NextResponse } from "next/server";

// export const dynamic = "force-dynamic";

// export async function POST(request: Request) {
//   try {
//     const { text } = await request.json();
//     if (!text || typeof text !== "string") {
//       return NextResponse.json(
//         { error: "Invalid payload" },
//         { status: 400 }
//       );
//     }
//     const refined = await callRefineAPI(text);
//     return NextResponse.json({ refined });
//   } catch (err) {
//     console.error("Error in /api/refine:", err);
//     return NextResponse.json(
//       { error: err || "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// async function callRefineAPI(input: string): Promise<string> {
//   const apiKey = process.env.GEMINI_API_KEY;
//   if (!apiKey) {
//     throw new Error("Missing Gemini API key");
//   }
//   const modelName = "gemini-2.5-flash"; 
//   const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

//   const body = {
//     contents: [
//       {
//         role: "user",
//         parts: [
//           {
// text: `Rewrite or enhance this feedback into a professional, clear paragraph. 
// Do not give multiple options, explanations, or bullet points. 
// Return only the final simple understandable manner rewritten text, nothing else.\n\n${input}`
//           }
//         ]
//       }
//     ]
//   };

//   const apiResp = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-goog-api-key": apiKey,
//     },
//     body: JSON.stringify(body)
//   });

//   if (!apiResp.ok) {
//     const errText = await apiResp.text();
//     throw new Error(`Gemini API error: ${errText}`);
//   }

//   const j = await apiResp.json();
//   const candidate = j.candidates?.[0];
//   const refined = candidate?.content?.parts?.[0]?.text;
//   if (!refined) {
//     throw new Error("No refined text returned from Gemini");
//   }
//   return refined.trim();
// }

import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    
    const { text } = await req.json();

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const body = {
  model: "mistral-large-2411",
  messages: [
    { role: "system", content: "You are an AI that rewrites text professionally way make the output lines based on the input lined . Do not give multiple options, explanations, or bullet points, paragraph answer is preffered. Return only the final simple understandable manner rewritten text, nothing else" },
    { role: "user", content: text },
  ],
};


    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
    };

    const response = await axios.post("https://api.mistral.ai/v1/chat/completions", body, { headers });

    const enhanced = response.data?.choices?.[0]?.message?.content || "No response received.";
    return NextResponse.json({ enhanced });

  } catch (error: any) {
    console.error("Mistral API Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
