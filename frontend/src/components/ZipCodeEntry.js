import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

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
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Enter Your Zip Code
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Zip Code"
          value={zipCode}
          onChange={(e) => { setZipCode(e.target.value); setError(''); }}
          inputProps={{ maxLength: 5 }}
          error={!!error}
          helperText={error}
        />
        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>
    </Container>
  );
}

export default ZipCodeEntry;
