import { NextResponse } from "next/server";
import getAISuggestions from "@/lib/gemini";

export const POST = async (req) => {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const summary = await getAISuggestions(topic);

    return NextResponse.json({message: "Response", summary, success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
