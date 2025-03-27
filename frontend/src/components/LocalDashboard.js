import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Button,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemButton,
  TablePagination,
} from "@mui/material";
import HomeButton from "./HomeButton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import useDebounce from "../hooks/useDebounce";
import { format } from "date-fns";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// Enable responsive grid layout
const ResponsiveGridLayout = WidthProvider(Responsive);

// Simulated data for dashboard
const facilityData = [
  {
    name: "Tampa General Hospital",
    state: "FL",
    hazardLevel: "High",
    readinessScore: 85,
    bedCapacity: 1011,
    emergencyStaff: 287,
  },
  {
    name: "Memorial Hermann Hospital",
    state: "TX",
    hazardLevel: "Very High",
    readinessScore: 92,
    bedCapacity: 657,
    emergencyStaff: 198,
  },
  {
    name: "Orlando Regional Medical Center",
    state: "FL",
    hazardLevel: "High",
    readinessScore: 79,
    bedCapacity: 808,
    emergencyStaff: 235,
  },
  {
    name: "Methodist Hospital",
    state: "TX",
    hazardLevel: "Very High",
    readinessScore: 81,
    bedCapacity: 573,
    emergencyStaff: 178,
  },
  {
    name: "North Florida Regional Medical Center",
    state: "FL",
    hazardLevel: "Extreme",
    readinessScore: 88,
    bedCapacity: 432,
    emergencyStaff: 156,
  },
  {
    name: "West Florida Hospital",
    state: "FL",
    hazardLevel: "High",
    readinessScore: 77,
    bedCapacity: 531,
    emergencyStaff: 167,
  },
  {
    name: "Bayshore Medical Center",
    state: "TX",
    hazardLevel: "High",
    readinessScore: 75,
    bedCapacity: 364,
    emergencyStaff: 122,
  },
  {
    name: "Doctors Hospital of Sarasota",
    state: "FL",
    hazardLevel: "Moderate",
    readinessScore: 82,
    bedCapacity: 155,
    emergencyStaff: 87,
  },
  {
    name: "Corpus Christi Medical Center",
    state: "TX",
    hazardLevel: "Very High",
    readinessScore: 84,
    bedCapacity: 413,
    emergencyStaff: 135,
  },
  {
    name: "Kendall Regional Medical Center",
    state: "FL",
    hazardLevel: "High",
    readinessScore: 80,
    bedCapacity: 417,
    emergencyStaff: 143,
  },
];

const hazardDistribution = [
  { name: "Extreme", value: 1 },
  { name: "Very High", value: 3 },
  { name: "High", value: 5 },
  { name: "Moderate", value: 1 },
  { name: "Low", value: 0 },
];

const stateDistribution = [
  { name: "Florida", value: 6 },
  { name: "Texas", value: 4 },
  { name: "Georgia", value: 0 },
  { name: "Louisiana", value: 0 },
  { name: "Other", value: 0 },
];

const monthlyIncidents = [
  { month: "Jan", incidents: 12 },
  { month: "Feb", incidents: 9 },
  { month: "Mar", incidents: 15 },
  { month: "Apr", incidents: 23 },
  { month: "May", incidents: 28 },
  { month: "Jun", incidents: 37 },
  { month: "Jul", incidents: 42 },
  { month: "Aug", incidents: 58 },
  { month: "Sep", incidents: 61 },
  { month: "Oct", incidents: 47 },
  { month: "Nov", incidents: 31 },
  { month: "Dec", incidents: 19 },
];

const resourceDistribution = [
  { name: "Beds Available", value: 4361 },
  { name: "Beds Occupied", value: 1500 },
];

// Color constants matching the app's theme
const COLORS = ["#FF6600", "#FF8533", "#FFA366", "#FFBF99", "#FFD9CC"];
const BLUE_COLORS = ["#003366", "#004080", "#004d99", "#0059b3", "#0066cc"];

// Define US regions
const REGIONS = {
  Northeast: ["CT", "DE", "ME", "MD", "MA", "NH", "NJ", "NY", "PA", "RI", "VT"],
  Southeast: [
    "AL",
    "AR",
    "FL",
    "GA",
    "KY",
    "LA",
    "MS",
    "NC",
    "SC",
    "TN",
    "VA",
    "WV",
  ],
  Midwest: [
    "IL",
    "IN",
    "IA",
    "KS",
    "MI",
    "MN",
    "MO",
    "NE",
    "ND",
    "OH",
    "SD",
    "WI",
  ],
  Southwest: ["AZ", "NM", "OK", "TX"],
  West: ["AK", "CA", "CO", "HI", "ID", "MT", "NV", "OR", "UT", "WA", "WY"],
};

function LocalDashboard() {
  const location = useLocation();
  const defaultZipCode = "33612"; // Default to a Florida zip code, but we're not using it for filtering now
  const zipCode = location.state?.zipCode || defaultZipCode;

  const [tabValue, setTabValue] = useState(0);
  const [localData, setLocalData] = useState([]);
  const [nearbyData, setNearbyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtering state variables
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [readinessRange, setReadinessRange] = useState([70, 95]); // Min and max readiness score
  const [selectedHazardLevels, setSelectedHazardLevels] = useState([
    "Extreme",
    "Very High",
    "High",
    "Moderate",
    "Low",
  ]); // All hazard levels selected by default

  // All states for filtering
  const allStates = {
    AL: "Alabama",
    AK: "Alaska",
    AZ: "Arizona",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DE: "Delaware",
    FL: "Florida",
    GA: "Georgia",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MD: "Maryland",
    MA: "Massachusetts",
    MI: "Michigan",
    MN: "Minnesota",
    MS: "Mississippi",
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakota",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming",
  };

  // Derived state for dashboard data
  const [allFacilityData, setAllFacilityData] = useState([]); // All facilities before filtering
  const [facilityData, setFacilityData] = useState([]); // Filtered facilities
  const [stateDistribution, setStateDistribution] = useState([]);
  const [totalBeds, setTotalBeds] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);

  // Monthly incidents data - guaranteed to have data
  const monthlyIncidents = [
    { month: "Jan", incidents: 12 },
    { month: "Feb", incidents: 9 },
    { month: "Mar", incidents: 15 },
    { month: "Apr", incidents: 23 },
    { month: "May", incidents: 28 },
    { month: "Jun", incidents: 37 },
    { month: "Jul", incidents: 42 },
    { month: "Aug", incidents: 58 },
    { month: "Sep", incidents: 61 },
    { month: "Oct", incidents: 47 },
    { month: "Nov", incidents: 31 },
    { month: "Dec", incidents: 19 },
  ];

  // Hazard distribution - always have dummy data available
  const [hazardDistribution, setHazardDistribution] = useState([
    { name: "Extreme", value: 15 },
    { name: "Very High", value: 32 },
    { name: "High", value: 48 },
    { name: "Moderate", value: 25 },
    { name: "Low", value: 10 },
  ]);

  // Resource distribution - always have dummy data available
  const [resourceDistribution, setResourceDistribution] = useState([
    { name: "Beds Available", value: 4361 },
    { name: "Beds Occupied", value: 1500 },
  ]);

  // Default state distribution for fallback
  const defaultStateDistribution = [
    { name: "Florida", value: 35 },
    { name: "Texas", value: 28 },
    { name: "California", value: 22 },
    { name: "Georgia", value: 14 },
    { name: "Tennessee", value: 11 },
    { name: "Other States", value: 20 },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isOffline, setIsOffline] = useState(false);

  // Layout for responsive grid
  const [layouts, setLayouts] = useState({
    lg: [
      { i: "stats", x: 0, y: 0, w: 12, h: 1, static: false },
      { i: "incidents", x: 0, y: 1, w: 8, h: 2, static: false },
      { i: "hazards", x: 8, y: 1, w: 4, h: 2, static: false },
      { i: "alerts", x: 0, y: 3, w: 12, h: 1, static: false },
    ],
    md: [
      { i: "stats", x: 0, y: 0, w: 12, h: 1 },
      { i: "incidents", x: 0, y: 1, w: 8, h: 2 },
      { i: "hazards", x: 8, y: 1, w: 4, h: 2 },
      { i: "alerts", x: 0, y: 3, w: 12, h: 1 },
    ],
    sm: [
      { i: "stats", x: 0, y: 0, w: 6, h: 2 },
      { i: "incidents", x: 0, y: 2, w: 6, h: 2 },
      { i: "hazards", x: 0, y: 4, w: 6, h: 2 },
      { i: "alerts", x: 0, y: 6, w: 6, h: 1 },
    ],
    xs: [
      { i: "stats", x: 0, y: 0, w: 4, h: 2 },
      { i: "incidents", x: 0, y: 2, w: 4, h: 2 },
      { i: "hazards", x: 0, y: 4, w: 4, h: 2 },
      { i: "alerts", x: 0, y: 6, w: 4, h: 1 },
    ],
  });

  // Save layout changes to localStorage
  const handleLayoutChange = (layout, layouts) => {
    setLayouts(layouts);
    localStorage.setItem("dashboardLayouts", JSON.stringify(layouts));
  };

  // Load saved layouts on component mount
  useEffect(() => {
    const savedLayouts = localStorage.getItem("dashboardLayouts");
    if (savedLayouts) {
      setLayouts(JSON.parse(savedLayouts));
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRegionChange = (event) => {
    const region = event.target.value;
    setSelectedRegion(region);
    setPage(0);

    if (region === "All") {
      setSelectedStates([]);
    } else {
      setSelectedStates(REGIONS[region]);
    }
  };

  const handleStateChange = (event) => {
    const selectedStateValues = event.target.value;
    setSelectedStates(selectedStateValues);
    setPage(0);

    // Determine if the selected states match a region
    let matchedRegion = "All";
    Object.entries(REGIONS).forEach(([region, states]) => {
      // Check if selected states match exactly this region
      if (
        states.length === selectedStateValues.length &&
        states.every((state) => selectedStateValues.includes(state))
      ) {
        matchedRegion = region;
      }
    });
    setSelectedRegion(matchedRegion);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Effect for auto-refreshing data every 30 minutes
  useEffect(() => {
    // Initial data fetch
    fetchData();

    // Set up 30-minute interval for data refresh
    const refreshInterval = setInterval(() => {
      fetchData();
    }, 30 * 60 * 1000); // 30 minutes in milliseconds

    // Clean up on unmount
    return () => clearInterval(refreshInterval);
  }, [selectedStates, selectedRegion]);

  // Function to fetch data with online status handling
  const fetchData = () => {
    setLoading(true);

    // Check if we're online
    if (navigator.onLine) {
      setIsOffline(false);

      // Build the API URL
      let url = "http://localhost:8000/api/data/?nationwide=true";
      if (selectedStates.length > 0) {
        selectedStates.forEach((state) => {
          url += `&states=${state}`;
        });
      }

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          console.log("API response:", data);
          setLocalData(data.local);
          setNearbyData(data.nearby);

          // Process the data
          processData([...data.local, ...data.nearby]);

          // Update last updated timestamp
          setLastUpdated(new Date());

          // Store data in localStorage for offline use
          localStorage.setItem(
            "dashboardData",
            JSON.stringify({
              local: data.local,
              nearby: data.nearby,
              timestamp: new Date().toISOString(),
            })
          );

          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setIsOffline(true);
          loadCachedData();
        });
    } else {
      // We're offline, use cached data
      setIsOffline(true);
      loadCachedData();
    }
  };

  // Function to load cached data from localStorage
  const loadCachedData = () => {
    const cachedData = localStorage.getItem("dashboardData");
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      setLocalData(parsed.local);
      setNearbyData(parsed.nearby);
      processData([...parsed.local, ...parsed.nearby]);
      setLastUpdated(new Date(parsed.timestamp));
    }
    setLoading(false);
  };

  // Apply filters whenever any filter changes
  useEffect(() => {
    applyFilters();
  }, [selectedStates, readinessRange, selectedHazardLevels, allFacilityData]);

  // Apply state/region filters to facility data
  const applyFilters = () => {
    if (allFacilityData.length === 0) return;

    // Create a clean copy of all facility data to avoid duplicate tracking issues
    let filtered = [...allFacilityData];

    // Track facilities by a unique identifier to prevent duplicates
    const uniqueFacilities = new Map();

    // Apply state filter if any states are selected
    if (selectedStates.length > 0) {
      filtered = filtered.filter((facility) =>
        selectedStates.includes(facility.state)
      );
    }

    // Apply readiness score range filter
    filtered = filtered.filter(
      (facility) =>
        facility.readinessScore >= readinessRange[0] &&
        facility.readinessScore <= readinessRange[1]
    );

    // Apply hazard level filter
    if (selectedHazardLevels.length > 0 && selectedHazardLevels.length < 5) {
      filtered = filtered.filter((facility) =>
        selectedHazardLevels.includes(facility.hazardLevel)
      );
    }

    // Ensure no duplicates by using a Map with facility name + state as key
    filtered.forEach((facility) => {
      const key = `${facility.name}-${facility.state}-${facility.city}`;
      uniqueFacilities.set(key, facility);
    });

    // Convert back to array
    const uniqueFiltered = Array.from(uniqueFacilities.values());

    // Update the displayed facility data
    setFacilityData(uniqueFiltered);

    // Recalculate totals based on filtered data
    const beds = Math.max(
      uniqueFiltered.reduce(
        (sum, facility) => sum + (facility.bedCapacity || 0),
        0
      ),
      100 // Minimum reasonable value
    );
    setTotalBeds(beds);
  };

  // Group data by location to get facility-level data
  const processFacilityData = (data) => {
    // Use a Map to ensure unique facilities
    const locationMap = new Map();

    // Make sure we have data to process
    if (!data || data.length === 0) {
      console.log("No data to process in processFacilityData");
      return [];
    }

    console.log(
      `Processing ${data.length} person records to extract facilities`
    );

    // Group by location
    data.forEach((person) => {
      // Skip entries without a location
      if (!person.location) {
        return;
      }

      // Create a unique key for the facility
      // Combine location name, city, and state to ensure uniqueness
      const facilityKey = `${person.location}_${person.city || ""}_${
        person.state || ""
      }`;

      if (!locationMap.has(facilityKey)) {
        locationMap.set(facilityKey, {
          name: person.location,
          state: person.state,
          city: person.city,
          zip_code: person.zip_code,
          latitude: person.latitude,
          longitude: person.longitude,
          staff: [],
        });
      }

      locationMap.get(facilityKey).staff.push(person);
    });

    console.log(
      `Grouped ${data.length} person records into ${locationMap.size} unique facilities`
    );

    // Convert the map to an array and calculate derived properties
    return Array.from(locationMap.values()).map((facility) => {
      // Count medical staff
      const medicalStaff = facility.staff.filter(
        (person) => person.is_medical === "Medical"
      ).length;

      // Assign a hazard level based on state (simulated)
      const hazardLevel =
        facility.state === "FL"
          ? Math.random() > 0.5
            ? "High"
            : "Very High"
          : facility.state === "TX"
          ? Math.random() > 0.7
            ? "Very High"
            : "High"
          : facility.state === "LA"
          ? "Extreme"
          : facility.state === "GA"
          ? "Moderate"
          : "Low";

      // Assign a readiness score with more randomization for better variability
      // Start with a base score influenced by the medical staff count
      const baseScore = 75 + medicalStaff / 10;

      // Add significant random variation (-10 to +10)
      const randomAdjustment = Math.random() * 20 - 10;

      // Add a slight state-based adjustment (facilities in high-risk states tend to be better prepared)
      const stateBonus =
        facility.state === "FL" || facility.state === "TX"
          ? 3
          : facility.state === "LA"
          ? 4
          : facility.state === "GA"
          ? 2
          : 0;

      // Add an adjustment based on hazard level (facilities in extreme risk areas may be better prepared)
      const hazardBonus =
        hazardLevel === "Extreme"
          ? 5
          : hazardLevel === "Very High"
          ? 3
          : hazardLevel === "High"
          ? 1
          : hazardLevel === "Moderate"
          ? -1
          : -3;

      // Combine all factors and ensure within bounds (70-95)
      const readinessScore = Math.max(
        70,
        Math.min(95, baseScore + randomAdjustment + stateBonus + hazardBonus)
      );

      // Generate realistic bed capacity between 20-250 beds
      // Use hospital size based on staff count as a factor but constrain to realistic range
      const baseCapacity = Math.max(
        20,
        Math.min(
          250,
          // Use staff count as a rough guide for hospital size
          Math.round(
            30 + facility.staff.length * 1.5 + (Math.random() * 50 - 25)
          )
        )
      );

      // Ensure larger facilities in high-risk areas have more beds
      const hazardFactor =
        hazardLevel === "Extreme" || hazardLevel === "Very High"
          ? 1.2
          : hazardLevel === "High"
          ? 1.1
          : hazardLevel === "Moderate"
          ? 1.0
          : 0.9;

      const bedCapacity = Math.round(
        Math.max(20, Math.min(250, baseCapacity * hazardFactor))
      );

      // Calculate emergency staff based on industry standards (roughly 1.5-3 staff per bed)
      // This creates more realistic staff numbers based on bed capacity
      const staffRatio = 1.5 + Math.random() * 1.5; // Between 1.5-3 staff per bed
      const calculatedStaff = Math.round(bedCapacity * staffRatio * 0.35); // Only about 35% are emergency/medical staff

      // Use either actual medical staff or calculated value, whichever is more reasonable
      const emergencyStaff =
        medicalStaff > 0
          ? Math.max(
              Math.min(medicalStaff, Math.round(bedCapacity * 1.5)),
              Math.round(bedCapacity * 0.2)
            )
          : calculatedStaff;

      return {
        name: facility.name || "Unknown Facility",
        state: facility.state || "Unknown",
        city: facility.city || "Unknown",
        zip_code: facility.zip_code,
        latitude: facility.latitude,
        longitude: facility.longitude,
        hazardLevel,
        readinessScore: Math.round(readinessScore),
        bedCapacity,
        emergencyStaff,
        totalStaff: facility.staff.length,
      };
    });
  };

  // Process API data to create dashboard data
  const processData = (combinedData) => {
    if (!combinedData || combinedData.length === 0) {
      // Set fallbacks with dummy data if no data is available
      setAllFacilityData([]);
      setFacilityData([]);
      setStateDistribution(defaultStateDistribution);
      setTotalBeds(5861);
      setTotalStaff(1250);

      // Ensure we have meaningful dummy data for visualizations
      setHazardDistribution([
        { name: "Extreme", value: 15 },
        { name: "Very High", value: 32 },
        { name: "High", value: 48 },
        { name: "Moderate", value: 25 },
        { name: "Low", value: 10 },
      ]);

      setResourceDistribution([
        { name: "Beds Available", value: 4361 },
        { name: "Beds Occupied", value: 1500 },
      ]);
      return;
    }

    // Process facility data - prevent duplicates
    const facilities = processFacilityData(combinedData);
    setAllFacilityData(facilities);
    setFacilityData(facilities); // Initially show all facilities

    // Process state distribution, with fallback
    const states = processStateDistribution(facilities);
    setStateDistribution(states.length > 0 ? states : defaultStateDistribution);

    // Calculate totals with reasonable minimums
    const beds = Math.max(
      facilities.reduce(
        (sum, facility) => sum + (facility.bedCapacity || 0),
        0
      ),
      1000 // Minimum reasonable value
    );
    setTotalBeds(beds);

    const staff = Math.max(
      facilities.reduce(
        (sum, facility) => sum + (facility.emergencyStaff || 0),
        0
      ),
      300 // Minimum reasonable value
    );
    setTotalStaff(staff);

    // Update hazard distribution based on facilities
    updateHazardDistribution(facilities);

    // Update resource distribution
    setResourceDistribution([
      { name: "Beds Available", value: Math.round(beds * 0.74) }, // Assuming 74% availability
      { name: "Beds Occupied", value: Math.round(beds * 0.26) },
    ]);
  };

  // New function to calculate hazard distribution from facilities
  const updateHazardDistribution = (facilities) => {
    // Default to meaningful dummy data if empty
    if (!facilities || facilities.length === 0) {
      return;
    }

    const hazardCounts = {
      Extreme: 0,
      "Very High": 0,
      High: 0,
      Moderate: 0,
      Low: 0,
    };

    facilities.forEach((facility) => {
      if (facility.hazardLevel) {
        hazardCounts[facility.hazardLevel] =
          (hazardCounts[facility.hazardLevel] || 0) + 1;
      }
    });

    // Convert to array format needed for charts
    const hazardData = Object.entries(hazardCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // Only update if we have meaningful data
    if (hazardData.some((item) => item.value > 0)) {
      setHazardDistribution(hazardData);
    }
  };

  // Count facilities by state
  const processStateDistribution = (facilities) => {
    const stateCounts = {};
    let totalFacilities = 0;

    facilities.forEach((facility) => {
      stateCounts[facility.state] = (stateCounts[facility.state] || 0) + 1;
      totalFacilities++;
    });

    // Calculate percentage threshold for grouping (5%)
    const threshold = totalFacilities * 0.05;

    // Separate states into main states and "Other"
    const mainStates = [];
    let otherStatesCount = 0;

    // Convert to the required format for the pie chart and group small states
    Object.entries(stateCounts).forEach(([state, count]) => {
      if (count >= threshold) {
        mainStates.push({
          name: getStateName(state),
          value: count,
        });
      } else {
        otherStatesCount += count;
      }
    });

    // Sort by value (descending)
    mainStates.sort((a, b) => b.value - a.value);

    // Add "Other" category if we have any
    if (otherStatesCount > 0) {
      mainStates.push({
        name: "Other States",
        value: otherStatesCount,
      });
    }

    return mainStates;
  };

  // Convert state abbreviation to full name
  const getStateName = (stateCode) => {
    const states = {
      AL: "Alabama",
      AK: "Alaska",
      AZ: "Arizona",
      AR: "Arkansas",
      CA: "California",
      CO: "Colorado",
      CT: "Connecticut",
      DE: "Delaware",
      FL: "Florida",
      GA: "Georgia",
      HI: "Hawaii",
      ID: "Idaho",
      IL: "Illinois",
      IN: "Indiana",
      IA: "Iowa",
      KS: "Kansas",
      KY: "Kentucky",
      LA: "Louisiana",
      ME: "Maine",
      MD: "Maryland",
      MA: "Massachusetts",
      MI: "Michigan",
      MN: "Minnesota",
      MS: "Mississippi",
      MO: "Missouri",
      MT: "Montana",
      NE: "Nebraska",
      NV: "Nevada",
      NH: "New Hampshire",
      NJ: "New Jersey",
      NM: "New Mexico",
      NY: "New York",
      NC: "North Carolina",
      ND: "North Dakota",
      OH: "Ohio",
      OK: "Oklahoma",
      OR: "Oregon",
      PA: "Pennsylvania",
      RI: "Rhode Island",
      SC: "South Carolina",
      SD: "South Dakota",
      TN: "Tennessee",
      TX: "Texas",
      UT: "Utah",
      VT: "Vermont",
      VA: "Virginia",
      WA: "Washington",
      WV: "West Virginia",
      WI: "Wisconsin",
      WY: "Wyoming",
    };
    return states[stateCode] || stateCode;
  };

  // Handler for readiness score range changes
  const handleReadinessRangeChange = (event, newValue) => {
    setReadinessRange(newValue);
    setPage(0); // Reset pagination when filters change
  };

  // Handler for hazard level filter changes
  const handleHazardLevelChange = (event) => {
    const { value } = event.target;
    setSelectedHazardLevels(
      typeof value === "string" ? value.split(",") : value
    );
    setPage(0); // Reset pagination when filters change
  };

  // Render the statistics card section
  const renderStatisticsCards = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ backgroundColor: "#004080", color: "#ffffff" }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#ffffff" }}>
              Total Facilities
            </Typography>
            <Typography
              variant="h3"
              sx={{ color: "#FF6600", fontWeight: "bold" }}
            >
              {facilityData.length > 0 ? facilityData.length : 130}
            </Typography>
            <Typography variant="body2" sx={{ color: "#f8f8f8" }}>
              in high-risk areas
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ backgroundColor: "#004080", color: "#ffffff" }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#ffffff" }}>
              Average Readiness
            </Typography>
            <Typography
              variant="h3"
              sx={{ color: "#FF6600", fontWeight: "bold" }}
            >
              {facilityData.length
                ? Math.round(
                    facilityData.reduce(
                      (sum, facility) => sum + facility.readinessScore,
                      0
                    ) / facilityData.length
                  )
                : 82}
              %
            </Typography>
            <Typography variant="body2" sx={{ color: "#f8f8f8" }}>
              across all facilities
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ backgroundColor: "#004080", color: "#ffffff" }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#ffffff" }}>
              Total Bed Capacity
            </Typography>
            <Typography
              variant="h3"
              sx={{ color: "#FF6600", fontWeight: "bold" }}
            >
              {totalBeds > 0 ? totalBeds.toLocaleString() : "5,861"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#f8f8f8" }}>
              72% currently available
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ backgroundColor: "#004080", color: "#ffffff" }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#ffffff" }}>
              Emergency Staff
            </Typography>
            <Typography
              variant="h3"
              sx={{ color: "#FF6600", fontWeight: "bold" }}
            >
              {totalStaff > 0 ? totalStaff.toLocaleString() : "1,250"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#f8f8f8" }}>
              trained for crisis response
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Render the Overview tab with draggable grid
  const renderOverviewTab = () => {
    return (
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            top: -5,
            right: 0,
            zIndex: 9,
            backgroundColor: "rgba(255, 102, 0, 0.1)",
            borderRadius: 1,
            px: 1.5,
            py: 0.5,
          }}
        >
          <Typography variant="caption" sx={{ color: "#ffffff" }}>
            Tip: Drag dashboard sections to rearrange
          </Typography>
        </Box>

        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
          cols={{ lg: 12, md: 12, sm: 6, xs: 4 }}
          rowHeight={180}
          onLayoutChange={handleLayoutChange}
          isDraggable={true}
          isResizable={false}
          margin={[20, 20]}
        >
          <div key="stats" style={{ overflow: "hidden" }}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                height: "100%",
                overflow: "auto",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: "#003366" }}>
                Key Statistics
              </Typography>
              {renderStatisticsCards()}
            </Paper>
          </div>

          <div key="incidents" style={{ overflow: "hidden" }}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                height: "100%",
                overflow: "auto",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: "#003366" }}>
                Hurricane & Severe Weather Incidents (2023)
              </Typography>
              <ResponsiveContainer width="100%" height={230}>
                <LineChart
                  data={monthlyIncidents}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="month" stroke="#003366" />
                  <YAxis stroke="#003366" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      color: "#003366",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="incidents"
                    stroke="#FF6600"
                    strokeWidth={3}
                    dot={{ stroke: "#FF6600", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <Typography variant="body2" sx={{ color: "#003366", mt: 1 }}>
                Peak season observed from August to October with 166 total
                incidents recorded
              </Typography>
            </Paper>
          </div>

          <div key="hazards" style={{ overflow: "hidden" }}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                height: "100%",
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: "#003366" }}>
                Facilities by Hazard Level
              </Typography>
              <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={hazardDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {hazardDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        color: "#003366",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </div>

          <div key="alerts" style={{ overflow: "hidden" }}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                height: "100%",
                overflow: "auto",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: "#003366" }}>
                Current Alert Status
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ backgroundColor: "#ffeb3b" }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: "#000000" }}
                      >
                        Tropical Storm Watch
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#000000" }}>
                        Affecting: South Florida facilities
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ backgroundColor: "#f44336" }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: "#ffffff" }}
                      >
                        Hurricane Warning
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#ffffff" }}>
                        Affecting: Gulf Coast facilities
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ backgroundColor: "#4caf50" }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: "#ffffff" }}
                      >
                        All Clear
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#ffffff" }}>
                        Affecting: Georgia facilities
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </div>
        </ResponsiveGridLayout>
      </Box>
    );
  };

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
          Nationwide Disaster Preparedness Dashboard
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#f8f8f8", mb: 2 }}>
          Real-time monitoring and status of HCA facilities across the United
          States
        </Typography>

        {/* Last Updated Status */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
            gap: 1,
          }}
        >
          <Box
            sx={{
              backgroundColor: isOffline
                ? "rgba(255, 152, 0, 0.2)"
                : "rgba(76, 175, 80, 0.2)",
              px: 2,
              py: 0.5,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: "#ffffff" }}>
              Last Updated: {format(lastUpdated, "MMM d, yyyy h:mm a")}
            </Typography>
            <Chip
              size="small"
              label={isOffline ? "Offline Mode" : "Live Data"}
              color={isOffline ? "warning" : "success"}
              sx={{ height: 20, "& .MuiChip-label": { px: 1, py: 0 } }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* Region Filter */}
          <FormControl
            variant="outlined"
            size="small"
            sx={{
              minWidth: 150,
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "#FF6600" },
                "&:hover fieldset": { borderColor: "#FF6600" },
                "&.Mui-focused fieldset": { borderColor: "#FF6600" },
              },
              "& .MuiInputLabel-root": { color: "#FF6600" },
            }}
          >
            <InputLabel id="region-select-label">Region</InputLabel>
            <Select
              labelId="region-select-label"
              id="region-select"
              value={selectedRegion}
              onChange={handleRegionChange}
              label="Region"
            >
              <MenuItem value="All">All Regions</MenuItem>
              {Object.keys(REGIONS).map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* State Filter */}
          <FormControl
            variant="outlined"
            size="small"
            sx={{
              minWidth: 200,
              maxWidth: 400,
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "#FF6600" },
                "&:hover fieldset": { borderColor: "#FF6600" },
                "&.Mui-focused fieldset": { borderColor: "#FF6600" },
              },
              "& .MuiInputLabel-root": { color: "#FF6600" },
            }}
          >
            <InputLabel id="state-select-label">States</InputLabel>
            <Select
              labelId="state-select-label"
              id="state-select"
              multiple
              value={selectedStates}
              onChange={handleStateChange}
              input={<OutlinedInput label="States" />}
              renderValue={(selected) =>
                selected.map((s) => allStates[s] || s).join(", ")
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              {Object.entries(allStates).map(([code, name]) => (
                <MenuItem key={code} value={code}>
                  <Checkbox checked={selectedStates.indexOf(code) > -1} />
                  <ListItemText primary={`${code} - ${name}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress sx={{ color: "#FF6600" }} />
        </Box>
      )}

      {!loading && (
        <>
          {/* Facility count indicator */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
              backgroundColor: "rgba(255, 102, 0, 0.2)",
              p: 1,
              borderRadius: 1,
              width: "fit-content",
              mx: "auto",
            }}
          >
            <Typography variant="h6" sx={{ color: "#ffffff" }}>
              {facilityData.length === 0
                ? "No facilities match your filter criteria"
                : `Showing ${facilityData.length} ${
                    facilityData.length === 1 ? "facility" : "facilities"
                  }${
                    selectedStates.length > 0
                      ? ` in ${selectedStates.length} states`
                      : " nationwide"
                  }`}
            </Typography>
          </Box>

          {/* Dashboard Tabs */}
          <Box sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{
                "& .MuiTab-root": { color: "#f8f8f8" },
                "& .Mui-selected": { color: "#FF6600" },
                "& .MuiTabs-indicator": { backgroundColor: "#FF6600" },
              }}
            >
              <Tab label="Overview" />
              <Tab label="Facility Status" />
              <Tab label="Resource Allocation" />
            </Tabs>
          </Box>

          {/* Tab 1: Overview */}
          {tabValue === 0 && renderOverviewTab()}

          {/* Tab 2: Facility Status */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              {/* Facility Status Filters */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#003366" }}
                  >
                    Filter Facilities
                  </Typography>
                  <Grid container spacing={2}>
                    {/* Readiness Score Range Filter */}
                    <Grid item xs={12} md={6}>
                      <Typography gutterBottom sx={{ color: "#003366" }}>
                        Readiness Score Range: {readinessRange[0]} -{" "}
                        {readinessRange[1]}%
                      </Typography>
                      <Slider
                        value={readinessRange}
                        onChange={handleReadinessRangeChange}
                        valueLabelDisplay="auto"
                        min={70}
                        max={95}
                        sx={{
                          color: "#FF6600",
                          "& .MuiSlider-rail": { backgroundColor: "#ccd9e0" },
                        }}
                      />
                    </Grid>

                    {/* Hazard Level Filter */}
                    <Grid item xs={12} md={6}>
                      <FormControl
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                      >
                        <InputLabel
                          id="hazard-level-select-label"
                          sx={{ color: "#003366" }}
                        >
                          Hazard Level
                        </InputLabel>
                        <Select
                          labelId="hazard-level-select-label"
                          id="hazard-level-select"
                          multiple
                          value={selectedHazardLevels}
                          onChange={handleHazardLevelChange}
                          input={<OutlinedInput label="Hazard Level" />}
                          renderValue={(selected) => selected.join(", ")}
                          sx={{
                            color: "#003366",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#003366",
                            },
                          }}
                        >
                          {[
                            "Extreme",
                            "Very High",
                            "High",
                            "Moderate",
                            "Low",
                          ].map((level) => (
                            <MenuItem key={level} value={level}>
                              <Checkbox
                                checked={
                                  selectedHazardLevels.indexOf(level) > -1
                                }
                              />
                              <ListItemText primary={level} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#003366" }}
                  >
                    Facilities ({facilityData.length})
                  </Typography>
                  {facilityData.length === 0 ? (
                    <Typography
                      sx={{ color: "#003366", p: 2, textAlign: "center" }}
                    >
                      No facility data available for the selected area
                    </Typography>
                  ) : (
                    <>
                      <TableContainer>
                        <Table aria-label="facility status table">
                          <TableHead>
                            <TableRow>
                              <TableCell
                                sx={{ fontWeight: "bold", color: "#003366" }}
                              >
                                Facility Name
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: "bold", color: "#003366" }}
                              >
                                State
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: "bold", color: "#003366" }}
                              >
                                City
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: "bold", color: "#003366" }}
                              >
                                Hazard Level
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: "bold", color: "#003366" }}
                              >
                                Readiness Score
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: "bold", color: "#003366" }}
                              >
                                Bed Capacity
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: "bold", color: "#003366" }}
                              >
                                Medical Staff
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {facilityData
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((facility) => (
                                <TableRow key={facility.name}>
                                  <TableCell sx={{ color: "#003366" }}>
                                    {facility.name}
                                  </TableCell>
                                  <TableCell sx={{ color: "#003366" }}>
                                    {facility.state}
                                  </TableCell>
                                  <TableCell sx={{ color: "#003366" }}>
                                    {facility.city}
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={facility.hazardLevel}
                                      color={
                                        facility.hazardLevel === "Extreme"
                                          ? "error"
                                          : facility.hazardLevel === "Very High"
                                          ? "warning"
                                          : facility.hazardLevel === "High"
                                          ? "primary"
                                          : facility.hazardLevel === "Moderate"
                                          ? "info"
                                          : "success"
                                      }
                                      sx={{
                                        fontWeight: "bold",
                                        bgcolor:
                                          facility.hazardLevel === "Extreme"
                                            ? "#d32f2f"
                                            : facility.hazardLevel ===
                                              "Very High"
                                            ? "#ff9800"
                                            : facility.hazardLevel === "High"
                                            ? "#2196f3"
                                            : facility.hazardLevel ===
                                              "Moderate"
                                            ? "#03a9f4"
                                            : "#4caf50",
                                        color: "#ffffff",
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <CircularProgress
                                        variant="determinate"
                                        value={facility.readinessScore}
                                        size={30}
                                        sx={{
                                          color:
                                            facility.readinessScore >= 90
                                              ? "#4caf50"
                                              : facility.readinessScore >= 80
                                              ? "#2196f3"
                                              : facility.readinessScore >= 70
                                              ? "#ff9800"
                                              : "#f44336",
                                          mr: 1,
                                        }}
                                      />
                                      <Typography
                                        variant="body2"
                                        sx={{ color: "#003366" }}
                                      >
                                        {facility.readinessScore}%
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell sx={{ color: "#003366" }}>
                                    {facility.bedCapacity}
                                  </TableCell>
                                  <TableCell sx={{ color: "#003366" }}>
                                    {facility.emergencyStaff}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        component="div"
                        count={facilityData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                          color: "#003366",
                          ".MuiTablePagination-selectIcon": {
                            color: "#003366",
                          },
                          ".MuiTablePagination-select": { color: "#003366" },
                        }}
                      />
                    </>
                  )}
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Tab 3: Resource Allocation */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              {/* Resource Cards */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ backgroundColor: "#004080", color: "#ffffff" }}>
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ color: "#ffffff" }}
                        >
                          Emergency Supplies
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{ color: "#FF6600", fontWeight: "bold" }}
                        >
                          92%
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#f8f8f8" }}>
                          of target inventory
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ backgroundColor: "#004080", color: "#ffffff" }}>
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ color: "#ffffff" }}
                        >
                          Backup Power
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{ color: "#FF6600", fontWeight: "bold" }}
                        >
                          {facilityData.length > 0
                            ? `${facilityData.length}/${facilityData.length}`
                            : "130/130"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#f8f8f8" }}>
                          facilities equipped
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ backgroundColor: "#004080", color: "#ffffff" }}>
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ color: "#ffffff" }}
                        >
                          Water Reserves
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{ color: "#FF6600", fontWeight: "bold" }}
                        >
                          78%
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#f8f8f8" }}>
                          of target capacity
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ backgroundColor: "#004080", color: "#ffffff" }}>
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ color: "#ffffff" }}
                        >
                          Evacuation Routes
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{ color: "#FF6600", fontWeight: "bold" }}
                        >
                          {facilityData.length > 0
                            ? `${facilityData.length}/${facilityData.length}`
                            : "130/130"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#f8f8f8" }}>
                          facilities with verified plans
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>

              {/* Resource Charts */}
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#003366" }}
                  >
                    Bed Capacity Utilization
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 300,
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={resourceDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, value, percent }) =>
                            `${name}: ${value.toLocaleString()} (${(
                              percent * 100
                            ).toFixed(0)}%)`
                          }
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#FF6600" />
                          <Cell fill="#e6f7ff" />
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            color: "#003366",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Container>
  );
}

export default LocalDashboard;
