import React, { useEffect, useState } from 'react';
import { Box, Button, Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useParams, useNavigate } from 'react-router-dom';

const apiDomain = process.env.REACT_APP_API_DOMAIN || 'http://localhost:3000';

// Apartment association interface
interface ApartmentAssociation {
  id: number;
  block: string;
  number: number;
  relationship_type: string; // Owner or Renter
  start_date: string;   // Start of the association (YYYY-MM-DD)
  end_date: string;
  apartment: {
    block: string;
    number: string;
  };
}

const ApartmentAssociationList: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get resident ID from the URL
  const [associations, setAssociations] = useState<ApartmentAssociation[]>([]); // Apartment associations
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch all apartment associations for the resident
  useEffect(() => {
    const fetchAssociations = async () => {
      try {
        const response = await fetch(`${apiDomain}/residents/${id}/apartment_residents`);
        if (!response.ok) {
          throw new Error('Failed to fetch apartment associations');
        }
        const data = await response.json();
        setAssociations(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAssociations();
  }, [id]);

  // Define the columns for the DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'block', headerName: 'Block', width: 150 },
    { field: 'number', headerName: 'Apartment Number', width: 150 },
    { field: 'relationship_type', headerName: 'Relationship', width: 150 },
    { field: 'start_date', headerName: 'Start Date', width: 150 },
    { field: 'end_date', headerName: 'End Date', width: 150 },
  ];

  // Handle row click to navigate to details page
  const handleRowClick = (params: any) => {
    navigate(`/apartment_residents/${params.id}`);
  };

  // Handle loading and error states
  if (loading) {
    return <p>Loading apartment associations...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Container maxWidth="lg">
      <Box mt={4}>
        <h2>Apartment Associations</h2>

        {/* Apartment Associations DataGrid */}
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={associations.map((association) => ({
              id: association.id,
              block: association.apartment.block,
              number: association.apartment.number,
              relationship_type: association.relationship_type,
              start_date: association.start_date,
              end_date: association.end_date,
            }))}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 25]}
            onRowClick={handleRowClick} // Handle click to navigate to details
          />
        </Box>

        {/* Button to add new apartment association */}
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/residents/${id}/apartments/create`)}
          >
            Add New Association
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ApartmentAssociationList;
