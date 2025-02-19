// frontend/src/components/PrepareDashboard.js

import React from "react";
import { Container, Box, Typography } from "@mui/material";
import HomeButton from "./HomeButton";

function PrepareDashboard() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#003366", // Dark blue background
        pt: 4,
        pb: 4,
        position: "relative",
      }}
    >
      <HomeButton />
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ color: "#ffffff", fontWeight: 600 }}>
          Discover and Prepare
        </Typography>
      </Box>
      <Box>
        <iframe
          src="https://byu-my.sharepoint.com/personal/haileyp7_byu_edu/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fhaileyp7%5Fbyu%5Fedu%2FDocuments%2Fdatacomp%2FHCA%5FHealthcare%5FDashboard%2Epbix&parent=%2Fpersonal%2Fhaileyp7%5Fbyu%5Fedu%2FDocuments%2Fdatacomp&ga=1"
          width="100%"
          height="800px"
          frameBorder="0"
          scrolling="no"
          allowFullScreen
          title="HCA_Healthcare_Dashboard"
        ></iframe>
      </Box>
    </Container>
  );
}

export default PrepareDashboard;
