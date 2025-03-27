// frontend/src/components/ZipCodeEntry.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Grid,
  IconButton,
  Zoom,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";

// Component for suggesting nearby facilities
function NearbySuggestions({ suggestions, onSelect, loading }) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <CircularProgress size={30} sx={{ color: "#FF6600" }} />
      </Box>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        mt: 3,
        backgroundColor: "rgba(26, 41, 66, 0.8)",
        borderRadius: 2,
        p: 2,
        borderLeft: "4px solid #FF6600",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, color: "#ffffff", fontWeight: 600 }}
      >
        Nearby Facilities
      </Typography>
      <Grid container spacing={2}>
        {suggestions.map((facility, index) => (
          <Grid item xs={12} key={index}>
            <Paper
              onClick={() => onSelect(facility)}
              sx={{
                p: 2,
                backgroundColor: "#1f3154",
                cursor: "pointer",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                "&:hover": {
                  backgroundColor: "#2a4270",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
                },
              }}
            >
              <LocationOnIcon sx={{ mr: 1, color: "#FF6600" }} />
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#ffffff", fontWeight: 500 }}
                >
                  {facility.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#b0bbd4" }}>
                  {facility.location} - {Math.round(facility.distance)} miles
                  away
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function ZipCodeEntry() {
  const navigate = useNavigate();
  const [zipCode, setZipCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  const handleBackClick = () => {
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!zipCode || !/^\d{5}(-\d{4})?$/.test(zipCode)) {
      setError("Please enter a valid 5-digit ZIP code");
      return;
    }

    setError("");
    setLoading(true);

    // Simulate API call to find nearby facilities
    setTimeout(() => {
      // Dummy data - would come from API
      const dummyFacilities = [
        {
          id: "fac1",
          name: "Memorial Hospital",
          location: "Charleston, SC",
          distance: 3.2,
        },
        {
          id: "fac2",
          name: "University Medical Center",
          location: "Charleston, SC",
          distance: 5.7,
        },
        {
          id: "fac3",
          name: "East Cooper Medical Center",
          location: "Mount Pleasant, SC",
          distance: 9.4,
        },
      ];

      setSuggestions(dummyFacilities);
      setLoading(false);
    }, 1500);
  };

  const handleFacilitySelect = (facility) => {
    // Navigate to data dashboard with selected facility
    navigate(`/dashboard`, { state: { zipCode: zipCode } });
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#121f36",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <IconButton
        onClick={handleBackClick}
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "#ffffff",
          backgroundColor: "rgba(26, 41, 66, 0.6)",
          "&:hover": {
            backgroundColor: "rgba(26, 41, 66, 0.8)",
          },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Zoom in={true} timeout={500}>
        <Box
          sx={{
            width: { xs: "95%", sm: "550px" },
            backgroundColor: "#1a2942",
            borderRadius: 3,
            p: 5,
            textAlign: "center",
            position: "relative",
            zIndex: 1,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: "#ffffff",
              fontWeight: 700,
              mb: 4,
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            Find Nearby Facilities
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              label="Enter ZIP Code"
              variant="outlined"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              error={!!error}
              helperText={error}
              placeholder="e.g., 29401"
              InputProps={{
                endAdornment: <SearchIcon sx={{ color: "#FF6600" }} />,
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "#ffffff",
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FF6600",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#b0bbd4",
                },
                "& .MuiFormHelperText-root": {
                  color: "#ff5252",
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#FF6600",
                color: "#ffffff",
                fontWeight: 600,
                py: 1.5,
                px: 4,
                borderRadius: 2,
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(255, 102, 0, 0.3)",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#e55c00",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(255, 102, 0, 0.4)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#ffffff" }} />
              ) : (
                "Search"
              )}
            </Button>
          </Box>

          <NearbySuggestions
            suggestions={suggestions}
            onSelect={handleFacilitySelect}
            loading={loading}
          />
        </Box>
      </Zoom>
    </Container>
  );
}

export default ZipCodeEntry;
