// frontend/src/components/LandingChoice.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Grid, Paper } from '@mui/material';

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
          src="/images/hca_logo.png" // Ensure your logo is in public/images/hca_logo.png
          alt="HCA Logo"
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            width: '120px',
            opacity: 0.5,
            transform: 'translate(-50%, -50%)',
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}

function LandingChoice() {
  const navigate = useNavigate();

  const handleActClick = () => {
    navigate('/zipcode-entry');
  };

  const handlePrepareClick = () => {
    navigate('/prepare'); // Update this route as needed
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        width: '100%', // Full width
        height: '100vh',
        backgroundColor: '#003366', // Dark blue background for entire page
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Render the fixed background logos */}
      <LogoBackground />

      {/* Centered main box */}
      <Box
        sx={{
          width: { xs: '90%', sm: '600px' },
          backgroundColor: '#f8f8f8', // Off-white background for entry box
          border: '2px solid #FF6600', // Orange outline
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          position: 'relative', // Above background logos
          zIndex: 1,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: '#003366', fontWeight: 600, mb: 3 }}>
          HCA Emergency Response Resource
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Paper
              onClick={handlePrepareClick}
              sx={{
                height: 200,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FF6600', // Orange background
                border: '2px solid #FF6600',
                cursor: 'pointer',
                opacity: 0.9,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
              elevation={3}
            >
              <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 600 }}>
                Prepare
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              onClick={handleActClick}
              sx={{
                height: 200,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FF6600', // Orange background
                border: '2px solid #FF6600',
                cursor: 'pointer',
                opacity: 0.9,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
              elevation={3}
            >
              <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 600 }}>
                Act
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default LandingChoice;
