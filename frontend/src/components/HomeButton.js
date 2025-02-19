// frontend/src/components/HomeButton.js

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function HomeButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        position: 'fixed',
        top: 16,
        left: 16,
        zIndex: 999, // Ensure it stays on top of other content
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <img
        src="/images/hca_logo.png"  // Ensure your logo is in public/images/hca_logo.png
        alt="HCA Logo"
        style={{ width: '40px', marginRight: '8px' }}
      />
      <Typography variant="h6" sx={{ color: '#f8f8f8' }}>
        Home
      </Typography>
    </Box>
  );
}

export default HomeButton;
