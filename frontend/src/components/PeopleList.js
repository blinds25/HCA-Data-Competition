// frontend/src/components/PeopleList.js

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  InputAdornment,
  Typography,
  Pagination,
  Button,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import SendIcon from "@mui/icons-material/Send";
import PeopleIcon from "@mui/icons-material/People";

function PeopleList({ people = [], onContactFacility }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [facilitiesPage, setFacilitiesPage] = useState(1);
  const [employeePages, setEmployeePages] = useState({});

  const FACILITIES_PER_PAGE = 6;
  const EMPLOYEES_PER_FACILITY_PAGE = 8;

  // Use useMemo to avoid recalculating on every render
  const processedData = useMemo(() => {
    // Step 1: Create a simple flat list of all people with facility information
    const allPeopleWithFacility = people.map((person) => ({
      id: `${person.id || Math.random().toString(36)}`,
      firstName: person.first_name || "",
      lastName: person.last_name || "",
      department: person.department || "N/A",
      position: person.position || "N/A",
      email: person.email || "N/A",
      facilityName: person.location || "Unknown Facility",
      facilityCity: person.city || "",
      facilityState: person.state || "",
      facilityZip: person.zip_code || "",
      latitude: person.latitude || "",
      longitude: person.longitude || "",
    }));

    // Step 2: Filter the flat list based on search term
    const filteredPeople = searchTerm
      ? allPeopleWithFacility.filter((person) => {
          const searchLower = searchTerm.toLowerCase();
          return (
            person.firstName.toLowerCase().includes(searchLower) ||
            person.lastName.toLowerCase().includes(searchLower) ||
            person.department.toLowerCase().includes(searchLower) ||
            person.position.toLowerCase().includes(searchLower) ||
            person.email.toLowerCase().includes(searchLower) ||
            person.facilityName.toLowerCase().includes(searchLower) ||
            person.facilityCity.toLowerCase().includes(searchLower) ||
            person.facilityState.toLowerCase().includes(searchLower) ||
            person.facilityZip.toLowerCase().includes(searchLower)
          );
        })
      : allPeopleWithFacility;

    // Step 3: Group by facility
    const facilitiesMap = {};

    filteredPeople.forEach((person) => {
      const facilityKey = person.facilityName;

      if (!facilitiesMap[facilityKey]) {
        facilitiesMap[facilityKey] = {
          name: person.facilityName,
          city: person.facilityCity,
          state: person.facilityState,
          zip: person.facilityZip,
          latitude: person.latitude,
          longitude: person.longitude,
          people: [],
        };
      }

      facilitiesMap[facilityKey].people.push(person);
    });

    // Convert facilities map to array
    const facilitiesArray = Object.values(facilitiesMap);

    // Calculate total pages for facilities
    const totalFacilitiesPages = Math.ceil(
      facilitiesArray.length / FACILITIES_PER_PAGE
    );

    // Calculate current slice of facilities to display
    const startIndex = (facilitiesPage - 1) * FACILITIES_PER_PAGE;
    const currentFacilities = facilitiesArray.slice(
      startIndex,
      startIndex + FACILITIES_PER_PAGE
    );

    return {
      facilities: currentFacilities,
      totalFacilities: facilitiesArray.length,
      totalFacilitiesPages,
      totalPeople: filteredPeople.length,
      allFacilities: facilitiesArray,
    };
  }, [people, searchTerm, facilitiesPage]);

  // Initialize employee pagination state if needed
  React.useEffect(() => {
    const newEmployeePages = { ...employeePages };
    let changed = false;

    processedData.facilities.forEach((facility) => {
      if (!(facility.name in newEmployeePages)) {
        newEmployeePages[facility.name] = 1;
        changed = true;
      }
    });

    if (changed) {
      setEmployeePages(newEmployeePages);
    }
  }, [processedData.facilities, employeePages]);

  // Handle page change for facilities
  const handleChangeFacilitiesPage = (event, newPage) => {
    setFacilitiesPage(newPage);
  };

  // Handle page change for employees within a facility
  const handleChangeEmployeePage = (facilityName, newPage) => {
    setEmployeePages((prev) => ({
      ...prev,
      [facilityName]: newPage,
    }));
  };

  // Calculate employees to display for a given facility
  const getDisplayedEmployees = (facility) => {
    const currentPage = employeePages[facility.name] || 1;
    const startIndex = (currentPage - 1) * EMPLOYEES_PER_FACILITY_PAGE;
    return facility.people.slice(
      startIndex,
      startIndex + EMPLOYEES_PER_FACILITY_PAGE
    );
  };

  // Calculate total employee pages for a facility
  const getEmployeePagesCount = (facility) => {
    return Math.ceil(facility.people.length / EMPLOYEES_PER_FACILITY_PAGE);
  };

  // Handle contact facility button click
  const handleContactFacility = (facility) => {
    if (onContactFacility) {
      onContactFacility(facility);
    }
  };

  // If no people, show message
  if (people.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" sx={{ color: "#ffffff", mb: 2 }}>
          No facilities found in this area
        </Typography>
        <Typography variant="body2" sx={{ color: "#b0bbd4" }}>
          Try adjusting the radius to see more results
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search facilities or people..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setFacilitiesPage(1); // Reset to first page on new search
          setEmployeePages({}); // Reset employee pages
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#FF6600" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            color: "#ffffff",
            borderRadius: 1,
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.2)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 255, 255, 0.3)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#FF6600",
            },
          },
        }}
      />

      {processedData.facilities.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" sx={{ color: "#ffffff" }}>
            No results found matching your search.
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: "#b0bbd4" }}>
              Showing {processedData.facilities.length} facilities of{" "}
              {processedData.totalFacilities} total
              {processedData.totalPeople > 0 &&
                ` • ${processedData.totalPeople} people`}
            </Typography>
          </Box>

          {processedData.facilities.map((facility, facilityIndex) => (
            <Box key={facilityIndex} sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <LocationOnIcon sx={{ color: "#FF6600", mr: 1, mt: 0.5 }} />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ color: "#ffffff", fontWeight: 600 }}
                    >
                      {facility.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#b0bbd4" }}>
                      {facility.city}, {facility.state} {facility.zip} •{" "}
                      {facility.people.length} people
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<SendIcon />}
                  onClick={() => handleContactFacility(facility)}
                  sx={{
                    color: "#FF6600",
                    borderColor: "rgba(255, 102, 0, 0.5)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 102, 0, 0.1)",
                      borderColor: "#FF6600",
                    },
                  }}
                >
                  Contact
                </Button>
              </Box>

              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: "#1f3154",
                  borderRadius: 1,
                  mb: 2,
                  boxShadow: "none",
                  "& .MuiTableCell-root": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    color: "#ffffff",
                  },
                }}
              >
                <Table>
                  <TableHead sx={{ backgroundColor: "#192841" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getDisplayedEmployees(facility).map(
                      (person, personIndex) => (
                        <TableRow
                          key={personIndex}
                          hover
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                            },
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <PersonIcon
                                sx={{ color: "#b0bbd4", mr: 1, fontSize: 20 }}
                              />
                              <span>
                                {person.firstName} {person.lastName}
                              </span>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <BusinessIcon
                                sx={{ color: "#b0bbd4", mr: 1, fontSize: 18 }}
                              />
                              <span>{person.department}</span>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <WorkIcon
                                sx={{ color: "#b0bbd4", mr: 1, fontSize: 18 }}
                              />
                              <span>{person.position}</span>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <EmailIcon
                                sx={{ color: "#b0bbd4", mr: 1, fontSize: 18 }}
                              />
                              <span>{person.email}</span>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Employee pagination controls */}
              {getEmployeePagesCount(facility) > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <Button
                    disabled={employeePages[facility.name] <= 1}
                    onClick={() =>
                      handleChangeEmployeePage(
                        facility.name,
                        employeePages[facility.name] - 1
                      )
                    }
                    sx={{ minWidth: "auto", color: "#b0bbd4" }}
                  >
                    <NavigateBeforeIcon />
                  </Button>
                  <Typography
                    sx={{
                      mx: 2,
                      color: "#b0bbd4",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Page {employeePages[facility.name] || 1} of{" "}
                    {getEmployeePagesCount(facility)}
                  </Typography>
                  <Button
                    disabled={
                      employeePages[facility.name] >=
                      getEmployeePagesCount(facility)
                    }
                    onClick={() =>
                      handleChangeEmployeePage(
                        facility.name,
                        employeePages[facility.name] + 1
                      )
                    }
                    sx={{ minWidth: "auto", color: "#b0bbd4" }}
                  >
                    <NavigateNextIcon />
                  </Button>
                </Box>
              )}

              <Divider
                sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 2 }}
              />
            </Box>
          ))}

          {/* Facilities pagination controls */}
          {processedData.totalFacilitiesPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" sx={{ color: "#b0bbd4", mb: 1 }}>
                  Showing facilities{" "}
                  {(facilitiesPage - 1) * FACILITIES_PER_PAGE + 1}-
                  {Math.min(
                    facilitiesPage * FACILITIES_PER_PAGE,
                    processedData.totalFacilities
                  )}{" "}
                  of {processedData.totalFacilities}
                </Typography>
                <Pagination
                  count={processedData.totalFacilitiesPages}
                  page={facilitiesPage}
                  onChange={handleChangeFacilitiesPage}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "#ffffff",
                    },
                    "& .Mui-selected": {
                      backgroundColor: "rgba(255, 102, 0, 0.2)",
                      color: "#FF6600",
                    },
                  }}
                />
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default PeopleList;
