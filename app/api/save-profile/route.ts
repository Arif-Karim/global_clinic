import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    console.log('[API] Received POST request to /api/save-profile');
    const data = await req.json();
    console.log('[API] Parsed JSON body:', data);
    const filePath = path.join(process.cwd(), 'profiles.json');
    let profiles = [];
    try {
      const file = await fs.readFile(filePath, 'utf-8');
      profiles = JSON.parse(file);
      console.log('[API] Loaded existing profiles:', profiles.length);
    } catch (e) {
      console.log('[API] profiles.json not found or invalid, starting new file. Error:', e);
      profiles = [];
    }
    profiles.push({ ...data, createdAt: new Date().toISOString() });
    await fs.writeFile(filePath, JSON.stringify(profiles, null, 2));
    console.log('[API] Profile saved successfully. Total profiles:', profiles.length);
    return NextResponse.json({ success: true });
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    console.error('[API] Error saving profile:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
