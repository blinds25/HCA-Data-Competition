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
  LinearProgress,
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

  // Render statistics cards with improved spacing
  const renderStatisticsCards = () => (
    <Box sx={{ mb: 3, mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: "100%", p: 2, bgcolor: "#1a2a3a" }}>
            <CardContent sx={{ pt: 2, pb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, color: "#ffffff" }}>
                TOTAL FACILITIES
              </Typography>
              <Typography variant="h3" sx={{ mb: 1, color: "#FF6600" }}>
                {facilityData.length || 130}
              </Typography>
              <Typography variant="body2" sx={{ color: "#c0c0c0", pb: 1 }}>
                Healthcare facilities nationwide
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: "100%", p: 2, bgcolor: "#1a2a3a" }}>
            <CardContent sx={{ pt: 2, pb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, color: "#ffffff" }}>
                AVG READINESS SCORE
              </Typography>
              <Typography variant="h3" sx={{ mb: 1, color: "#FF6600" }}>
                {facilityData.length > 0
                  ? (
                      facilityData.reduce(
                        (sum, facility) => sum + facility.readinessScore,
                        0
                      ) / facilityData.length
                    ).toFixed(1)
                  : "76.2"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#c0c0c0", pb: 1 }}>
                National preparedness average
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: "100%", p: 2, bgcolor: "#1a2a3a" }}>
            <CardContent sx={{ pt: 2, pb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, color: "#ffffff" }}>
                TOTAL BED CAPACITY
              </Typography>
              <Typography variant="h3" sx={{ mb: 1, color: "#FF6600" }}>
                {totalBeds > 0 ? totalBeds.toLocaleString() : "24,682"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#c0c0c0", pb: 1 }}>
                Available beds across the network
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: "100%", p: 2, bgcolor: "#1a2a3a" }}>
            <CardContent sx={{ pt: 2, pb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, color: "#ffffff" }}>
                EMERGENCY STAFF
              </Typography>
              <Typography variant="h3" sx={{ mb: 1, color: "#FF6600" }}>
                {totalStaff > 0 ? totalStaff.toLocaleString() : "9,845"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#c0c0c0", pb: 1 }}>
                Emergency trained personnel
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Add a weather updates slider component
  const renderWeatherUpdates = () => {
    const [currentUpdate, setCurrentUpdate] = useState(0);

    // Sample weather updates
    const weatherUpdates = [
      {
        state: "Florida",
        alert:
          "Hurricane warning in effect for coastal regions. All facilities on emergency protocols.",
        severity: "High",
      },
      {
        state: "Texas",
        alert:
          "Severe thunderstorms expected in Eastern counties. Power outages possible.",
        severity: "Medium",
      },
      {
        state: "California",
        alert:
          "Wildfire danger remains high in Northern counties. Air quality monitoring advised.",
        severity: "High",
      },
      {
        state: "Louisiana",
        alert:
          "Flash flood warning for southern parishes. Transport routes may be affected.",
        severity: "Medium",
      },
      {
        state: "Missouri",
        alert:
          "Tornado watch in effect until 9PM. All facilities advised to review shelter protocols.",
        severity: "High",
      },
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentUpdate((prev) => (prev + 1) % weatherUpdates.length);
      }, 5000); // Change every 5 seconds

      return () => clearInterval(interval);
    }, []);

    const update = weatherUpdates[currentUpdate];

    return (
      <Box
        sx={{
          width: "100%",
          mb: 3,
          mt: 2,
          p: 2,
          bgcolor:
            update.severity === "High"
              ? "rgba(255, 0, 0, 0.1)"
              : "rgba(255, 102, 0, 0.1)",
          borderLeft:
            update.severity === "High" ? "4px solid red" : "4px solid #FF6600",
          borderRadius: 1,
          transition: "background-color 0.5s ease",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontSize: "0.9rem", color: "#ffffff", fontWeight: "bold" }}
        >
          WEATHER ALERT: {update.state}
        </Typography>
        <Typography variant="body1" sx={{ color: "#ffffff" }}>
          {update.alert}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="caption" sx={{ color: "#ffffff" }}>
            Severity: {update.severity}
          </Typography>
          <Typography variant="caption" sx={{ color: "#ffffff" }}>
            {currentUpdate + 1} of {weatherUpdates.length}
          </Typography>
        </Box>
      </Box>
    );
  };

  // Render the Overview tab with draggable grid
  const renderOverviewTab = () => {
    return (
      <Box sx={{ p: 2 }}>
        {/* Status cards */}
        {renderStatisticsCards()}

        {/* Weather Updates Slider - NEW */}
        {renderWeatherUpdates()}

        {/* Draggable grid with improved spacing */}
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          onLayoutChange={handleLayoutChange}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 12, sm: 12, xs: 1, xxs: 1 }}
          rowHeight={100}
          containerPadding={[10, 10]}
          margin={[20, 20]}
        >
          {/* Hurricane and Severe Weather Incidents */}
          <Box
            key="hurricaneIncidents"
            data-grid={{ x: 0, y: 0, w: 6, h: 2.5, static: false }}
            sx={{
              bgcolor: "#1a2a3a",
              borderRadius: 2,
              p: 2,
              position: "relative",
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ color: "#ffffff", mb: 2, mt: 1 }}>
              INCIDENT TRENDS: HURRICANE & SEVERE WEATHER
            </Typography>
            <Box sx={{ height: "calc(100% - 50px)", width: "100%" }}>
              <BarChart
                width={500}
                height={200}
                data={monthlyIncidents}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hurricaneCount" fill="#FF6600" />
                <Bar dataKey="severeWeatherCount" fill="#003366" />
              </BarChart>
            </Box>
          </Box>

          {/* Facilities by Hazard Level - Improved spacing for title */}
          <Box
            key="facilitiesByHazard"
            data-grid={{ x: 6, y: 0, w: 6, h: 2.5, static: false }}
            sx={{
              bgcolor: "#1a2a3a",
              borderRadius: 2,
              p: 2,
              position: "relative",
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ color: "#ffffff", mb: 2, mt: 1 }}>
              FACILITIES BY HAZARD LEVEL
            </Typography>
            <Box sx={{ height: "calc(100% - 50px)", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hazardDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                      index,
                    }) => {
                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#fff"
                          textAnchor={x > cx ? "start" : "end"}
                          dominantBaseline="central"
                        >
                          {hazardDistribution[index].name} (
                          {(percent * 100).toFixed(0)}%)
                        </text>
                      );
                    }}
                    outerRadius={80}
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
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          {/* State Distribution */}
          <Box
            key="stateDistribution"
            data-grid={{ x: 0, y: 2.5, w: 6, h: 2.5, static: false }}
            sx={{
              bgcolor: "#1a2a3a",
              borderRadius: 2,
              p: 2,
              position: "relative",
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ color: "#ffffff", mb: 2, mt: 1 }}>
              FACILITIES BY STATE
            </Typography>
            <Box sx={{ height: "calc(100% - 50px)", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stateDistribution}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="state"
                    type="category"
                    tick={{ fill: "#ffffff" }}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#FF6600" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          {/* Alert Status */}
          <Box
            key="alertStatus"
            data-grid={{ x: 6, y: 2.5, w: 6, h: 2.5, static: false }}
            sx={{
              bgcolor: "#1a2a3a",
              borderRadius: 2,
              p: 2,
              position: "relative",
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ color: "#ffffff", mb: 2, mt: 1 }}>
              CURRENT ALERT STATUS
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "calc(100% - 50px)",
                justifyContent: "space-around",
              }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(255, 0, 0, 0.2)",
                  p: 2,
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <Typography variant="subtitle1" sx={{ color: "#ffffff" }}>
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    HIGH ALERT:
                  </span>{" "}
                  Hurricane warning for Florida coast (Category 3)
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: "rgba(255, 165, 0, 0.2)",
                  p: 2,
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <Typography variant="subtitle1" sx={{ color: "#ffffff" }}>
                  <span style={{ color: "orange", fontWeight: "bold" }}>
                    MODERATE ALERT:
                  </span>{" "}
                  Severe flooding in Louisiana (12 facilities affected)
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: "rgba(255, 255, 0, 0.1)",
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle1" sx={{ color: "#ffffff" }}>
                  <span style={{ color: "yellow", fontWeight: "bold" }}>
                    LOW ALERT:
                  </span>{" "}
                  Power outages in Tennessee (3 facilities on backup power)
                </Typography>
              </Box>
            </Box>
          </Box>
        </ResponsiveGridLayout>
      </Box>
    );
  };

  // Resource allocation tab with fixed text contrast and horizontal resource actions
  const renderResourceAllocationTab = () => {
    return (
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Emergency Supplies Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: "#1a2a3a", height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, color: "#ffffff" }}>
                  Emergency Supplies
                </Typography>
                <Typography variant="h3" sx={{ color: "#FF6600" }}>
                  {facilityData.length > 0
                    ? `${Math.round(facilityData.length * 0.88)}/${
                        facilityData.length
                      }`
                    : "114/130"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#c0c0c0" }}>
                  Facilities with adequate supply levels
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Backup Power Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: "#1a2a3a", height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, color: "#ffffff" }}>
                  Backup Power
                </Typography>
                <Typography variant="h3" sx={{ color: "#FF6600" }}>
                  {facilityData.length > 0
                    ? `${facilityData.length}/${facilityData.length}`
                    : "130/130"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#c0c0c0" }}>
                  Facilities with generator capacity
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Water Reserves Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: "#1a2a3a", height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, color: "#ffffff" }}>
                  Water Reserves
                </Typography>
                <Typography variant="h3" sx={{ color: "#FF6600" }}>
                  {facilityData.length > 0
                    ? `${Math.round(facilityData.length * 0.79)}/${
                        facilityData.length
                      }`
                    : "103/130"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#c0c0c0" }}>
                  Facilities with 72+ hour reserves
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Evacuation Routes Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: "#1a2a3a", height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, color: "#ffffff" }}>
                  Evacuation Routes
                </Typography>
                <Typography variant="h3" sx={{ color: "#FF6600" }}>
                  {facilityData.length > 0
                    ? `${Math.round(facilityData.length * 0.92)}/${
                        facilityData.length
                      }`
                    : "120/130"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#c0c0c0" }}>
                  Facilities with verified routes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* First Row: Bed Capacity Utilization */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: "#1a2a3a", height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: "#ffffff" }}>
                  Bed Capacity Utilization
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={resourceDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                        labelLine={{ stroke: "#ccc" }}
                      >
                        {resourceDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <Box
                                sx={{
                                  bgcolor: "#fff",
                                  p: 1,
                                  border: "1px solid #ccc",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#000" }}
                                >
                                  {payload[0].name}: {payload[0].value}%
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#000" }}
                                >
                                  {payload[0].payload.description}
                                </Typography>
                              </Box>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Critical Resources By Facility */}
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: "#1a2a3a", height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: "#ffffff" }}>
                  Critical Resources By Facility
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{ maxHeight: 300, bgcolor: "#2c3e50" }}
                >
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ bgcolor: "#1a2a3a", color: "#ffffff" }}
                        >
                          Facility
                        </TableCell>
                        <TableCell
                          sx={{ bgcolor: "#1a2a3a", color: "#ffffff" }}
                        >
                          Emergency Power
                        </TableCell>
                        <TableCell
                          sx={{ bgcolor: "#1a2a3a", color: "#ffffff" }}
                        >
                          Water Supply
                        </TableCell>
                        <TableCell
                          sx={{ bgcolor: "#1a2a3a", color: "#ffffff" }}
                        >
                          Medical Oxygen
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(facilityData.length > 0
                        ? facilityData.slice(0, 5)
                        : [
                            {
                              name: "Memorial Hospital",
                              state: "FL",
                              readinessScore: 85,
                            },
                            {
                              name: "Community Medical Center",
                              state: "TX",
                              readinessScore: 92,
                            },
                            {
                              name: "University Hospital",
                              state: "CA",
                              readinessScore: 78,
                            },
                            {
                              name: "Regional Medical Center",
                              state: "NC",
                              readinessScore: 63,
                            },
                            {
                              name: "General Hospital",
                              state: "NY",
                              readinessScore: 80,
                            },
                          ]
                      ).map((facility, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ color: "#ffffff" }}>
                            {facility.name}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                Math.random() > 0.2 ? "Operational" : "Limited"
                              }
                              sx={{
                                bgcolor:
                                  Math.random() > 0.2
                                    ? "rgba(46, 204, 113, 0.2)"
                                    : "rgba(255, 102, 0, 0.2)",
                                color:
                                  Math.random() > 0.2 ? "#2ecc71" : "#ff6600",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                Math.random() > 0.3 ? "Operational" : "Critical"
                              }
                              sx={{
                                bgcolor:
                                  Math.random() > 0.3
                                    ? "rgba(46, 204, 113, 0.2)"
                                    : "rgba(231, 76, 60, 0.2)",
                                color:
                                  Math.random() > 0.3 ? "#2ecc71" : "#e74c3c",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                Math.random() > 0.15 ? "Operational" : "Low"
                              }
                              sx={{
                                bgcolor:
                                  Math.random() > 0.15
                                    ? "rgba(46, 204, 113, 0.2)"
                                    : "rgba(255, 102, 0, 0.2)",
                                color:
                                  Math.random() > 0.15 ? "#2ecc71" : "#ff6600",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recommended Resource Actions - Now in horizontal layout */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: "#1a2a3a", mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: "#ffffff" }}>
                Recommended Resource Actions
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {(facilityData.length > 0
                  ? facilityData
                      .filter((f) => f.readinessScore < 70)
                      .slice(0, 4)
                  : [
                      {
                        name: "Regional Medical Center",
                        state: "NC",
                        readinessScore: 63,
                      },
                      {
                        name: "St. Luke's Hospital",
                        state: "LA",
                        readinessScore: 58,
                      },
                      {
                        name: "City General Hospital",
                        state: "MS",
                        readinessScore: 65,
                      },
                      {
                        name: "County Memorial",
                        state: "AL",
                        readinessScore: 67,
                      },
                    ]
                ).map((facility, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: "1 1 300px",
                      bgcolor: "rgba(231, 76, 60, 0.1)",
                      p: 2,
                      borderRadius: 1,
                      border: "1px solid rgba(231, 76, 60, 0.3)",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "#ffffff", fontWeight: "bold" }}
                    >
                      {facility.name} ({facility.state})
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#ffffff", mb: 1 }}
                    >
                      Readiness Score:{" "}
                      <span style={{ color: "#e74c3c" }}>
                        {facility.readinessScore}
                      </span>
                      /100
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#ffffff" }}>
                      Immediate Need:{" "}
                      {
                        [
                          "Backup generator maintenance",
                          "Water reserve increase",
                          "Oxygen supply replenishment",
                          "Staff emergency training",
                        ][index % 4]
                      }
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  sx={{ color: "#ffffff", borderColor: "#ffffff" }}
                >
                  View Full Report
                </Button>
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#FF6600", color: "#ffffff" }}
                >
                  Generate Resource Allocation Plan
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
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
          Healthcare Facility Dashboard
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#ffffff", mt: 1 }}>
          Real-time monitoring of healthcare facility readiness and resources
        </Typography>

        {/* Last updated status with better spacing */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
            mb: 3,
          }}
        >
          <Typography variant="body2" sx={{ color: "#c0c0c0" }}>
            Last Updated: {format(lastUpdated, "MMM d, yyyy h:mm a")}
          </Typography>
        </Box>
      </Box>

      {/* Filters with better spacing */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FormControl
          sx={{ minWidth: 200, bgcolor: "#1a2a3a", borderRadius: 1 }}
          size="small"
        >
          <InputLabel id="region-label" sx={{ color: "#ffffff" }}>
            Region
          </InputLabel>
          <Select
            labelId="region-label"
            value={selectedRegion}
            label="Region"
            onChange={handleRegionChange}
            sx={{ color: "#ffffff" }}
          >
            <MenuItem value="">
              <em>All Regions</em>
            </MenuItem>
            <MenuItem value="northeast">Northeast</MenuItem>
            <MenuItem value="southeast">Southeast</MenuItem>
            <MenuItem value="midwest">Midwest</MenuItem>
            <MenuItem value="southwest">Southwest</MenuItem>
            <MenuItem value="west">West</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          sx={{ minWidth: 200, bgcolor: "#1a2a3a", borderRadius: 1 }}
          size="small"
        >
          <InputLabel id="state-label" sx={{ color: "#ffffff" }}>
            State
          </InputLabel>
          <Select
            labelId="state-label"
            value={selectedState}
            label="State"
            onChange={handleStateChange}
            sx={{ color: "#ffffff" }}
          >
            <MenuItem value="">
              <em>All States</em>
            </MenuItem>
            {availableStates.map((state) => (
              <MenuItem key={state} value={state}>
                {getStateName(state)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Loading indicator */}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* Tabs with content */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="dashboard tabs"
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="Overview" id="tab-0" />
          <Tab label="Facility Status" id="tab-1" />
          <Tab label="Resource Allocation" id="tab-2" />
        </Tabs>
      </Box>

      {/* Tab content */}
      {!loading && (
        <>
          {tabValue === 0 && renderOverviewTab()}
          {tabValue === 1 && (
            <Box sx={{ p: 2 }}>
              {/* Readiness Score Range Filter */}
              <Box sx={{ mb: 4 }}>
                <Typography gutterBottom sx={{ color: "#ffffff" }}>
                  Readiness Score Range: {readinessRange[0]} -{" "}
                  {readinessRange[1]}
                </Typography>
                <Slider
                  value={readinessRange}
                  onChange={handleReadinessRangeChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  sx={{ color: "#FF6600" }}
                />
              </Box>

              {/* Hazard Level Filter */}
              <Box sx={{ mb: 4 }}>
                <Typography gutterBottom sx={{ color: "#ffffff" }}>
                  Hazard Level:
                </Typography>
                <FormControl sx={{ width: "100%" }}>
                  <Select
                    multiple
                    value={selectedHazardLevels}
                    onChange={handleHazardLevelChange}
                    renderValue={(selected) => selected.join(", ")}
                    sx={{ color: "#ffffff", bgcolor: "#1a2a3a" }}
                  >
                    {["Low", "Moderate", "High", "Severe"].map((level) => (
                      <MenuItem key={level} value={level}>
                        <Checkbox
                          checked={selectedHazardLevels.indexOf(level) > -1}
                        />
                        <ListItemText primary={level} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Facilities Table */}
              <TableContainer
                component={Paper}
                sx={{ bgcolor: "#1a2a3a", overflow: "hidden" }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#122234" }}>
                      <TableCell sx={{ color: "#ffffff" }}>
                        Facility Name
                      </TableCell>
                      <TableCell sx={{ color: "#ffffff" }}>State</TableCell>
                      <TableCell sx={{ color: "#ffffff" }}>City</TableCell>
                      <TableCell sx={{ color: "#ffffff" }}>
                        Hazard Level
                      </TableCell>
                      <TableCell sx={{ color: "#ffffff" }}>
                        Readiness Score
                      </TableCell>
                      <TableCell sx={{ color: "#ffffff" }}>
                        Bed Capacity
                      </TableCell>
                      <TableCell sx={{ color: "#ffffff" }}>
                        Medical Staff
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedFacilities
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((facility, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:hover": { bgcolor: "#234567" },
                            bgcolor: index % 2 === 0 ? "#1a2a3a" : "#1f3347",
                          }}
                        >
                          <TableCell sx={{ color: "#ffffff" }}>
                            {facility.name}
                          </TableCell>
                          <TableCell sx={{ color: "#ffffff" }}>
                            {facility.state}
                          </TableCell>
                          <TableCell sx={{ color: "#ffffff" }}>
                            {facility.city}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={facility.hazardLevel}
                              sx={{
                                bgcolor:
                                  facility.hazardLevel === "Low"
                                    ? "rgba(46, 204, 113, 0.2)"
                                    : facility.hazardLevel === "Moderate"
                                    ? "rgba(241, 196, 15, 0.2)"
                                    : facility.hazardLevel === "High"
                                    ? "rgba(230, 126, 34, 0.2)"
                                    : "rgba(231, 76, 60, 0.2)",
                                color:
                                  facility.hazardLevel === "Low"
                                    ? "#2ecc71"
                                    : facility.hazardLevel === "Moderate"
                                    ? "#f1c40f"
                                    : facility.hazardLevel === "High"
                                    ? "#e67e22"
                                    : "#e74c3c",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box
                                sx={{
                                  width: "100%",
                                  mr: 1,
                                  bgcolor: "#234567",
                                  borderRadius: 1,
                                }}
                              >
                                <LinearProgress
                                  variant="determinate"
                                  value={facility.readinessScore}
                                  sx={{
                                    height: 10,
                                    borderRadius: 1,
                                    [`& .MuiLinearProgress-bar`]: {
                                      bgcolor:
                                        facility.readinessScore < 60
                                          ? "#e74c3c"
                                          : facility.readinessScore < 80
                                          ? "#f39c12"
                                          : "#2ecc71",
                                    },
                                  }}
                                />
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{ color: "#ffffff", minWidth: 35 }}
                              >
                                {facility.readinessScore}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: "#ffffff" }}>
                            {facility.bedCapacity}
                          </TableCell>
                          <TableCell sx={{ color: "#ffffff" }}>
                            {facility.medicalStaff}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50]}
                  component="div"
                  count={displayedFacilities.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{ color: "#ffffff" }}
                />
              </TableContainer>
            </Box>
          )}
          {tabValue === 2 && renderResourceAllocationTab()}
        </>
      )}
    </Container>
  );
}

export default LocalDashboard;
