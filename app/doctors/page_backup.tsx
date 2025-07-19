"use client"
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

interface Profile {
  fullname: string;
  phone: string;
  bio: string;
  languages: string[];
  timezone?: string;
  weeklySchedule?: {
    [key: string]: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
  // Legacy support for old contactHours format
  contactHours?: {
    startTime: string;
    endTime: string;
  };
  createdAt?: string;
}

// Function to check if doctor is currently available based on their contact hours
const isDoctorAvailable = (profile: Profile): boolean => {
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
      if (!daySchedule || !daySchedule.enabled || !daySchedule.startTime || !daySchedule.endTime) {
        return false; // Doctor not available on this day
      }

      const startTime = daySchedule.startTime;
      const endTime = daySchedule.endTime;

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

export default function DoctorProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProfiles() {
      setLoading(true);
      try {
        const res = await fetch('/api/profiles');
        if (res.ok) {
          const data = await res.json();
          setProfiles(Array.isArray(data) ? data.reverse() : []);
        } else {
          setProfiles([]);
        }
      } catch {
        setProfiles([]);
      }
      setLoading(false);
    }
    fetchProfiles();
  }, []);

  async function handleFindDoctor(e: React.FormEvent) {
    e.preventDefault();
    setSearching(true);
    setSearchResult(null);
    const user_prompt = query;
    try {
      const res = await fetch('/api/find-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_prompt }),
      });
      const data = await res.json();
      setSearchResult(data.name ? `Recommended doctor: ${data.name}` : data.result || data.error || 'No match found.');
    } catch (err) {
      setSearchResult('Error finding doctor.');
    }
    setSearching(false);
  }

  return (
    <Box minHeight="100vh" bgcolor="#000" p={4}>
      <Box maxWidth={800} mx="auto">
        <Box mb={3}>
          <Link href="/" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 500, fontSize: 16 }}>
            &larr; Home
          </Link>
        </Box>
        <Typography variant="h4" fontWeight={700} color="#fff" mb={3}>
          Volunteer Doctor Profiles
        </Typography>
        
        <Box mb={3}>
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyAvailable}
                onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#4caf50',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4caf50',
                  },
                }}
              />
            }
            label={
              <Typography color="#fff" fontSize={16}>
                Show only available doctors
              </Typography>
            }
          />
        </Box>
        
        <Box mb={4}>
          <Typography color="#bbb" mb={2} fontSize={16}>
            Let me know the details in the box below and I will use AI to help you find the best doctor to assist with the issue.
          </Typography>
          <Box mb={2}>
            <Typography color="#888" fontSize={15} fontStyle="italic">
              Example: "I have a 7-year-old child with a persistent high fever, cough, and difficulty breathing. The child is not responding to standard antibiotics. I suspect a complicated pneumonia or possibly tuberculosis. Is there a pediatrician or infectious disease specialist who can advise on further management and possible alternative treatments? Prefer someone that speaks Arabic."
            </Typography>
          </Box>
          <form onSubmit={handleFindDoctor} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Describe the medical issue and any language or specialty requirements..."
              style={{ padding: 12, borderRadius: 6, border: '1px solid #444', background: '#181818', color: '#fff', fontSize: 16, marginBottom: 8 }}
              required
            />
            <Button type="submit" variant="contained" color="primary" disabled={searching} sx={{ fontWeight: 600, fontSize: 16 }}>
              {searching ? 'Searching...' : 'Find a Doctor'}
            </Button>
          </form>
          {searchResult && (
            <Box mt={2} p={2} bgcolor="#181818" borderRadius={2} color="#fff" fontSize={16}>
              {searchResult}
            </Box>
          )}
        </Box>
        
        {loading ? (
          <Typography color="#bbb">Loading profiles...</Typography>
        ) : profiles.length === 0 ? (
          <Typography color="#bbb">No profiles found.</Typography>
        ) : (
          <>
            {showOnlyAvailable && (
              <Typography color="#bbb" mb={2} fontSize={14}>
                Showing {profiles.filter(p => isDoctorAvailable(p)).length} of {profiles.length} doctors currently available
              </Typography>
            )}
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
              {profiles
                .filter(profile => !showOnlyAvailable || isDoctorAvailable(profile))
                .map((profile, idx) => {
                  const isAvailable = isDoctorAvailable(profile);
                  return (
                    <Paper key={idx} sx={{ p: 3, bgcolor: '#181818', color: '#fff', borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', height: '100%', opacity: isAvailable ? 1 : 0.6 }}>
                      <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
                        <Box>
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <Typography variant="h6" fontWeight={600} color="#fff">
                              {profile.fullname}
                            </Typography>
                            <Box 
                              sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                bgcolor: isAvailable ? '#4caf50' : '#f44336' 
                              }} 
                            />
                            <Typography variant="caption" color={isAvailable ? '#4caf50' : '#f44336'} fontWeight={500}>
                              {isAvailable ? 'Available' : 'Offline'}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                            {profile.languages?.map((lang, i) => (
                              <Chip key={i} label={lang} sx={{ bgcolor: '#333', color: '#fff', border: '1px solid #444', mb: 1 }} />
                            ))}
                          </Stack>
                          {profile.weeklySchedule && profile.timezone && (
                            <Box mb={1}>
                              <Typography variant="caption" color="#888" display="block" mb={0.5}>
                                Schedule ({profile.timezone}):
                              </Typography>
                              <Box display="flex" flexWrap="wrap" gap={0.5}>
                                {Object.entries(profile.weeklySchedule)
                                  .filter(([_, schedule]) => schedule.enabled)
                                  .map(([day, schedule]) => (
                                    <Chip
                                      key={day}
                                      label={`${day.slice(0, 3).toUpperCase()}: ${schedule.startTime}-${schedule.endTime}`}
                                      size="small"
                                      sx={{ 
                                        bgcolor: '#2a2a2a', 
                                        color: '#ccc', 
                                        fontSize: '10px',
                                        height: 20
                                      }}
                                    />
                                  ))}
                              </Box>
                            </Box>
                          )}
                          {/* Legacy support for old contactHours format */}
                          {!profile.weeklySchedule && profile.contactHours && profile.timezone && (
                            <Typography variant="caption" color="#888" display="block" mb={1}>
                              Available: {profile.contactHours.startTime} - {profile.contactHours.endTime} ({profile.timezone})
                            </Typography>
                          )}
                        </Box>
                        {isAvailable ? (
                          <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
                            sx={{ 
                              color: '#25D366', 
                              borderColor: '#25D366', 
                              minWidth: 0, 
                              px: 1.5, 
                              ml: 2, 
                              mt: 0.5, 
                              '&:hover': { 
                                bgcolor: '#222', 
                                borderColor: '#25D366' 
                              }
                            }}
                            href={`https://wa.me/${profile.phone.replace(/[^\d]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            WhatsApp
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<WhatsAppIcon sx={{ color: '#666' }} />}
                            sx={{ 
                              color: '#666', 
                              borderColor: '#666', 
                              minWidth: 0, 
                              px: 1.5, 
                              ml: 2, 
                              mt: 0.5,
                              cursor: 'not-allowed'
                            }}
                            disabled
                          >
                            Offline
                          </Button>
                        )}
                      </Box>
                      <Typography variant="body2" color="#ccc" mb={1} sx={{ wordBreak: 'break-word' }}>
                        {profile.bio}
                      </Typography>
                      <Box flexGrow={1} />
                      {profile.createdAt && (
                        <Typography variant="caption" color="#666" mt={2}>
                          Joined: {new Date(profile.createdAt).toLocaleString()}
                        </Typography>
                      )}
                    </Paper>
                  );
                })}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
