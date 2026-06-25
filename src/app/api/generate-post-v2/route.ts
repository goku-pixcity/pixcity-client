import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // ✅ Handle FormData
    const formData = await req.formData();
    const requirement = formData.get("requirement") as string;
    const websiteUrl = formData.get("websiteUrl") as string;

    if (!requirement) {
      return NextResponse.json(
        { error: "Missing requirement" },
        { status: 400 }
      );
    }

    // =========================
    // 1. Generate content + prompt
    // =========================

    const response = await client.responses.create({
  model: "gpt-4.1-mini",
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: `You are an expert Instagram ad copywriter and brand analyst.

          Objective: Create a high-converting Instagram post for the given brand, using the requirement and use the website for additional context.

          Requirement from user : ${requirement}
          Website for reference: ${websiteUrl}
          Use this ONLY to understand the business. Do not assume or invent any details that are not clearly stated or verifiable from the website.

          Tasks:

          1. Instagram Post Creation
          - Write an engaging title and caption
          - Tone: celebratory, premium, engaging
          - Optimize for conversions (hook + emotion + subtle CTA)
          - Keep it concise

          3. Business Brief (max 360 characters)
          - Based only on website
          - Neutral and factual

          4. Address Extraction
          - Extract only if clearly available
          - Else return ""

         Return ONLY valid JSON (no markdown, no explanation):

          {
            "title": "...",
            "content": "...",
            "business_brief": "...",
            "address": "..."
          }`
        }
      ],
    },
  ],
});

    // =========================
    // 2. Extract text safely
    // =========================
    const outputItem = response.output?.find(
      (item) => item.type === "message"
    );

    const text = (outputItem?.content?.find(
      (c) => c.type === "output_text"
    ) as { type: 'output_text'; text: string } | undefined)?.text;

    if (!text) {
      console.error("NO TEXT OUTPUT:", response);
      throw new Error("No text output from model");
    }

    console.log("RAW MODEL OUTPUT:", text);

    // =========================
    // 3. Clean + parse JSON
    // =========================
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("API ERROR FULL:", e);
      console.error("JSON PARSE FAILED:", cleaned);
      throw new Error("Invalid JSON from model");
    }


    // =========================
    // 5. Return response
    // =========================
    return NextResponse.json({
      title: parsed.title,
      content: parsed.content,
      imagePrompt: parsed.image_prompt,
      businessBrief: parsed.business_brief,
      businessAddress: parsed.address,
    });

  } catch (err) {
    console.error("API ERROR FULL:", err);

    return NextResponse.json(
      {
        error: "Generation failed",
        // message: err?.message,
      },
      { status: 500 }
    );
  }
}