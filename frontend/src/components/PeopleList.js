// frontend/src/components/PeopleList.js

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination
} from '@mui/material';

function PeopleList({ people }) {
  // Pagination state
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedPeople = people.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        People List
      </Typography>
      {people.length === 0 ? (
        <Typography>No people found for this group.</Typography>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Position</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPeople.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell>{person.first_name} {person.last_name}</TableCell>
                    <TableCell>{person.location}</TableCell>
                    <TableCell>{person.city}</TableCell>
                    <TableCell>{person.state}</TableCell>
                    <TableCell>{person.department}</TableCell>
                    <TableCell>{person.position}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={people.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
          />
        </Paper>
      )}
    </div>
  );
}

export default PeopleList;
