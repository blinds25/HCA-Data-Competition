// frontend/src/components/ZipCodeEntry.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import HomeButton from './HomeButton';

// LogoBackground component: displays fixed-position logos throughout the background.
function LogoBackground() {
  // Original base positions
  const basePositions = [
    { top: '10%', left: '20%' },
    { top: '10%', left: '80%' },
    { top: '30%', left: '50%' },
    { top: '50%', left: '20%' },
    { top: '50%', left: '80%' },
    { top: '70%', left: '40%' },
    { top: '70%', left: '70%' },
    { top: '90%', left: '30%' },
    { top: '90%', left: '70%' },
  ];

  // Extra positions:
  const extraPositions = [
    // Three near the left edge
    { top: '20%', left: '5%' },
    { top: '50%', left: '8%' },
    { top: '80%', left: '4%' },
    // Three near the right edge
    { top: '25%', left: '95%' },
    { top: '55%', left: '92%' },
    { top: '85%', left: '96%' },
    // Two near the top middle
    { top: '8%', left: '35%' },
    { top: '8%', left: '65%' },
    // One near the bottom middle
    { top: '93%', left: '50%' },
  ];

  const positions = [...basePositions, ...extraPositions];

  return (
    <>
      {positions.map((pos, index) => (
        <img
          key={index}
          src="/images/hca_logo.png" // Ensure your logo is at public/images/hca_logo.png
          alt="HCA Logo"
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            width: '120px',       // Adjust size as needed
            opacity: 0.5,         // Adjust opacity as desired
            transform: 'translate(-50%, -50%)',
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}

function ZipCodeEntry() {
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (zipCode.length !== 5 || isNaN(zipCode)) {
      setError('Please enter a valid 5-digit zip code.');
      return;
    }
    navigate('/dashboard', { state: { zipCode } });
  };

  return (
    <Container 
      maxWidth="xl"
      sx={{
        width: '100%', // Full width
        height: '100vh',
        backgroundColor: '#003366', // Dark blue background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <HomeButton />
      {/* Render the same fixed-position logo background as LandingChoice */}
      <LogoBackground />
      
      {/* Centered entry box */}
      <Box 
        sx={{
          width: { xs: '90%', sm: '500px' },
          backgroundColor: '#f8f8f8', // Off-white background for entry box
          border: '2px solid #FF6600', // Orange outline
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          position: 'relative', // Sits above the background logos
          zIndex: 1,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
          HCA Emergency Contact System
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ color: '#003366' }}>
          Enter your zipcode to view affected facilities
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <TextField
            variant="outlined"
            fullWidth
            label="Zip Code"
            value={zipCode}
            onChange={(e) => {
              setZipCode(e.target.value);
              setError('');
            }}
            inputProps={{ maxLength: 5 }}
            error={!!error}
            helperText={error}
            InputProps={{
              sx: { backgroundColor: '#ffffff' },
            }}
            InputLabelProps={{
              sx: {
                color: '#003366',
                '&.Mui-focused': { color: '#003366' },
              },
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#003366',
                },
                '&:hover fieldset': {
                  borderColor: '#003366',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#003366',
                },
                '& input': {
                  color: '#000000',
                },
              },
            }}
          />
          <Button type="submit" fullWidth variant="contained" color="secondary" sx={{ mt: 2 }}>
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ZipCodeEntry;
