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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";

function PeopleList({ people = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

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

    // Step 3: Calculate total and pages
    const totalPeople = filteredPeople.length;
    const totalPages = Math.ceil(totalPeople / rowsPerPage);

    // Step 4: Get current page of people
    const startIndex = (page - 1) * rowsPerPage;
    const paginatedPeople = filteredPeople.slice(
      startIndex,
      startIndex + rowsPerPage
    );

    // Step 5: Group by facility for display (only for the current page)
    const facilitiesMap = {};

    paginatedPeople.forEach((person) => {
      const facilityKey = person.facilityName;

      if (!facilitiesMap[facilityKey]) {
        facilitiesMap[facilityKey] = {
          name: person.facilityName,
          city: person.facilityCity,
          state: person.facilityState,
          zip: person.facilityZip,
          people: [],
        };
      }

      facilitiesMap[facilityKey].people.push(person);
    });

    return {
      facilities: Object.values(facilitiesMap),
      totalPeople,
      totalPages,
    };
  }, [people, searchTerm, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
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
          setPage(1); // Reset to first page on new search
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
          {processedData.facilities.map((facility, facilityIndex) => (
            <Box key={facilityIndex} sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: 1,
                }}
              >
                <LocationOnIcon sx={{ color: "#FF6600", mr: 1, mt: 0.5 }} />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "#ffffff", fontWeight: 600 }}
                  >
                    {facility.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#b0bbd4" }}>
                    {facility.city}, {facility.state} {facility.zip}
                  </Typography>
                </Box>
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
                    {facility.people.map((person, personIndex) => (
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
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}

          {/* Bottom pagination */}
          {processedData.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" sx={{ color: "#b0bbd4", mb: 1 }}>
                  Showing{" "}
                  {Math.min(
                    (page - 1) * rowsPerPage + 1,
                    processedData.totalPeople
                  )}
                  -{Math.min(page * rowsPerPage, processedData.totalPeople)} of{" "}
                  {processedData.totalPeople} total contacts
                </Typography>
                <Pagination
                  count={processedData.totalPages}
                  page={page}
                  onChange={handleChangePage}
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
