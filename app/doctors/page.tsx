"use client"
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Link from 'next/link';
import TextField from '@mui/material/TextField';
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
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
    setMatchedProfile(null);
    const user_prompt = query;
    try {
      const res = await fetch('/api/find-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_prompt, doctors: profiles }),
      });
      const data = await res.json();
      if (data.name) {
        setSearchResult(null);
        const found = profiles.find(p => p.fullname.toLowerCase() === data.name.toLowerCase());
        setMatchedProfile(found || null);
      } else {
        setSearchResult(data.result || data.error || 'No match found.');
        setMatchedProfile(null);
      }
    } catch (err) {
      setSearchResult('Error finding doctor.');
      setMatchedProfile(null);
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
        <Paper elevation={0} sx={{
          p: { xs: 2, sm: 4 },
          bgcolor: '#111',
          borderRadius: 4,
          boxShadow: '0 4px 32px 0 rgba(0,0,0,0.12)',
          border: '1px solid #222',
          mb: 4,
        }}>
          <Typography variant="h4" fontWeight={800} color="#fff" mb={3} textAlign="center" letterSpacing={-1}>
            Volunteer Doctor Profiles
          </Typography>
          <Typography color="#bbb" mb={2} fontSize={16} textAlign="left">
            Let me know the details in the box below and I will use AI to help you find the best doctor to assist with the issue.
          </Typography>
          <Box mb={2}>
            <Typography color="#888" fontSize={15} fontStyle="italic" textAlign="left">
              Describe the medical issue and any language or specialty requirements...
            </Typography>
          </Box>
          <form onSubmit={handleFindDoctor} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <TextField
              inputRef={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Example: “I have a 7-year-old child with a persistent high fever, cough, and difficulty breathing. The child is not responding to standard antibiotics. I suspect a complicated pneumonia or possibly tuberculosis. Is there a pediatrician or infectious disease specialist who can advise on further management and possible alternative treatments? Prefer someone that speaks Arabic.”"
              multiline
              minRows={3}
              maxRows={10}
              fullWidth
              required
              variant="outlined"
              sx={{
                background: '#181818',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: '#444' },
                '&:hover fieldset': { borderColor: '#666' },
                },
                '& .MuiInputLabel-root': { color: '#bbb' },
                mb: 1,
              }}
              InputProps={{
                style: { fontSize: 16, padding: 12 },
              }}
            />
            <Button type="submit" variant="contained" color="inherit" disabled={searching} sx={{ fontWeight: 700, fontSize: 16, bgcolor: '#000', color: '#fff', border: '1px solid #fff', borderRadius: 2, '&:hover': { bgcolor: '#222', borderColor: '#fff' } }}>
              {searching ? 'Searching...' : 'Find a Doctor'}
            </Button>
          </form>
          {matchedProfile && (
            <Box mb={3} mt={4}>
              <Paper sx={{
                p: 0,
                bgcolor: '#151515',
                color: '#fff',
                borderRadius: 4,
                boxShadow: '0 6px 32px 0 rgba(0,0,0,0.18)',
                border: '1.5px solid #232323',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
                minHeight: 270,
              }}>
                <Box px={3} pt={3} pb={1.5}>
                  <Typography variant="h6" fontWeight={700} color="#fff" mb={0.5} sx={{ fontSize: 22, letterSpacing: -0.5 }}>
                    {matchedProfile.fullname}
                  </Typography>
                  <Stack direction="row" spacing={1} mb={1} flexWrap="nowrap" sx={{ overflowX: 'auto', pb: 0.5 }}>
                    {matchedProfile.languages?.map((lang, i) => (
                      <Chip key={i} label={lang} sx={{ bgcolor: '#232323', color: '#fff', border: '1px solid #444', fontSize: 13, height: 26, minWidth: 60 }} />
                    ))}
                  </Stack>
                </Box>
                <Box sx={{ borderBottom: '1px solid #222', mx: 3 }} />
                <Box px={3} py={2} flexGrow={1} display="flex" flexDirection="column">
                  <Typography variant="body2" color="#ccc" mb={1} sx={{ wordBreak: 'break-word', minHeight: 48, fontSize: 15 }}>
                    {matchedProfile.bio}
                  </Typography>
                  <Box flexGrow={1} />
                </Box>
                <Box px={3} pb={2}>
                  <Button
                    variant="outlined"
                    color="success"
                    size="medium"
                    startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
                    sx={{ color: '#25D366', borderColor: '#25D366', fontWeight: 700, width: '100%', borderRadius: 2, '&:hover': { bgcolor: '#181818', borderColor: '#25D366' } }}
                    href={`https://wa.me/${matchedProfile.phone.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </Button>
                </Box>
              </Paper>
            </Box>
          )}
          {searchResult && (
            <Box mt={2} p={2} bgcolor="#181818" borderRadius={2} color="#fff" fontSize={16}>
              {searchResult}
            </Box>
          )}
        </Paper>
        {loading ? (
          <Typography color="#bbb">Loading profiles...</Typography>
        ) : profiles.length === 0 ? (
          <Typography color="#bbb">No profiles found.</Typography>
        ) : (
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
            {profiles.map((profile, idx) => (
              <Paper key={idx} sx={{
                p: 0,
                bgcolor: '#151515',
                color: '#fff',
                borderRadius: 4,
                boxShadow: '0 6px 32px 0 rgba(0,0,0,0.18)',
                border: '1.5px solid #232323',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
                minHeight: 270,
              }}>
                <Box px={3} pt={3} pb={1.5}>
                  <Typography variant="h6" fontWeight={700} color="#fff" mb={0.5} sx={{ fontSize: 22, letterSpacing: -0.5 }}>
                    {profile.fullname}
                  </Typography>
                  <Stack direction="row" spacing={1} mb={1} flexWrap="nowrap" sx={{ overflowX: 'auto', pb: 0.5 }}>
                    {profile.languages?.map((lang, i) => (
                      <Chip key={i} label={lang} sx={{ bgcolor: '#232323', color: '#fff', border: '1px solid #444', fontSize: 13, height: 26, minWidth: 60 }} />
                    ))}
                  </Stack>
                </Box>
                <Box sx={{ borderBottom: '1px solid #222', mx: 3 }} />
                <Box px={3} py={2} flexGrow={1} display="flex" flexDirection="column">
                  <Typography variant="body2" color="#ccc" mb={1} sx={{ wordBreak: 'break-word', minHeight: 48, fontSize: 15 }}>
                    {profile.bio}
                  </Typography>
                  <Box flexGrow={1} />
                </Box>
                <Box px={3} pb={2}>
                  <Button
                    variant="outlined"
                    color="success"
                    size="medium"
                    startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
                    sx={{ color: '#25D366', borderColor: '#25D366', fontWeight: 700, width: '100%', borderRadius: 2, '&:hover': { bgcolor: '#181818', borderColor: '#25D366' } }}
                    href={`https://wa.me/${profile.phone.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
