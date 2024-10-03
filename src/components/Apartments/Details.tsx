import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, Container, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
const apiDomain = process.env.REACT_APP_API_DOMAIN || 'http://localhost:3000';

// Updated Resident interface to include multiple apartments
interface Apartment {
  id: number;
  block: string;
  number: number;

  residents: {
    id: number;
    name: string;
    phone: string;
    relationship: string; // e.g. 'Owner' or 'Renter'
    start_date: string;   // Start of the association (YYYY-MM-DD)
    end_date: string; 
  }[];
}

const ApartmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the apartment ID from the URL
  const [apartment, setApartment] = useState<Apartment | null>(null); // State for storing the apartment details
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const navigate = useNavigate(); // To navigate between pages

  // Fetch apartment data when the component mounts
  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const response = await fetch(`${apiDomain}/apartments/${id}/details`);
        if (!response.ok) {
          throw new Error('Failed to fetch apartment');
        }
        const data = await response.json();
        setApartment(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchApartment();
  }, [id]);

  // Display loading message while data is being fetched
  if (loading) {
    return <p>Loading resident details...</p>;
  }

  // Display error message if fetching data fails
  if (error) {
    return <p>Error fetching resident details: {error}</p>;
  }

  // Return null if no resident is found
  if (!apartment) {
    return <p>Resident not found</p>;
  }

  // Define columns for the DataGrid
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'relationship', headerName: 'Relationship', width: 150 },
    { field: 'start_date', headerName: 'Start Date', width: 150 },
    { 
      field: 'end_date', 
      headerName: 'End Date', 
      width: 150, 
      // valueGetter: (params) => params.row.end_date ? params.row.end_date : 'Present' // Handle ongoing associations
    },
  ];

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Apartment Details
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>Block:</strong> {apartment.block}
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>Number:</strong> {apartment.number}
        </Typography>

        {/* Associated Apartments */}
        <Box mt={4}>
          <Typography variant="h5" component="h2" gutterBottom>
            Associated Residents
          </Typography>

          {/* DataGrid for displaying associated apartments */}
          <Box sx={{ width: '100%' }}>
            <DataGrid
              rows={apartment.residents.map((resident) => ({
                id: resident.id,
                name: resident.name,
                phone: resident.phone,
                relationship: resident.relationship,
                start_date: resident.start_date,
                end_date: resident.end_date,
              }))}
              columns={columns}
              pageSize={apartment.residents.length} // Set the page size to show all rows
              pagination={false} // Disable pagination
              checkboxSelection={false}
            />
          </Box>
        </Box>

        {/* Button to go to the page for associating apartments */}
        <Box mt={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate(`/apartments/${apartment.id}/history`)}
          >
            Histórico
          </Button>
        </Box>

        {/* Button to navigate back to the resident list */}
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/apartments')}
          >
            Back to Apartment List
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ApartmentDetails;
