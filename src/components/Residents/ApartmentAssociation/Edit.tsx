import React, { useState, useEffect } from 'react';
import { Container, Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const apiDomain = process.env.REACT_APP_API_DOMAIN || 'http://localhost:3000';

// Apartment association interface
interface ApartmentAssociation {
  id: number;
  relationship_type: string;
  start_date: string;   // Start of the association (YYYY-MM-DD)
  end_date: string;
  apartment: {
    block: string;
    number: number;
  }
}

// Apartment interface
interface Apartment {
  id: number;
  block: string;
  number: number;
}

const ApartmentAssociationEdit: React.FC = () => {
  const { id, apartmentId } = useParams<{ id: string; apartmentId: string }>(); // Get resident ID and association ID from the URL
  const [association, setAssociation] = useState<ApartmentAssociation | null>(null); // Apartment association details
  const [apartments, setApartments] = useState<Apartment[]>([]); // Available apartments
  const [selectedApartmentId, setSelectedApartmentId] = useState<number | null>(null);
  const [relationship_type, setRelationshipType] = useState<string>('Owner'); // Owner or Renter
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const navigate = useNavigate();

  // Fetch the existing apartment association
  useEffect(() => {
    const fetchAssociation = async () => {
      const response = await fetch(`${apiDomain}/apartment_residents/${id}`);
      const data = await response.json();
      setAssociation(data);
      setSelectedApartmentId(data.apartment.id); // Preselect the existing apartment
      setRelationshipType(data.relationship_type); // Preselect the existing relationship_type
      setStartDate(data.start_date.split('T')[0]); // Preselect the existing relationship_type
      setEndDate(data.end_date); // Preselect the existing relationship_type
    };

    fetchAssociation();
  }, [id, apartmentId]);

  // Fetch available apartments
  useEffect(() => {
    const fetchApartments = async () => {
      const response = await fetch(`${apiDomain}/apartments`);
      const data = await response.json();
      setApartments(data);
    };

    fetchApartments();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    if (selectedApartmentId && association) {
      const formData = {
        id: id,
        // apartment_id: selectedApartmentId,
        relationship_type: relationship_type.toLowerCase(),
        start_date: startDate,
        end_date: endDate,
      };

      try {
        const response = await fetch(`${apiDomain}/apartment_residents/${id}}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert('Apartment association updated successfully');
          navigate(`/apartment_residents/${id}`);
        } else {
          alert('Failed to update apartment association');
        }
      } catch (err) {
        console.error('Error:', err);
        alert('Error during submission');
      }
    }
  };

  if (!association) {
    return <p>Loading...</p>;
  }

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <h2>Edit Apartment Association</h2>

        {/* Select Apartment */}
        {/* <FormControl fullWidth margin="normal">
          <InputLabel id="apartment-label">Select Apartment</InputLabel>
          <Select
            labelId="apartment-label"
            value={selectedApartmentId}
            onChange={(e) => setSelectedApartmentId(e.target.value as number)}
          >
            {apartments.map((apartment) => (
              <MenuItem key={apartment.id} value={apartment.id}>
                {apartment.block} {apartment.number}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
        <Typography variant="body1" paragraph>
          <strong>Block:</strong> {association.apartment.block}
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>Apartment Number:</strong> {association.apartment.number}
        </Typography>

        {/* Select Relationship_type (Owner/Renter) */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="relationship_type-label">Relationship</InputLabel>
          <Select
            labelId="relationship_type-label"
            value={relationship_type}
            onChange={(e) => setRelationshipType(e.target.value as string)}
          >
            <MenuItem value="Owner">Owner</MenuItem>
            <MenuItem value="Renter">Renter</MenuItem>
          </Select>
        </FormControl>

             {/* Start Date */}
        <TextField
            fullWidth
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            margin="normal"
        />

        {/* End Date */}
        <TextField
            fullWidth
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            margin="normal"
        />

        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ApartmentAssociationEdit;
