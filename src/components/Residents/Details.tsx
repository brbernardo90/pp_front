import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, Container, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
const apiDomain = process.env.REACT_APP_API_DOMAIN || 'http://localhost:3000';

// Updated Resident interface to include multiple apartments
interface Resident {
  id: number;
  name: string;
  phone: string;
  apartments: {
    id: number;
    block: string;
    number: number;
    relationship: string; // e.g. 'Owner' or 'Renter'
    start_date: string;   // Start of the association (YYYY-MM-DD)
    end_date: string; 
  }[];
}

const ResidentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the resident ID from the URL
  const [resident, setResident] = useState<Resident | null>(null); // State for storing the resident details
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const navigate = useNavigate(); // To navigate between pages

  // Fetch resident data when the component mounts
  useEffect(() => {
    const fetchResident = async () => {
      try {
        const response = await fetch(`${apiDomain}/residents/${id}/details`);
        if (!response.ok) {
          throw new Error('Failed to fetch resident');
        }
        const data = await response.json();
        setResident(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchResident();
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
  if (!resident) {
    return <p>Resident not found</p>;
  }

  // Define columns for the DataGrid
  const columns: GridColDef[] = [
    { field: 'block', headerName: 'Block', width: 150 },
    { field: 'number', headerName: 'Apartment Number', width: 150 },
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
          Resident Details
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>Name:</strong> {resident.name}
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>Phone:</strong> {resident.phone}
        </Typography>

        {/* Associated Apartments */}
        <Box mt={4}>
          <Typography variant="h5" component="h2" gutterBottom>
            Associated Apartments
          </Typography>

          {/* DataGrid for displaying associated apartments */}
          <Box sx={{ width: '100%' }}>
            <DataGrid
              rows={resident.apartments.map((apartment) => ({
                id: apartment.id,
                block: apartment.block,
                number: apartment.number,
                relationship: apartment.relationship,
                start_date: apartment.start_date,
                end_date: apartment.end_date,
              }))}
              columns={columns}
              pageSize={resident.apartments.length} // Set the page size to show all rows
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
            onClick={() => navigate(`/residents/${resident.id}/apartments`)}
          >
            Configuration
          </Button>
        </Box>

        {/* Button to navigate back to the resident list */}
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/residents')}
          >
            Back to Resident List
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ResidentDetails;
