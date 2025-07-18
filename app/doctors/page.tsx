"use client"
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
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
