"use client"
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullname: '',
    phone: '',
    bio: '',
  });
  const [languages, setLanguages] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLanguageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLanguageInput(e.target.value);
  };

  const handleAddLanguage = () => {
    const trimmed = languageInput.trim();
    if (trimmed && !languages.includes(trimmed)) {
      setLanguages([...languages, trimmed]);
    }
    setLanguageInput('');
  };

  const handleLanguageKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLanguage();
    }
  };

  const handleDeleteLanguage = (langToDelete: string) => {
    setLanguages(languages.filter(lang => lang !== langToDelete));
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      languages,
      bio: form.bio,
    };
    try {
      const res = await fetch('/api/save-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setForm({ fullname: '', phone: '', bio: '' });
        setLanguages([]);
        setLanguageInput('');
      } else {
        const data = await res.json();
      }
    } catch (err) {
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#000"
    >
      <Paper elevation={1} sx={{ p: 4, maxWidth: 480, width: '100%', bgcolor: '#181818', boxShadow: '0 2px 16px rgba(0,0,0,0.5)' }}>
        <Box mb={2}>
          <Link href="/" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 500, fontSize: 16 }}>
            &larr; Home
          </Link>
        </Box>
        <Typography variant="h4" fontWeight={600} gutterBottom color="#fff">
          Build Profile
        </Typography>
        <Typography variant="body1" color="#fff" mb={3}>
          We need your profile so we know what issues you can help with. Please fill this out.
        </Typography>
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Full Name"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: '#bbb' } }}
              InputProps={{ style: { backgroundColor: '#222', color: '#fff', borderColor: '#fff' } }}
            />
            <TextField
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: '#bbb' } }}
              InputProps={{ style: { backgroundColor: '#222', color: '#fff', borderColor: '#fff' } }}
            />
            <Box>
              <TextField
                label="Add Language"
                value={languageInput}
                onChange={handleLanguageInputChange}
                onKeyDown={handleLanguageKeyDown}
                variant="outlined"
                fullWidth
                InputLabelProps={{ style: { color: '#bbb' } }}
                InputProps={{ style: { backgroundColor: '#222', color: '#fff', borderColor: '#fff' } }}
                placeholder="Type a language and press Enter"
              />
              <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                {languages.map((lang) => (
                  <Chip
                    key={lang}
                    label={lang}
                    onDelete={() => handleDeleteLanguage(lang)}
                    sx={{ bgcolor: '#333', color: '#fff', border: '1px solid #444', mb: 1 }}
                  />
                ))}
              </Stack>
            </Box>
            <TextField
              label="Your Bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              placeholder="Please fill in with your bio"
              InputLabelProps={{ style: { color: '#bbb' } }}
              InputProps={{ style: { backgroundColor: '#222', color: '#fff', borderColor: '#fff' } }}
            />
            <Button
              type="submit"
              variant="contained"
              color="inherit"
              sx={{ color: '#fff', bgcolor: '#000', border: '1px solid #fff', mt: 2, '&:hover': { bgcolor: '#222' } }}
              fullWidth
            >
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}