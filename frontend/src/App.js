import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ZipCodeEntry from './components/ZipCodeEntry';
import DataDashboard from './components/DataDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ZipCodeEntry />} />
        <Route path="/dashboard" element={<DataDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
