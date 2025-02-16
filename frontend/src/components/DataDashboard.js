// frontend/src/components/DataDashboard.js

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Container, Typography, Box, Slider, Tabs, Tab, Button 
} from '@mui/material';
import MapComponent from './MapComponent';
import PeopleList from './PeopleList';
import EmailModal from './EmailModal';

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
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function DataDashboard() {
  const location = useLocation();
  const zipCode = location.state?.zipCode || '';
  console.log("Zip code from DataDashboard:", zipCode);

  const [localData, setLocalData] = useState([]);
  const [nearbyData, setNearbyData] = useState([]);

  // Slider state for radius; default is 50 miles.
  const [radius, setRadius] = useState(50);

  // Tab state: 0 for Local, 1 for Nearby.
  const [tabValue, setTabValue] = useState(0);

  // State for email modal.
  const [selectedEmailData, setSelectedEmailData] = useState(null);

  // Handler for slider change (for Nearby tab).
  const handleRadiusChange = (event, newValue) => {
    setRadius(newValue);
  };

  // Handler for tab change.
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Fetch data whenever zipCode or radius changes.
  useEffect(() => {
    if (zipCode) {
      fetch(`http://localhost:8000/api/data/?zip_code=${zipCode}&radius=${radius}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("API response:", data);
          setLocalData(data.local);
          setNearbyData(data.nearby);
        })
        .catch((err) => console.error(err));
    }
  }, [zipCode, radius]);

  // This helper extracts emails from an array of person objects.
  const getEmailsFromGroup = (group) => {
    // Assuming each person object has an 'email' field.
    return group.map(person => person.email).filter(email => email);
  };

  // Updated onContact callback that now accepts a recipient or recipients.
  const openEmailModal = (recipients, subjectType) => {
    const subject = subjectType === 'A' ? 'Subject for Group A' : 'Subject for Group B';
    // 'recipients' can be a single email or an array of emails.
    setSelectedEmailData({ recipients, subject });
  };

  const closeEmailModal = () => {
    setSelectedEmailData(null);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Data Dashboard for Zip: {zipCode}
      </Typography>

      {/* Map view */}
      <Box sx={{ my: 4 }}>
        <MapComponent data={[...localData, ...nearbyData]} />
      </Box>

      {/* Tabs for switching between Local and Nearby */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="People list tabs"
        centered
      >
        <Tab label="Local" id="dashboard-tab-0" aria-controls="dashboard-tabpanel-0" />
        <Tab label="Nearby" id="dashboard-tab-1" aria-controls="dashboard-tabpanel-1" />
      </Tabs>

      {/* Local Tab Panel */}
      <TabPanel value={tabValue} index={0}>
        <PeopleList people={localData} onContact={(recipient) => openEmailModal(recipient, 'A')} />
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => openEmailModal(getEmailsFromGroup(localData), 'A')}
          >
            Contact All Local
          </Button>
        </Box>
      </TabPanel>

      {/* Nearby Tab Panel with Slider */}
      <TabPanel value={tabValue} index={1}>
        {/* Slider appears only for the Nearby tab */}
        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>
            Select Nearby Radius (miles): {radius}
          </Typography>
          <Slider
            value={radius}
            onChange={handleRadiusChange}
            aria-labelledby="radius-slider"
            valueLabelDisplay="auto"
            min={0}
            max={100}
          />
        </Box>
        <PeopleList people={nearbyData} onContact={(recipient) => openEmailModal(recipient, 'B')} />
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => openEmailModal(getEmailsFromGroup(nearbyData), 'B')}
          >
            Contact All Nearby
          </Button>
        </Box>
      </TabPanel>

      {selectedEmailData && (
        <EmailModal emailData={selectedEmailData} onClose={closeEmailModal} />
      )}
    </Container>
  );
}

export default DataDashboard;
