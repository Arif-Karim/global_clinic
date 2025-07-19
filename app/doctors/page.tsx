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

interface Profile {
  fullname: string;
  phone: string;
  bio: string;
  languages: string[];
  createdAt?: string;
}

export default function DoctorProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);
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
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
            {profiles.map((profile, idx) => (
              <Paper key={idx} sx={{ p: 3, bgcolor: '#181818', color: '#fff', borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="#fff" mb={0.5}>
                      {profile.fullname}
                    </Typography>
                    <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                      {profile.languages?.map((lang, i) => (
                        <Chip key={i} label={lang} sx={{ bgcolor: '#333', color: '#fff', border: '1px solid #444', mb: 1 }} />
                      ))}
                    </Stack>
                  </Box>
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
                    sx={{ color: '#25D366', borderColor: '#25D366', minWidth: 0, px: 1.5, ml: 2, mt: 0.5, '&:hover': { bgcolor: '#222', borderColor: '#25D366' } }}
                    href={`https://wa.me/${profile.phone.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </Button>
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
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
