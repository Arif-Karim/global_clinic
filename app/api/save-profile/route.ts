import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { fullname, phone, bio, languages } = data;
    const { error } = await supabase.from("profiles").insert([
      {
        fullname,
        phone,
        bio,
        languages,
      },
    ]);
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
