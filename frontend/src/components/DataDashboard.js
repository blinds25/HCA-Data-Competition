// frontend/src/components/DataDashboard.js

import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  IconButton,
  Divider,
  Fade,
  Chip,
  Slider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate, useLocation } from "react-router-dom";
import EmailModal from "./EmailModal";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapComponent from "./MapComponent";
import PeopleList from "./PeopleList";
import useDebounce from "../hooks/useDebounce";

// Fix the Leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function DataDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const zipCode = location.state?.zipCode || "";

  const [localData, setLocalData] = useState([]);
  const [nearbyData, setNearbyData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Map center state; if localData exists, use its first record's coordinates
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lon: -98.5795 });
  // Map zoom state; default is 4 for a U.S. view
  const [mapZoom, setMapZoom] = useState(4);

  // Slider state for radius; default is 50 miles
  const [radius, setRadius] = useState(50);
  // Use debounce on the radius (500ms delay)
  const debouncedRadius = useDebounce(radius, 500);

  // Tab state: 0 for Affected Facility, 1 for Nearby Facilities
  const [tabValue, setTabValue] = useState(0);

  // State for email modal
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailData, setEmailData] = useState(null);

  const handleBackClick = () => {
    navigate("/zipcode-entry");
  };

  const handleRadiusChange = (event, newValue) => {
    setRadius(newValue);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Fetch data whenever zipCode or the debounced radius changes
  useEffect(() => {
    if (zipCode) {
      setLoading(true);
      fetch(
        `http://localhost:8000/api/data/?zip_code=${zipCode}&radius=${debouncedRadius}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("API response:", data);
          setLocalData(data.local);
          setNearbyData(data.nearby);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [zipCode, debouncedRadius]);

  // When localData updates, set the map center using the first local record
  useEffect(() => {
    if (localData.length > 0) {
      const lat = parseFloat(localData[0].latitude);
      const lon = parseFloat(localData[0].longitude);
      if (!isNaN(lat) && !isNaN(lon)) {
        setMapCenter({ lat, lon });
        // Set to a closer zoom level to focus on the ZIP code area
        setMapZoom(12);
      }
    } else {
      // Set default view of US if no local data
      setMapCenter({ lat: 39.8283, lon: -98.5795 });
      setMapZoom(4);
    }
  }, [localData]);

  // Prepare and enhance data for the MapComponent
  const getMapData = () => {
    // Mark local data with the local zip code
    const enhancedLocalData = localData.map((item) => ({
      ...item,
      isLocal: true,
    }));

    // Mark nearby data as not belonging to local zip code
    const enhancedNearbyData = nearbyData.map((item) => ({
      ...item,
      isLocal: false,
    }));

    return [...enhancedLocalData, ...enhancedNearbyData];
  };

  // For the "Contact" buttons, prepare email data and open modal
  const openEmailModal = (recipientsCount, subjectType) => {
    const subject =
      subjectType === "A"
        ? "Mandated Evacuation Protocol and Instructions"
        : "Emergency Assistance Requested";

    setEmailData({
      recipients: recipientsCount,
      subject,
      currentFacility:
        localData.length > 0
          ? {
              name: localData[0].location,
              city: localData[0].city,
              state: localData[0].state,
            }
          : null,
    });
    setEmailModalOpen(true);
  };

  const closeEmailModal = () => {
    setEmailModalOpen(false);
    setEmailData(null);
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
        {/* Header with back button */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
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
            <Typography variant="h4" sx={{ color: "#ffffff", fontWeight: 700 }}>
              HCA Emergency Contact System
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#b0bbd4",
                mt: 0.5,
                display: "flex",
                alignItems: "center",
              }}
            >
              <LocationOnIcon sx={{ fontSize: 18, mr: 0.5 }} />
              Showing results for zipcode: {zipCode}
            </Typography>
          </Box>
        </Box>

        {/* Map Card */}
        <Card
          sx={{
            mb: 4,
            backgroundColor: "#1a2942",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 2 }}>
              <Typography
                variant="h6"
                sx={{ color: "#ffffff", fontWeight: 600 }}
              >
                Discover
              </Typography>
            </Box>

            <Box sx={{ height: 400, width: "100%" }}>
              <MapComponent
                data={getMapData()}
                zipCode={zipCode}
                center={mapCenter}
                zoom={mapZoom}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Tabs and People Lists */}
        <Card
          sx={{
            backgroundColor: "#1a2942",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Box
            sx={{ borderBottom: 1, borderColor: "rgba(255, 255, 255, 0.1)" }}
          >
            <Box sx={{ p: 2 }}>
              <Typography
                variant="h6"
                sx={{ color: "#ffffff", fontWeight: 600, mb: 2 }}
              >
                Contact
              </Typography>
            </Box>

            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="Facility list tabs"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "#FF6600",
                },
                "& .MuiTab-root": {
                  color: "#b0bbd4",
                  "&.Mui-selected": {
                    color: "#ffffff",
                    fontWeight: 600,
                  },
                },
              }}
            >
              <Tab
                label="Affected Facility"
                id="dashboard-tab-0"
                aria-controls="dashboard-tabpanel-0"
              />
              <Tab
                label="Nearby Facilities"
                id="dashboard-tab-1"
                aria-controls="dashboard-tabpanel-1"
              />
            </Tabs>
          </Box>

          {/* Affected Facility Tab Panel */}
          <TabPanel value={tabValue} index={0}>
            <PeopleList people={localData} />
            <Box sx={{ mt: 3, textAlign: "right" }}>
              <Button
                variant="contained"
                onClick={() => openEmailModal(localData.length, "A")}
                sx={{
                  backgroundColor: "#FF6600",
                  color: "#ffffff",
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#e55c00",
                    boxShadow: "0 4px 12px rgba(255, 102, 0, 0.3)",
                  },
                }}
              >
                Contact Affected Facility
              </Button>
            </Box>
          </TabPanel>

          {/* Nearby Facilities Tab Panel with Slider */}
          <TabPanel value={tabValue} index={1}>
            <Box
              sx={{
                mb: 3,
                p: 2,
                backgroundColor: "rgba(26, 41, 66, 0.7)",
                borderRadius: 2,
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Typography sx={{ color: "#ffffff", fontWeight: 500, mb: 1 }}>
                Select Nearby Radius (miles): {radius}
              </Typography>
              <Slider
                value={radius}
                onChange={handleRadiusChange}
                aria-labelledby="radius-slider"
                valueLabelDisplay="auto"
                min={0}
                max={100}
                sx={{
                  color: "#FF6600",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "#ffffff",
                    border: "2px solid #FF6600",
                  },
                  "& .MuiSlider-valueLabel": {
                    backgroundColor: "#1a2942",
                  },
                }}
              />
            </Box>

            <PeopleList people={nearbyData} />

            <Box sx={{ mt: 3, textAlign: "right" }}>
              <Button
                variant="contained"
                onClick={() => openEmailModal(nearbyData.length, "B")}
                sx={{
                  backgroundColor: "#FF6600",
                  color: "#ffffff",
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#e55c00",
                    boxShadow: "0 4px 12px rgba(255, 102, 0, 0.3)",
                  },
                }}
              >
                Contact All Nearby Facilities
              </Button>
            </Box>
          </TabPanel>
        </Card>
      </Container>

      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(18, 31, 54, 0.8)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1200,
          }}
        >
          <CircularProgress size={60} sx={{ color: "#FF6600", mb: 3 }} />
          <Typography variant="h6" sx={{ color: "#ffffff" }}>
            Loading data...
          </Typography>
        </Box>
      )}

      {/* Email Modal */}
      {emailModalOpen && (
        <EmailModal
          open={emailModalOpen}
          onClose={closeEmailModal}
          currentFacility={emailData?.currentFacility}
        />
      )}
    </Box>
  );
}

export default DataDashboard;
