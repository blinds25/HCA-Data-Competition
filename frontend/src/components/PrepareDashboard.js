// frontend/src/components/PrepareDashboard.js

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Fade,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PeopleIcon from "@mui/icons-material/People";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AssessmentIcon from "@mui/icons-material/Assessment";
import WarningIcon from "@mui/icons-material/Warning";
import { useNavigate } from "react-router-dom";

// Mock PowerBI dashboard embedding component
function PowerBIDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate dashboard loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ height: "100%", position: "relative" }}>
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
        <Box sx={{ height: "100%" }}>
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
        </Box>
      )}
    </Box>
  );
}

// Dashboard options component
function DashboardOptions({ onSelect }) {
  const options = [
    {
      title: "Facility Status Overview",
      description:
        "View status of all healthcare facilities and their readiness levels across the nation",
      icon: <BarChartIcon sx={{ fontSize: 40, color: "#FF6600" }} />,
      value: "facility-status",
    },
    {
      title: "Resource Allocation",
      description:
        "Analyze resource distribution and identify gaps in emergency supplies",
      icon: <ShowChartIcon sx={{ fontSize: 40, color: "#FF6600" }} />,
      value: "resource-allocation",
    },
    {
      title: "Staff Availability",
      description:
        "Track medical personnel availability and specialization distribution",
      icon: <PeopleIcon sx={{ fontSize: 40, color: "#FF6600" }} />,
      value: "staff-availability",
    },
    {
      title: "Emergency Readiness",
      description:
        "Review emergency protocols and preparation status by region",
      icon: <WarningIcon sx={{ fontSize: 40, color: "#FF6600" }} />,
      value: "emergency-readiness",
    },
    {
      title: "Critical Care Capacity",
      description:
        "Monitor ICU beds, ventilators, and specialized treatment capabilities",
      icon: <LocalHospitalIcon sx={{ fontSize: 40, color: "#FF6600" }} />,
      value: "critical-care",
    },
    {
      title: "Executive Summary",
      description: "High-level overview of all metrics for leadership review",
      icon: <AssessmentIcon sx={{ fontSize: 40, color: "#FF6600" }} />,
      value: "executive-summary",
    },
  ];

  return (
    <Grid container spacing={3}>
      {options.map((option) => (
        <Grid item xs={12} sm={6} md={4} key={option.value}>
          <Paper
            elevation={3}
            onClick={() => onSelect(option.value)}
            sx={{
              p: 3,
              height: "100%",
              backgroundColor: "#1a2942",
              borderRadius: 2,
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              transition: "all 0.2s ease",
              borderLeft: "4px solid #FF6600",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.25)",
                backgroundColor: "#1f3154",
              },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              {option.icon}
              <Typography
                variant="h6"
                sx={{
                  color: "#ffffff",
                  ml: 2,
                  fontWeight: 600,
                }}
              >
                {option.title}
              </Typography>
            </Box>
            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 1 }} />
            <Typography
              variant="body2"
              sx={{ color: "#b0bbd4", mb: 2, flexGrow: 1 }}
            >
              {option.description}
            </Typography>
            <Chip
              label="View Dashboard"
              sx={{
                alignSelf: "flex-end",
                backgroundColor: "rgba(255, 102, 0, 0.2)",
                color: "#FF6600",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "rgba(255, 102, 0, 0.3)",
                },
              }}
            />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

function PrepareDashboard() {
  const navigate = useNavigate();
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [dashboardTitle, setDashboardTitle] = useState("");

  const handleBackClick = () => {
    if (selectedDashboard) {
      setSelectedDashboard(null);
    } else {
      navigate("/");
    }
  };

  const handleDashboardSelect = (dashboardValue) => {
    setSelectedDashboard(dashboardValue);

    // Set the title based on selection
    switch (dashboardValue) {
      case "facility-status":
        setDashboardTitle("Facility Status Overview");
        break;
      case "resource-allocation":
        setDashboardTitle("Resource Allocation Analysis");
        break;
      case "staff-availability":
        setDashboardTitle("Staff Availability Tracker");
        break;
      case "emergency-readiness":
        setDashboardTitle("Emergency Readiness Assessment");
        break;
      case "critical-care":
        setDashboardTitle("Critical Care Capacity Monitor");
        break;
      case "executive-summary":
        setDashboardTitle("Executive Summary Dashboard");
        break;
      default:
        setDashboardTitle("PowerBI Dashboard");
    }
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
                display: "flex",
                alignItems: "center",
              }}
            >
              {selectedDashboard
                ? dashboardTitle
                : "PowerBI Analytics Dashboard"}
            </Typography>
            <Typography variant="body1" sx={{ color: "#b0bbd4", mt: 0.5 }}>
              {selectedDashboard
                ? "Powered by Microsoft PowerBI"
                : "Select a dashboard view to analyze emergency preparedness data"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          {selectedDashboard ? (
            <Box sx={{ height: "calc(100vh - 180px)", minHeight: "600px" }}>
              <PowerBIDashboard />
            </Box>
          ) : (
            <Fade in={!selectedDashboard} timeout={800}>
              <Box>
                <Card
                  sx={{
                    mb: 4,
                    backgroundColor: "#1f3154",
                    borderRadius: 2,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{
                        color: "#ffffff",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <WarningIcon sx={{ color: "#FF6600", mr: 1 }} />
                      Emergency Preparedness Analysis
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#ffffff",
                        mb: 2,
                        opacity: 0.9,
                      }}
                    >
                      These interactive dashboards provide comprehensive
                      insights into our emergency response preparedness. Use
                      these analytics to identify areas needing attention before
                      emergencies occur.
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: "rgba(255, 102, 0, 0.1)",
                        p: 2,
                        borderRadius: 1,
                        borderLeft: "3px solid #FF6600",
                        mt: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#FF6600",
                          display: "flex",
                          alignItems: "center",
                          fontWeight: 600,
                        }}
                      >
                        <WarningIcon sx={{ fontSize: 18, mr: 1 }} />
                        IMPORTANT NOTE
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#ffffff", mt: 1 }}
                      >
                        All data in these dashboards is refreshed daily at 0300
                        EST. For real-time emergency response, please use the
                        "Act" section from the main menu.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                <DashboardOptions onSelect={handleDashboardSelect} />
              </Box>
            </Fade>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default PrepareDashboard;
