"use client"
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const handleSignUp = () => {
    router.push('/signup');
  };
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#000"
    >
      <Paper elevation={1} sx={{ p: 4, maxWidth: 600, width: '100%', bgcolor: '#181818', boxShadow: '0 2px 16px rgba(0,0,0,0.5)' }}>
        <Typography variant="h3" fontWeight={700} gutterBottom color="#fff" mb={2}>
          Volunteer your expertise for Gaza
        </Typography>
        <Typography variant="h5" fontWeight={600} color="#fff" mb={2}>
          Doctors in Gaza need remote advice!
        </Typography>
        <Typography variant="body1" color="#ccc" mb={3}>
          There are not enough doctors on the ground. As doctors are being targeted, there are even fewer specialists available. Doctors currently in Gaza are seeing medical problems that they may not have the expertise or knowledge to handle. We urgently ask you to volunteer your expertise to help the doctors in Gaza.
        </Typography>
        <Typography variant="h5" fontWeight={600} color="#fff" mb={1.5}>
          How will this work?
        </Typography>
        <Typography variant="body1" color="#ccc" mb={4}>
          Sign up as a volunteer, make your profile with your expertise, and provide your WhatsApp number. We will refer your WhatsApp number to the doctors in Gaza so they can contact you if they need your expertise.
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          sx={{ color: '#fff', bgcolor: '#000', border: '1px solid #fff', '&:hover': { bgcolor: '#222' }, fontWeight: 600, fontSize: 18 }}
          onClick={handleSignUp}
          fullWidth
        >
          Sign up
        </Button>
      </Paper>
    </Box>
  );
}