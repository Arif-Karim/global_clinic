import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { user_prompt, doctors } = await req.json();

    // Build system prompt
    const system_content =
      `Here is a list of volunteer doctors: ${JSON.stringify(doctors, null, 2)}\n` +
      "In the prompt the user will provide what medical issue they are facing. Your job is to find the most relevant doctor that can help with the issue. " +
      "Reply ONLY with a JSON object in the format: { \"name\": \"Doctor Name\" }";

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano-2025-04-14",
      messages: [
        { role: "system", content: system_content },
        { role: "user", content: user_prompt }
      ],
      response_format: { type: "json_object" },
    });

    // The response will be a JSON object, e.g. { "name": "Sara Ahmed" }
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("OpenAI response content is null");
    }
    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
