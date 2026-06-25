import { NextResponse } from "next/server";
import { apiRequest } from "../../../../utils/apiMiddleware";

export async function POST(req: Request) {
  try {
    
    const formData = await req.formData();

    const backendData = await apiRequest("/public/api/lead-campaign-data/en", {
    method: "POST",
    body: formData,
    headers: {
    "Content-Type": "multipart/form-data",
  },
  });

  console.log('-----------------------------------------------')
    // const backendData = await backendResponse.json();

    return NextResponse.json(
      {
        success: backendData.success,
        message: (backendData.data as { message?: string })?.message,
      },
      {
        status: backendData.code ?? 200,
      }
    );
  } catch (err) {
    console.error("[MARKETING LEAD] Unexpected error", err);

    return NextResponse.json(
      {
        success: false,
        message: "Error submitting form",
        // error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}