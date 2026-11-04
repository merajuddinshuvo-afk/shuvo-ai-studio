import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const key = process.env.FAL_KEY;

    if (!key) {
      return NextResponse.json(
        { error: "FAL_KEY is not configured. Please add your fal.ai API key." },
        { status: 503 }
      );
    }

    const form = await request.formData();
    const image = form.get("image");
    const prompt = String(form.get("prompt") || "").trim();
    const negativePrompt = String(
      form.get("negativePrompt") || ""
    ).trim();

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "Please upload an image." },
        { status: 400 }
      );
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(image.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG and WebP images are supported." },
        { status: 400 }
      );
    }

    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be 10 MB or less." },
        { status: 400 }
      );
    }

    if (prompt.length < 5 || prompt.length > 2000) {
      return NextResponse.json(
        { error: "Prompt must be between 5 and 2,000 characters." },
        { status: 400 }
      );
    }

    fal.config({ credentials: key });

    const uploadedImageUrl = await fal.storage.upload(image);

    const result = await fal.subscribe("fal-ai/ovi/image-to-video", {
      input: {
        image_url: uploadedImageUrl,
        prompt,
        negative_prompt:
          negativePrompt || "jitter, bad hands, blur, distortion",
        num_inference_steps: 30,
      },
      logs: false,
    });

    const data = result.data as {
      video?: { url?: string };
    };

    if (!data.video?.url) {
      return NextResponse.json(
        { error: "AI provider did not return a video URL." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      videoUrl: data.video.url,
    });
  } catch (error) {
    console.error("Video generation error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown provider error";

    return NextResponse.json(
      { error: `Video generation failed: ${message}` },
      { status: 500 }
    );
  }
}
