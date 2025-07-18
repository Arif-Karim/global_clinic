import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'profiles.json');
    const file = await fs.readFile(filePath, 'utf-8');
    const profiles = JSON.parse(file);
    return NextResponse.json(profiles);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}
