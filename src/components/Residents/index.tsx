import React, { useEffect, useState } from 'react';
import { Box, TextField, MenuItem, Button, Grid2 } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

const apiDomain = process.env.REACT_APP_API_DOMAIN || 'http://localhost:3000';

// Resident interface
interface Resident {
  id: number;
  name: string;
  phone: string;
  apartment: {
    block: string;
    number: number;
  };
}

const ResidentList: React.FC = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [apartmentFilter, setApartmentFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await fetch(`${apiDomain}/residents`);
        if (!response.ok) {
          throw new Error('Failed to fetch residents');
        }
        const data = await response.json();
        setResidents(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchResidents();
  }, []);

  const filteredResidents = residents.filter((resident) => {
    const matchesName = nameFilter
      ? resident.name.toLowerCase().includes(nameFilter.toLowerCase())
      : true;
    const matchesApartment = apartmentFilter
      ? `${resident.apartment.block}${resident.apartment.number}`.includes(apartmentFilter)
      : true;

    return matchesName && matchesApartment;
  });

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    // {
    //   field: 'apartment',
    //   headerName: 'Apartment',
    //   width: 150,
    //   valueGetter: (params) => `${params.row.apartment.block} ${params.row.apartment.number}`,
    // },
  ];

    // Redirect on row click
    const handleRowClick = (params: GridRowParams) => {
        navigate(`/residents/${params.id}`);
        };

  if (loading) {
    return <p>Loading residents...</p>;
  }

  if (error) {
    return <p>Error fetching residents: {error}</p>;
  }

  return (
    <div>
      <h2>Resident List</h2>

      {/* Filters */}
      <Grid2 container spacing={2} alignItems="center">
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <TextField
            label="Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            fullWidth
          />
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 3 }}>
          <TextField
            label="Apartment"
            value={apartmentFilter}
            onChange={(e) => setApartmentFilter(e.target.value)}
            fullWidth
          />
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 3 }} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/residents/create')}
          >
            New Resident
          </Button>
        </Grid2>
      </Grid2>

      {/* Resident List DataGrid */}
      <Box mt={3} sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredResidents.map((resident) => ({
            ...resident,
            id: resident.id,
          }))}
          columns={columns}
          checkboxSelection={false}
          onRowClick={handleRowClick} // Add this to handle row clicks
        />
      </Box>
    </div>
  );
};

export default ResidentList;
