import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import fs from 'fs/promises';
import path from 'path';

// Function to check if doctor is currently available based on their contact hours
const isDoctorAvailable = (profile: any): boolean => {
  if (!profile.timezone) {
    return true; // If no timezone specified, consider always available
  }

  try {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-GB', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: getTimezoneFromString(profile.timezone)
    });

    // Get current day of week (0 = Sunday, 1 = Monday, etc.)
    const currentDay = now.toLocaleDateString('en-US', { 
      weekday: 'long',
      timeZone: getTimezoneFromString(profile.timezone)
    }).toLowerCase();

    // Check new weekly schedule format
    if (profile.weeklySchedule) {
      const daySchedule = profile.weeklySchedule[currentDay];
      if (!daySchedule || !daySchedule.enabled) {
        return false; // Doctor not available on this day
      }

      // Check multiple time blocks if available
      if (daySchedule.timeBlocks && daySchedule.timeBlocks.length > 0) {
        return daySchedule.timeBlocks.some((timeBlock: any) => {
          if (!timeBlock.startTime || !timeBlock.endTime) return false;
          
          const currentMinutes = timeToMinutes(currentTime);
          const startMinutes = timeToMinutes(timeBlock.startTime);
          const endMinutes = timeToMinutes(timeBlock.endTime);

          // Handle overnight shifts (e.g., 22:00 to 06:00)
          if (startMinutes > endMinutes) {
            return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
          } else {
            return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
          }
        });
      }

      // Legacy support for single startTime/endTime in weeklySchedule
      if (daySchedule.startTime && daySchedule.endTime) {
        const startTime = daySchedule.startTime;
        const endTime = daySchedule.endTime;

        const currentMinutes = timeToMinutes(currentTime);
        const startMinutes = timeToMinutes(startTime);
        const endMinutes = timeToMinutes(endTime);

        // Handle overnight shifts (e.g., 22:00 to 06:00)
        if (startMinutes > endMinutes) {
          return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
        } else {
          return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
        }
      }

      return false; // No valid time blocks found
    }

    // Legacy support for old contactHours format
    if (profile.contactHours && profile.contactHours.startTime && profile.contactHours.endTime) {
      const startTime = profile.contactHours.startTime;
      const endTime = profile.contactHours.endTime;

      // Convert times to minutes for comparison
      const currentMinutes = timeToMinutes(currentTime);
      const startMinutes = timeToMinutes(startTime);
      const endMinutes = timeToMinutes(endTime);

      // Handle overnight shifts (e.g., 22:00 to 06:00)
      if (startMinutes > endMinutes) {
        return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
      } else {
        return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
      }
    }

    return true; // If no schedule specified, consider always available
  } catch (error) {
    console.error('Error checking doctor availability:', error);
    return true; // Default to available if there's an error
  }
};

// Helper function to convert timezone string to IANA timezone
const getTimezoneFromString = (timezoneStr: string): string => {
  const timezoneMap: { [key: string]: string } = {
    'UTC': 'UTC',
    'GMT': 'GMT',
    'EST (UTC-5)': 'America/New_York',
    'CST (UTC-6)': 'America/Chicago',
    'MST (UTC-7)': 'America/Denver',
    'PST (UTC-8)': 'America/Los_Angeles',
    'CET (UTC+1)': 'Europe/Berlin',
    'EET (UTC+2)': 'Europe/Athens',
    'AST (UTC+3)': 'Asia/Riyadh',
    'GST (UTC+4)': 'Asia/Dubai',
    'PKT (UTC+5)': 'Asia/Karachi',
    'IST (UTC+5:30)': 'Asia/Kolkata',
    'BST (UTC+6)': 'Asia/Dhaka',
    'ICT (UTC+7)': 'Asia/Bangkok',
    'CST (UTC+8)': 'Asia/Shanghai',
    'JST (UTC+9)': 'Asia/Tokyo',
    'AEST (UTC+10)': 'Australia/Sydney',
  };
  return timezoneMap[timezoneStr] || 'UTC';
};

// Helper function to convert time string (HH:MM) to minutes
const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

export async function POST(req: NextRequest) {
  try {
    const { user_prompt } = await req.json();
    // Load doctor data
    const filePath = path.join(process.cwd(), 'profiles.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const allDoctors = JSON.parse(data);

    // Filter to only available doctors
    const availableDoctors = allDoctors.filter((doctor: any) => isDoctorAvailable(doctor));

    if (availableDoctors.length === 0) {
      return NextResponse.json({ 
        error: "No doctors are currently available. Please try again during their contact hours." 
      });
    }

    // Build system prompt with only available doctors
    const system_content =
      `Here is a list of currently available volunteer doctors: ${JSON.stringify(availableDoctors, null, 2)}\n` +
      "In the prompt the user will provide what medical issue they are facing. Your job is to find the most relevant doctor that can help with the issue. " +
      "IMPORTANT: Only recommend doctors from the list provided above - these are the doctors currently available. " +
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
