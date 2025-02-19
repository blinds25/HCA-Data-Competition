// frontend/src/components/DataDashboard.js

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Container, Typography, Box, Slider, Tabs, Tab, Button, CircularProgress 
} from '@mui/material';
import MapComponent from './MapComponent';
import PeopleList from './PeopleList';
import EmailModal from './EmailModal';
import HomeButton from './HomeButton';
import useDebounce from '../hooks/useDebounce';

// TabPanel helper component for rendering tab content
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
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function DataDashboard() {
  const location = useLocation();
  const zipCode = location.state?.zipCode || '';
  console.log("Zip code from DataDashboard:", zipCode);

  const [localData, setLocalData] = useState([]);
  const [nearbyData, setNearbyData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Map center state; if localData exists, use its first record's coordinates.
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lon: -98.5795 });
  // Map zoom state; default zoom is 4 for a U.S. view.
  const [mapZoom, setMapZoom] = useState(4);

  // Slider state for radius; default is 50 miles.
  const [radius, setRadius] = useState(50);
  // Use debounce on the radius (500ms delay)
  const debouncedRadius = useDebounce(radius, 500);

  // Tab state: 0 for Affected Facility, 1 for Nearby Facilities.
  const [tabValue, setTabValue] = useState(0);

  // State for email modal.
  const [selectedEmailData, setSelectedEmailData] = useState(null);

  const handleRadiusChange = (event, newValue) => {
    setRadius(newValue);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Fetch data whenever zipCode or the debounced radius changes.
  useEffect(() => {
    if (zipCode) {
      setLoading(true);
      fetch(`http://localhost:8000/api/data/?zip_code=${zipCode}&radius=${debouncedRadius}`)
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

  // When localData updates, set the map center using the first local record.
  useEffect(() => {
    if (localData.length > 0) {
      const lat = parseFloat(localData[0].latitude);
      const lon = parseFloat(localData[0].longitude);
      if (!isNaN(lat) && !isNaN(lon)) {
        setMapCenter({ lat, lon });
        setMapZoom(8); // Closer view when local data is available.
      }
    } else {
      setMapCenter({ lat: 39.8283, lon: -98.5795 });
      setMapZoom(4);
    }
  }, [localData]);

  // For the "Contact All" buttons, pass the count of facilities.
  const openEmailModal = (recipientsCount, subjectType) => {
    const subject = subjectType === 'A'
      ? "Mandated Evacuation Protocol and Instructions"
      : "Emergency Assistance Requested";
    setSelectedEmailData({ recipients: recipientsCount, subject });
  };

  const closeEmailModal = () => {
    setSelectedEmailData(null);
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ backgroundColor: '#003366', minHeight: '100vh', width: '100%', pt: 4, pb: 4, position: 'relative' }}
    >
      <HomeButton />
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 600 }}>
          HCA Emergency Contact System
        </Typography>
        <Typography variant="h5" sx={{ color: '#ffffff' }}>
          Showing results for zipcode: {zipCode}
        </Typography>
      </Box>

      {/* "Discover" subheader above the map */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ color: '#f8f8f8' }}>
          Discover
        </Typography>
      </Box>

      {/* Map view */}
      <Box sx={{ my: 4 }}>
        <MapComponent 
          data={[...localData, ...nearbyData]} 
          zipCode={zipCode} 
          center={mapCenter} 
          zoom={mapZoom}
        />
      </Box>

      {/* "Contact" subheader above the lists */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ color: '#f8f8f8' }}>
          Contact
        </Typography>
      </Box>

      {/* Tabs for switching between lists */}
      <Box sx={{ bgcolor: '#003366', borderRadius: 1, mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="Facility list tabs"
          centered
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab label="Affected Facility" id="dashboard-tab-0" aria-controls="dashboard-tabpanel-0" sx={{ color: '#FF6600' }}/>
          <Tab label="Nearby Facilities" id="dashboard-tab-1" aria-controls="dashboard-tabpanel-1" sx={{ color: '#FF6600' }}/>
        </Tabs>
      </Box>

      {/* Affected Facility Tab Panel */}
      <TabPanel value={tabValue} index={0}>
        <PeopleList people={localData} />
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => openEmailModal(localData.length, 'A')}
          >
            Contact Affected Facility
          </Button>
        </Box>
      </TabPanel>

      {/* Nearby Facilities Tab Panel with Slider */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom sx={{ color: '#FF6600' }}>
            Select Nearby Radius (miles): {radius}
          </Typography>
          <Slider
            value={radius}
            onChange={handleRadiusChange}
            aria-labelledby="radius-slider"
            valueLabelDisplay="auto"
            min={0}
            max={100}
            sx={{ color: '#FF6600' }}
          />
        </Box>
        <PeopleList people={nearbyData} />
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => openEmailModal(nearbyData.length, 'B')}
          >
            Contact All Nearby Facilities
          </Button>
        </Box>
      </TabPanel>

      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 51, 102, 0.7)', // semi-transparent dark blue overlay
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
          }}
        >
          <CircularProgress sx={{ color: '#FF6600', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#ffffff' }}>
            Loading...
          </Typography>
        </Box>
      )}

      {selectedEmailData && (
        <EmailModal emailData={selectedEmailData} onClose={closeEmailModal} />
      )}
    </Container>
  );
}

export default DataDashboard;
