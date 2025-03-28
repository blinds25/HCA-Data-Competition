import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ZipCodeEntry from "./components/ZipCodeEntry";
import DataDashboard from "./components/DataDashboard";
import LandingChoice from "./components/LandingChoice";
import PrepareDashboard from "./components/PrepareDashboard";
import LocalDashboard from "./components/LocalDashboard";
import BIDashboard from "./components/BIDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingChoice />} />
        <Route path="/dashboard" element={<DataDashboard />} />
        <Route path="/zipcode-entry" element={<ZipCodeEntry />} />
        <Route path="/prepare" element={<PrepareDashboard />} />
        <Route path="/local-dashboard" element={<LocalDashboard />} />
        <Route path="/bidashboard" element={<BIDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
