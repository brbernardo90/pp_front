import React, { useEffect, useState } from 'react';
import { Box, TextField, MenuItem, Button, Grid2, Avatar } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// Apartment interface
interface Apartment {
  id: number;
  block: string;
  number: number;
}

const Apartments: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]); // State to hold the fetched apartments
  const [blockFilter, setBlockFilter] = useState<string>('');
  const [numberFilter, setNumberFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch data from API when the component mounts
  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await fetch('https://pp-back.onrender.com/apartments');
        if (!response.ok) {
          throw new Error('Failed to fetch apartments');
        }
        const data = await response.json();
        setApartments(data); // Set the data to state
        setLoading(false); // Stop loading once data is fetched
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  // Filtering logic
  const filteredApartments = apartments.filter((apartment) => {
    const matchesBlock = blockFilter ? apartment.block === blockFilter : true;
    const matchesNumber = numberFilter
      ? apartment.number.toString().includes(numberFilter)
      : true;

    return matchesBlock && matchesNumber;
  });

  // Define the columns for the DataGrid
  const columns: GridColDef[] = [
    {
        field: 'block',
        headerName: 'Block',
        width: 150,
        renderCell: (params) => (
          <Avatar sx={{ bgcolor: params.value === 'A' ? 'blue' : 'green', marginRight: 2 }}>
            {params.value}
          </Avatar>
        ),
      },
    { field: 'number', headerName: 'Number', width: 150 },
  ];

  if (loading) {
    return <p>Loading apartments...</p>;
  }

  if (error) {
    return <p>Error fetching apartments: {error}</p>;
  }

  return (
    <div>
      <h2>Apartment List</h2>

      {/* First Row of Filters: Block and Apartment Number */}
      <Grid2 container spacing={2} alignItems="center">
        <Grid2 xs={12} sm={3}>
          <TextField
            select
            label="Block"
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
            fullWidth
            displayEmpty
          >
            <MenuItem value="">
              <em>All Blocks</em>
            </MenuItem>
            <MenuItem value="A">Block A</MenuItem>
            <MenuItem value="B">Block B</MenuItem>
          </TextField>
        </Grid2>

        <Grid2 xs={12} sm={3}>
          <TextField
            label="Apartment Number"
            type="number"
            value={numberFilter}
            onChange={(e) => setNumberFilter(e.target.value)}
            fullWidth
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
          />
        </Grid2>

        <Grid2 xs={12} sm={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setBlockFilter('');
              setNumberFilter('');
            }}
          >
            Reset Filters
          </Button>
        </Grid2>
      </Grid2>

      {/* Apartment List DataGrid */}
      <Box mt={3} sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredApartments.map((apartment) => ({
            ...apartment,
            id: apartment.id, // Ensure unique IDs
          }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection={false}
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
};

export default Apartments;
