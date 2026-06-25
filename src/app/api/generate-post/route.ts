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

    // 👉 TEMP: using test image
    const imageTestUrl =
      "https://pixcity-prod-planning.s3.eu-west-2.amazonaws.com/11369_61762_11968_6984913bb1d74.png";

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

          Objective: Create a high-converting Instagram post for the given brand, using the provided product image, requirement and use the website for additional context.

          Requirement from user : ${requirement}
          Website for reference: ${websiteUrl}
          Use this ONLY to understand the business. Do not assume or invent any details that are not clearly stated or verifiable from the website.

          Tasks:

          1. Instagram Post Creation
          - Write an engaging title and caption
          - Tone: celebratory, premium, engaging
          - Optimize for conversions (hook + emotion + subtle CTA)
          - Keep it concise

          2. Image Prompt
          - Describe a high-quality visual concept
          - Suitable for AI image generation

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
            "image_prompt": "...",
            "business_brief": "...",
            "address": "..."
          }`
        },
        {
          type: "input_image",
          image_url: imageTestUrl,
          detail: "high",
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
    // 4. Generate new image
    // =========================
    const imageGen = await client.images.generate({
      model: "gpt-image-1-mini",
      prompt: `
        Modify the given image, it should be high-converting Instagram post image, visually appealing with catchy titles and description.
        Never try to create a new image. You have to work on the image provided by the user.

        Image: ${imageTestUrl}

        Enhancement instructions:
        ${parsed.image_prompt}

        Adapt the composition and styling based on the subject of the image (it can be any type: product, food, lifestyle, object, etc.).

        Enhance the image with subtle, premium marketing-style text elements to make it more engaging. Examples (adapt dynamically to context)

        Text guidelines:
        - Ensure text is contextually relevant to the image
        - Use clean, modern, minimal typography
        - Integrate text naturally into the scene (badges, labels, stickers, packaging, or UI-style overlays)
        - Avoid clutter and do not overpower the main subject


        Visual style:
        - High-end, polished, and platform-ready (Instagram/social media friendly)
        - Sharp focus, balanced lighting
        - Clean composition with strong visual hierarchy
        - Background and color palette should complement the subject dynamically
        `,
        size: "1024x1024",
    });

    const imageBase64 = imageGen.data?.[0]?.b64_json;
    const generatedImageUrl = `data:image/png;base64,${imageBase64}`;

    // =========================
    // 5. Return response
    // =========================
    return NextResponse.json({
      title: parsed.title,
      content: parsed.content,
      imagePrompt: parsed.image_prompt,
      businessBrief: parsed.business_brief,
      businessAddress: parsed.address,
      generatedImageUrl,
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