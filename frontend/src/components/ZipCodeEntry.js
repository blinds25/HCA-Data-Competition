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
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";

// Component for displaying exact zip code facilities
function ExactMatchFacilities({ matches, onSelect, loading, zipCode }) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <CircularProgress size={30} sx={{ color: "#FF6600" }} />
      </Box>
    );
  }

  if (!matches || matches.length === 0) {
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
        <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 600 }}>
          No Exact Matches
        </Typography>
        <Typography variant="body2" sx={{ color: "#b0bbd4", mt: 1 }}>
          No facilities found with exact ZIP code {zipCode}.
          <br />
          You can still continue to see nearby facilities.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            onClick={() => onSelect(null)}
            variant="contained"
            sx={{
              backgroundColor: "#FF6600",
              color: "#ffffff",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#e55c00",
              },
            }}
          >
            Continue to Nearby Facilities
          </Button>
        </Box>
      </Box>
    );
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
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <CheckCircleIcon sx={{ color: "#FF6600", mr: 1 }} />
        <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 600 }}>
          Exact Matches for ZIP {zipCode}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {matches.map((facility, index) => (
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
                  {facility.city}, {facility.state} {facility.zip_code}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 2 }} />

      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <InfoIcon sx={{ fontSize: 16, color: "#b0bbd4", mr: 1 }} />
        <Typography variant="body2" sx={{ color: "#b0bbd4" }}>
          Don't see what you're looking for? You can also view all facilities in
          the area:
        </Typography>
      </Box>

      <Button
        onClick={() => onSelect(null)}
        variant="outlined"
        fullWidth
        sx={{
          mt: 1,
          color: "#b0bbd4",
          borderColor: "rgba(176, 187, 212, 0.3)",
          "&:hover": {
            borderColor: "#b0bbd4",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          },
        }}
      >
        View All Nearby Facilities
      </Button>
    </Box>
  );
}

function ZipCodeEntry() {
  const navigate = useNavigate();
  const [zipCode, setZipCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [exactMatches, setExactMatches] = useState([]);
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

    // Make a real API call to get facilities with the exact zip code
    fetch(`http://localhost:8000/api/data/?zip_code=${zipCode}&radius=0`)
      .then((res) => res.json())
      .then((data) => {
        // Extract unique facilities from the local data (exact zip matches)
        const facilitiesMap = {};

        if (data.local && data.local.length > 0) {
          data.local.forEach((person) => {
            if (person.location && !facilitiesMap[person.location]) {
              facilitiesMap[person.location] = {
                id: person.id,
                name: person.location,
                city: person.city,
                state: person.state,
                zip_code: person.zip_code,
                latitude: person.latitude,
                longitude: person.longitude,
              };
            }
          });

          // Convert map to array
          const uniqueFacilities = Object.values(facilitiesMap);
          setExactMatches(uniqueFacilities);
        } else {
          setExactMatches([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching facilities:", err);
        setLoading(false);
        setError("Error connecting to the server. Please try again.");
      });
  };

  const handleFacilitySelect = (facility) => {
    // Navigate to data dashboard with selected facility or just the zip code
    navigate(`/dashboard`, {
      state: {
        zipCode: zipCode,
        // If we have a selected facility, pass its data
        selectedFacility: facility
          ? {
              name: facility.name,
              city: facility.city,
              state: facility.state,
              zip_code: facility.zip_code,
            }
          : null,
      },
    });
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
            Find Facilities by ZIP Code
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

          <ExactMatchFacilities
            matches={exactMatches}
            onSelect={handleFacilitySelect}
            loading={loading}
            zipCode={zipCode}
          />
        </Box>
      </Zoom>
    </Container>
  );
}

export default ZipCodeEntry;
