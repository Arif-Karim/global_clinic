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
      <Paper elevation={0} sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: 600,
        width: '100%',
        bgcolor: '#111',
        borderRadius: 4,
        boxShadow: '0 4px 32px 0 rgba(0,0,0,0.12)',
        border: '1px solid #222',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Typography variant="h3" fontWeight={800} color="#fff" mb={2} textAlign="center" letterSpacing={-1}>
          Volunteer your expertise for Gaza
        </Typography>
        <Typography variant="h5" fontWeight={700} color="#fff" mb={2} textAlign="center">
          Doctors in Gaza need remote advice!
        </Typography>
        <Typography variant="body1" color="#bbb" mb={3} textAlign="center" fontSize={18}>
          There are not enough doctors on the ground. As doctors are being targeted, there are even fewer specialists available. Doctors currently in Gaza are seeing medical problems that they may not have the expertise or knowledge to handle. We urgently ask you to volunteer your expertise to help the doctors in Gaza.
        </Typography>
        <Typography variant="h5" fontWeight={700} color="#fff" mb={1.5} textAlign="center">
          How will this work?
        </Typography>
        <Typography variant="body1" color="#bbb" mb={4} textAlign="center" fontSize={17}>
          Sign up as a volunteer, make your profile with your expertise, and provide your WhatsApp number. We will refer your WhatsApp number to the doctors in Gaza so they can contact you if they need your expertise.
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          sx={{ color: '#fff', bgcolor: '#000', border: '1px solid #fff', borderRadius: 2, '&:hover': { bgcolor: '#222', borderColor: '#fff' }, fontWeight: 700, fontSize: 18, py: 1.5, boxShadow: 'none', mb: 2, width: '100%' }}
          onClick={handleSignUp}
        >
          Sign up
        </Button>
        <Box mt={2} textAlign="center" width="100%">
          <Typography color="#fff" fontSize={16} mb={1} fontWeight={500}>
            If you are a doctor from Gaza, click below to find doctors to help you.
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            sx={{ fontWeight: 700, fontSize: 16, borderColor: '#fff', color: '#fff', borderRadius: 2, py: 1.2, width: '100%', '&:hover': { bgcolor: '#181818', borderColor: '#fff' } }}
            onClick={() => router.push('/doctors')}
          >
            Find Doctors
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}