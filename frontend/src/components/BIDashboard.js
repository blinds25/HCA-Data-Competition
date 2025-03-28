import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Fade,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

function BIDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate dashboard loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#121f36",
        pt: 2,
        pb: 5,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4,
            position: "relative",
          }}
        >
          <IconButton
            onClick={handleBackClick}
            sx={{
              mr: 2,
              color: "#ffffff",
              backgroundColor: "rgba(26, 41, 66, 0.6)",
              "&:hover": {
                backgroundColor: "rgba(26, 41, 66, 0.8)",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Box>
            <Typography
              variant="h4"
              sx={{
                color: "#ffffff",
                fontWeight: 700,
              }}
            >
              PowerBI Analytics Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: "#b0bbd4", mt: 0.5 }}>
              Interactive data visualization powered by Microsoft PowerBI
            </Typography>
          </Box>
        </Box>

        <Box sx={{ height: "calc(100vh - 180px)", minHeight: "600px" }}>
          {loading ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(18, 31, 54, 0.8)",
                borderRadius: 2,
              }}
            >
              <CircularProgress size={60} sx={{ color: "#FF6600", mb: 3 }} />
              <Typography variant="h6" sx={{ color: "#ffffff" }}>
                Loading PowerBI Dashboard...
              </Typography>
              <Typography variant="body2" sx={{ color: "#b0bbd4", mt: 1 }}>
                Please wait while we connect to the reporting server
              </Typography>
            </Box>
          ) : (
            <Fade in={!loading} timeout={1000}>
              <Box
                component="iframe"
                src="https://app.powerbi.com/reportEmbed?reportId=f6bfd646-b718-44dc-a378-b73e6b528204&groupId=be8908da-da25-452e-b220-163f52476cdd&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLUVBUlQyLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJtb2Rlcm5FbWJlZCI6dHJ1ZX19"
                frameBorder="0"
                allowFullScreen
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 2,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                }}
              />
            </Fade>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default BIDashboard;
