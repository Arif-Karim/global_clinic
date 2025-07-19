"use client"
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Common timezones for doctors
const timezones = [
  'UTC',
  'GMT',
  'EST (UTC-5)',
  'CST (UTC-6)',
  'MST (UTC-7)',
  'PST (UTC-8)',
  'CET (UTC+1)',
  'EET (UTC+2)',
  'AST (UTC+3)',
  'GST (UTC+4)',
  'PKT (UTC+5)',
  'IST (UTC+5:30)',
  'BST (UTC+6)',
  'ICT (UTC+7)',
  'CST (UTC+8)',
  'JST (UTC+9)',
  'AEST (UTC+10)',
];

// List of countries
const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia',
  'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belarus', 'Belgium',
  'Bolivia', 'Bosnia and Herzegovina', 'Brazil', 'Bulgaria', 'Cambodia',
  'Canada', 'Chile', 'China', 'Colombia', 'Croatia', 'Czech Republic',
  'Denmark', 'Ecuador', 'Egypt', 'Estonia', 'Ethiopia', 'Finland',
  'France', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Italy', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya',
  'Kuwait', 'Latvia', 'Lebanon', 'Lithuania', 'Luxembourg', 'Malaysia',
  'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway',
  'Pakistan', 'Palestine', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
  'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'Slovakia', 'Slovenia',
  'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland',
  'Syria', 'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates',
  'United Kingdom', 'United States', 'Uruguay', 'Venezuela', 'Vietnam', 'Other'
];

// Generate time options (24-hour format)
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(time);
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

// Convert 24-hour time to 12-hour format for display
const formatTime12Hour = (time24: string) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const hour24 = parseInt(hours);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? 'pm' : 'am';
  return `${hour12}:${minutes} ${ampm}`;
};

export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullname: '',
    phone: '',
    country: '',
    bio: '',
    timezone: '',
    availabilitySlots: [] as { day: string; startTime: string; endTime: string; }[]
  });
  const [languages, setLanguages] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState('');
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({ day: '', startTime: '', endTime: '' });
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  const dayDisplayNames = {
    monday: 'Monday',
    tuesday: 'Tuesday', 
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addAvailabilitySlot = () => {
    if (newSlot.day && newSlot.startTime && newSlot.endTime) {
      setForm({
        ...form,
        availabilitySlots: [...form.availabilitySlots, { ...newSlot }]
      });
      setNewSlot({ day: '', startTime: '', endTime: '' });
      setShowAddSlot(false);
    }
  };

  const removeAvailabilitySlot = (indexToRemove: number) => {
    setForm({
      ...form,
      availabilitySlots: form.availabilitySlots.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleNewSlotChange = (field: 'day' | 'startTime' | 'endTime', value: string) => {
    setNewSlot({ ...newSlot, [field]: value });
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

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!form.fullname.trim()) {
      errors.push('Full name is required');
    }
    
    if (!form.phone.trim()) {
      errors.push('Phone number is required');
    }
    
    if (!form.country) {
      errors.push('Country is required');
    }
    
    if (languages.length === 0) {
      errors.push('At least one language is required');
    }
    
    if (!form.bio.trim()) {
      errors.push('Bio is required');
    }
    
    if (!form.timezone) {
      errors.push('Timezone is required');
    }
    
    if (form.availabilitySlots.length === 0) {
      errors.push('At least one availability slot is required');
    }
    
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Convert availability slots to the expected weeklySchedule format for the API
    const weeklySchedule: any = {};
    
    // Initialize all days as disabled
    daysOfWeek.forEach(day => {
      weeklySchedule[day] = { enabled: false, timeBlocks: [{ startTime: '', endTime: '' }] };
    });
    
    // Group slots by day
    const slotsByDay: { [key: string]: { startTime: string; endTime: string; }[] } = {};
    form.availabilitySlots.forEach(slot => {
      if (!slotsByDay[slot.day]) {
        slotsByDay[slot.day] = [];
      }
      slotsByDay[slot.day].push({ startTime: slot.startTime, endTime: slot.endTime });
    });
    
    // Set available days with their time blocks
    Object.keys(slotsByDay).forEach(day => {
      weeklySchedule[day] = {
        enabled: true,
        timeBlocks: slotsByDay[day]
      };
    });

    const payload = {
      ...form,
      languages,
      weeklySchedule, // Convert to expected format
      bio: form.bio,
    };
    
    try {
      const res = await fetch('/api/save-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setForm({ 
          fullname: '', 
          phone: '', 
          country: '',
          bio: '', 
          timezone: '', 
          availabilitySlots: []
        });
        setLanguages([]);
        setLanguageInput('');
        setFormErrors([]);
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
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#bbb' }}>Country</InputLabel>
              <Select
                name="country"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                sx={{ 
                  backgroundColor: '#222', 
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                  '& .MuiSvgIcon-root': { color: '#fff' }
                }}
              >
                {countries.map((country) => (
                  <MenuItem key={country} value={country} sx={{ color: '#000' }}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            
            <Box>
              <Typography variant="h6" color="#fff" mb={2}>
                Weekly Availability
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ color: '#bbb' }}>Timezone</InputLabel>
                <Select
                  name="timezone"
                  value={form.timezone}
                  onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                  sx={{ 
                    backgroundColor: '#222', 
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                    '& .MuiSvgIcon-root': { color: '#fff' }
                  }}
                >
                  {timezones.map((tz) => (
                    <MenuItem key={tz} value={tz} sx={{ color: '#000' }}>
                      {tz}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Current Availability Slots */}
              <Box sx={{ mb: 3 }}>
                {form.availabilitySlots.length > 0 ? (
                  <>
                    <Typography variant="body2" color="#ccc" mb={2}>
                      Your availability slots:
                    </Typography>
                    {form.availabilitySlots.map((slot, index) => (
                      <Box key={index} sx={{ 
                        mb: 1, 
                        p: 2, 
                        bgcolor: '#222', 
                        borderRadius: 1, 
                        border: '1px solid #4caf50',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <Typography color="#fff" sx={{ textTransform: 'capitalize' }}>
                          {dayDisplayNames[slot.day as keyof typeof dayDisplayNames]} {formatTime12Hour(slot.startTime)} to {formatTime12Hour(slot.endTime)}
                        </Typography>
                        <IconButton
                          onClick={() => removeAvailabilitySlot(index)}
                          size="small"
                          sx={{ 
                            color: '#f44336', 
                            bgcolor: '#333',
                            '&:hover': { bgcolor: '#444' }
                          }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </>
                ) : (
                  <Box sx={{ 
                    mb: 2, 
                    p: 2, 
                    bgcolor: '#2a1717', 
                    borderRadius: 1, 
                    border: '1px solid #f44336'
                  }}>
                    <Typography variant="body2" color="#f44336" display="flex" alignItems="center" gap={1}>
                      <AccessTimeIcon fontSize="small" />
                      No availability slots added yet. You must add at least one time slot.
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Add New Slot Button/Form */}
              {!showAddSlot ? (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setShowAddSlot(true)}
                  sx={{ 
                    color: '#4caf50', 
                    borderColor: '#4caf50',
                    mb: 2,
                    '&:hover': { 
                      bgcolor: 'rgba(76, 175, 80, 0.1)', 
                      borderColor: '#4caf50' 
                    }
                  }}
                >
                  Add Availability Slot
                </Button>
              ) : (
                <Box sx={{ mb: 3, p: 3, bgcolor: '#2a2a2a', borderRadius: 2, border: '1px solid #4caf50' }}>
                  <Typography variant="body1" color="#fff" mb={2}>
                    Add New Availability Slot
                  </Typography>
                  
                  <Box display="flex" flexDirection="column" gap={2}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: '#bbb' }}>Day</InputLabel>
                      <Select
                        value={newSlot.day}
                        onChange={(e) => handleNewSlotChange('day', e.target.value)}
                        sx={{ 
                          backgroundColor: '#333', 
                          color: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                          '& .MuiSvgIcon-root': { color: '#fff' }
                        }}
                      >
                        {daysOfWeek.map((day) => (
                          <MenuItem key={day} value={day} sx={{ color: '#000' }}>
                            {dayDisplayNames[day as keyof typeof dayDisplayNames]}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <Box display="flex" gap={2}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: '#bbb' }}>Start Time</InputLabel>
                        <Select
                          value={newSlot.startTime}
                          onChange={(e) => handleNewSlotChange('startTime', e.target.value)}
                          sx={{ 
                            backgroundColor: '#333', 
                            color: '#fff',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                            '& .MuiSvgIcon-root': { color: '#fff' }
                          }}
                        >
                          {timeOptions.map((time) => (
                            <MenuItem key={time} value={time} sx={{ color: '#000' }}>
                              {formatTime12Hour(time)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: '#bbb' }}>End Time</InputLabel>
                        <Select
                          value={newSlot.endTime}
                          onChange={(e) => handleNewSlotChange('endTime', e.target.value)}
                          sx={{ 
                            backgroundColor: '#333', 
                            color: '#fff',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                            '& .MuiSvgIcon-root': { color: '#fff' }
                          }}
                        >
                          {timeOptions.map((time) => (
                            <MenuItem key={time} value={time} sx={{ color: '#000' }}>
                              {formatTime12Hour(time)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    
                    <Box display="flex" gap={2} mt={1}>
                      <Button
                        variant="contained"
                        onClick={addAvailabilitySlot}
                        disabled={!newSlot.day || !newSlot.startTime || !newSlot.endTime}
                        sx={{ 
                          bgcolor: '#4caf50', 
                          '&:hover': { bgcolor: '#45a049' },
                          '&:disabled': { bgcolor: '#666' }
                        }}
                      >
                        Add Slot
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setShowAddSlot(false);
                          setNewSlot({ day: '', startTime: '', endTime: '' });
                        }}
                        sx={{ 
                          color: '#fff', 
                          borderColor: '#666',
                          '&:hover': { 
                            bgcolor: 'rgba(255, 255, 255, 0.1)', 
                            borderColor: '#fff' 
                          }
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Form Validation Errors */}
            {formErrors.length > 0 && (
              <Box sx={{ 
                mb: 2, 
                p: 2, 
                bgcolor: '#2a1717', 
                borderRadius: 1, 
                border: '1px solid #f44336'
              }}>
                <Typography variant="body2" color="#f44336" fontWeight={600} mb={1}>
                  Please fix the following errors:
                </Typography>
                {formErrors.map((error, index) => (
                  <Typography key={index} variant="body2" color="#f44336" sx={{ ml: 1 }}>
                    • {error}
                  </Typography>
                ))}
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              color="inherit"
              disabled={formErrors.length > 0 && formErrors.some(error => error.includes('required'))}
              sx={{ 
                color: '#fff', 
                bgcolor: '#000', 
                border: '1px solid #fff', 
                mt: 2, 
                '&:hover': { bgcolor: '#222' },
                '&:disabled': { bgcolor: '#666', color: '#999', border: '1px solid #666' }
              }}
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