// frontend/src/components/PeopleList.js

import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Typography, TablePagination 
} from '@mui/material';

function PeopleList({ people }) {
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
      <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
        Facility List
      </Typography>
      {people.length === 0 ? (
        <Typography sx={{ color: '#003366' }}>No facilities found for this group.</Typography>
      ) : (
        <Paper sx={{ backgroundColor: '#f8f8f8' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#003366' }}>Name</TableCell>
                  <TableCell sx={{ color: '#003366' }}>Location</TableCell>
                  <TableCell sx={{ color: '#003366' }}>City</TableCell>
                  <TableCell sx={{ color: '#003366' }}>State</TableCell>
                  <TableCell sx={{ color: '#003366' }}>Department</TableCell>
                  <TableCell sx={{ color: '#003366' }}>Position</TableCell>
                  <TableCell sx={{ color: '#003366' }}>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPeople.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell sx={{ color: '#003366' }}>
                      {person.first_name} {person.last_name}
                    </TableCell>
                    <TableCell sx={{ color: '#003366' }}>
                      {person.location}
                    </TableCell>
                    <TableCell sx={{ color: '#003366' }}>
                      {person.city}
                    </TableCell>
                    <TableCell sx={{ color: '#003366' }}>
                      {person.state}
                    </TableCell>
                    <TableCell sx={{ color: '#003366' }}>
                      {person.department}
                    </TableCell>
                    <TableCell sx={{ color: '#003366' }}>
                      {person.position}
                    </TableCell>
                    <TableCell sx={{ color: '#003366' }}>
                      {person.email}
                    </TableCell>
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
            sx={{
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                color: '#FF6600',
              },
              '& .MuiTablePagination-selectIcon': {
                color: '#FF6600',
              },
              '& .MuiTablePagination-actions': {
                color: '#FF6600',
              },
            }}
          />
        </Paper>
      )}
    </div>
  );
}

export default PeopleList;
