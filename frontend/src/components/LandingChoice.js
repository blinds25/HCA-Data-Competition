// frontend/src/components/LandingChoice.js

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Fade,
} from "@mui/material";

// LogoBackground component: displays fixed-position logos throughout the background.
function LogoBackground() {
  // Original base positions
  const basePositions = [
    { top: "10%", left: "20%" },
    { top: "10%", left: "80%" },
    { top: "30%", left: "50%" },
    { top: "50%", left: "20%" },
    { top: "50%", left: "80%" },
    { top: "70%", left: "40%" },
    { top: "70%", left: "70%" },
    { top: "90%", left: "30%" },
    { top: "90%", left: "70%" },
  ];

  // Extra positions:
  const extraPositions = [
    // Three near the left edge
    { top: "20%", left: "5%" },
    { top: "50%", left: "8%" },
    { top: "80%", left: "4%" },
    // Three near the right edge
    { top: "25%", left: "95%" },
    { top: "55%", left: "92%" },
    { top: "85%", left: "96%" },
    // Two near the top middle
    { top: "8%", left: "35%" },
    { top: "8%", left: "65%" },
    // One near the bottom middle
    { top: "93%", left: "50%" },
  ];

  const positions = [...basePositions, ...extraPositions];

  return (
    <>
      {positions.map((pos, index) => (
        <img
          key={index}
          src="/images/hca_logo.png"
          alt="HCA Logo"
          style={{
            position: "absolute",
            top: pos.top,
            left: pos.left,
            width: "120px",
            opacity: 0.3, // Reduced opacity for better contrast with content
            transform: "translate(-50%, -50%)",
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}

function LandingChoice() {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = React.useState(false);

  const handleActClick = () => {
    navigate("/zipcode-entry");
  };

  const handlePrepareClick = () => {
    // Show dashboard options with animation
    setShowOptions(true);
  };

  const handlePowerBIDashboardClick = () => {
    navigate("/prepare");
  };

  const handleLocalDashboardClick = () => {
    navigate("/local-dashboard");
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#121f36", // Darker blue background for better contrast
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden", // Prevent logo overflow
      }}
    >
      {/* Render the fixed background logos */}
      <LogoBackground />

      {/* Centered main box */}
      <Box
        sx={{
          width: { xs: "95%", sm: "650px" },
          backgroundColor: "#1a2942", // Darker panel background for better contrast
          borderRadius: 3,
          p: 5,
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)", // Enhanced shadow for depth
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            color: "#ffffff",
            fontWeight: 700,
            mb: 4,
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)", // Text shadow for better visibility
          }}
        >
          HCA Emergency Response
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Paper
              onClick={handlePrepareClick}
              sx={{
                height: 220,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#FF6600",
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 20px rgba(255, 102, 0, 0.3)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 25px rgba(255, 102, 0, 0.4)",
                },
              }}
              elevation={6}
            >
              <Typography
                variant="h4"
                sx={{
                  color: "#ffffff",
                  fontWeight: 700,
                  textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
                }}
              >
                Prepare
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#ffffff",
                  mt: 1,
                  opacity: 0.9,
                }}
              >
                View analytics and plan ahead
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              onClick={handleActClick}
              sx={{
                height: 220,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#FF6600",
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 20px rgba(255, 102, 0, 0.3)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 25px rgba(255, 102, 0, 0.4)",
                },
              }}
              elevation={6}
            >
              <Typography
                variant="h4"
                sx={{
                  color: "#ffffff",
                  fontWeight: 700,
                  textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
                }}
              >
                Act
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#ffffff",
                  mt: 1,
                  opacity: 0.9,
                }}
              >
                Respond to emergency situations
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Dashboard Options (Hidden by default) */}
        <Fade in={showOptions}>
          <Box
            sx={{
              mt: 4,
              backgroundColor: "rgba(26, 41, 66, 0.9)",
              p: 3,
              borderRadius: 2,
              borderLeft: "4px solid #FF6600",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: "#ffffff", fontWeight: 600, mb: 3 }}
            >
              Select Dashboard Type
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Button
                  onClick={handlePowerBIDashboardClick}
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#1f3154",
                    color: "#ffffff",
                    p: 2,
                    borderRadius: 2,
                    height: "100%",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#2a4270",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      PowerBI Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Interactive data visualization
                    </Typography>
                  </Box>
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  onClick={handleLocalDashboardClick}
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#1f3154",
                    color: "#ffffff",
                    p: 2,
                    borderRadius: 2,
                    height: "100%",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#2a4270",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Interactive Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Using real facility data
                    </Typography>
                  </Box>
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Box>
    </Container>
  );
}

export default LandingChoice;
