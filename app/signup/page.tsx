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
      <Paper elevation={0} sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: 520,
        width: '100%',
        bgcolor: '#111',
        borderRadius: 4,
        boxShadow: '0 4px 32px 0 rgba(0,0,0,0.12)',
        border: '1px solid #222',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Box mb={2} width="100%">
          <Link href="/" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 500, fontSize: 16 }}>
            &larr; Home
          </Link>
        </Box>
        <Typography variant="h4" fontWeight={800} color="#fff" mb={2} textAlign="center" letterSpacing={-1}>
          Build Your Profile
        </Typography>
        <Typography variant="body1" color="#bbb" mb={3} textAlign="center" fontSize={17}>
          We need your profile so we know what issues you can help with. Please fill this out.
        </Typography>
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} style={{ width: '100%' }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Full Name"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: '#bbb' } }}
              InputProps={{ style: { backgroundColor: '#181818', color: '#fff', borderColor: '#fff', fontWeight: 500, fontSize: 16 } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#666' },
                },
                '& .MuiInputLabel-root': { color: '#bbb' },
              }}
            />
            <TextField
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: '#bbb' } }}
              InputProps={{ style: { backgroundColor: '#181818', color: '#fff', borderColor: '#fff', fontWeight: 500, fontSize: 16 } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#666' },
                },
                '& .MuiInputLabel-root': { color: '#bbb' },
              }}
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
                InputProps={{ style: { backgroundColor: '#181818', color: '#fff', borderColor: '#fff', fontWeight: 500, fontSize: 16 } }}
                placeholder="Type a language and press Enter"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: '#444' },
                    '&:hover fieldset': { borderColor: '#666' },
                  },
                  '& .MuiInputLabel-root': { color: '#bbb' },
                }}
              />
              <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                {languages.map((lang) => (
                  <Chip
                    key={lang}
                    label={lang}
                    onDelete={() => handleDeleteLanguage(lang)}
                    sx={{ bgcolor: '#232323', color: '#fff', border: '1px solid #444', mb: 1, fontSize: 14, height: 28 }}
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
              minRows={5}
              maxRows={10}
              fullWidth
              variant="outlined"
              placeholder="Example: I'm a board-certified internal medicine physician with 10+ years of experience in primary care and global health. I speak English and Spanish, and have volunteered in rural clinics in Central America. Passionate about improving access to healthcare for underserved communities."
              InputLabelProps={{ style: { color: '#bbb' } }}
              InputProps={{ style: { backgroundColor: '#181818', color: '#fff', borderColor: '#fff', fontWeight: 500, fontSize: 16 } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#666' },
                },
                '& .MuiInputLabel-root': { color: '#bbb' },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="inherit"
              sx={{ color: '#fff', bgcolor: '#000', border: '1px solid #fff', borderRadius: 2, mt: 2, fontWeight: 700, fontSize: 18, py: 1.5, boxShadow: 'none', '&:hover': { bgcolor: '#222', borderColor: '#fff' } }}
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