import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const apiDomain = process.env.REACT_APP_API_DOMAIN || 'http://localhost:3000';

// Apartment association interface
interface ApartmentAssociation {
  id: number;
  block: string;
  number: number;
  relationship_type: string;
  start_date: string;
  end_date: string;
  apartment: {
    block: string;
    number: number;
  }
  resident: {
    name: string;
    phone: string;
  }

}

const ApartmentAssociationDetails: React.FC = () => {
  const { id, apartmentId } = useParams<{ id: string; apartmentId: string }>(); // Get resident and association ID from the URL
  const [association, setAssociation] = useState<ApartmentAssociation | null>(null); // State for storing the association details
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch apartment association details when the component mounts
  useEffect(() => {
    const fetchAssociation = async () => {
      try {
        const response = await fetch(`${apiDomain}/apartment_residents/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch apartment association');
        }
        const data = await response.json();
        setAssociation(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAssociation();
  }, [id, apartmentId]);

  // Handle loading and error states
  if (loading) {
    return <p>Loading apartment association...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!association) {
    return <p>Apartment association not found</p>;
  }

  // Handle deleting an association
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this association?')) {
      try {
        const response = await fetch(`${apiDomain}/apartment_residents/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Association deleted successfully');
          navigate(`/residents/${id}/apartments`);
        } else {
          alert('Failed to delete association');
        }
      } catch (err) {
        console.error('Error deleting association:', err);
        alert('Error deleting association');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Apartment Association Details
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>Block:</strong> {association.apartment.block}
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>Apartment Number:</strong> {association.apartment.number}
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>Nome:</strong> {association.resident.name}
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>Phone:</strong> {association.resident.phone}
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>Relationship:</strong> {association.relationship_type}
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>Start Date:</strong> {association.start_date}
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>End Date:</strong> {association.end_date}
        </Typography>

        {/* Button to edit the association */}
        <Box mt={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate(`/apartment_residents/${id}/edit`)}
          >
            Edit Association
          </Button>
        </Box>

        {/* Button to delete the association */}
        <Box mt={2}>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Remove Association
          </Button>
        </Box>

        {/* Button to go back to the apartment association list */}
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/residents/${id}/apartments`)}
          >
            Back to Association List
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ApartmentAssociationDetails;
